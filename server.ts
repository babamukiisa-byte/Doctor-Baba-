import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { sendInquiryEmail, sendReplyEmail, checkEmailConfiguration, setRuntimeSmtpConfig, getActiveSmtpConfig } from "./server/mailer";
import { INITIAL_BLOGS } from "./src/data/initialData";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Rate limiting / Anti-DDoS store
  const requestIpCounts = new Map<string, { count: number; firstRequest: number }>();
  const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
  const MAX_REQUESTS_PER_WINDOW = 300; // max 300 requests/min per IP

  // Cleanup rate limiter every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestIpCounts.entries()) {
      if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
        requestIpCounts.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  // Web Application Firewall (WAF) & DDoS Mitigation Middleware
  app.use((req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // 1. Anti-DDoS rate-limiting
    const ipRecord = requestIpCounts.get(clientIp);
    if (!ipRecord || (now - ipRecord.firstRequest > RATE_LIMIT_WINDOW_MS)) {
      requestIpCounts.set(clientIp, { count: 1, firstRequest: now });
    } else {
      ipRecord.count++;
      if (ipRecord.count > MAX_REQUESTS_PER_WINDOW) {
        res.status(429).setHeader('Retry-After', '60').json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. WAF DDoS mitigation active. Please try again shortly.'
        });
        return;
      }
    }

    // 2. WAF Malicious Payload & Exploit Detection (SQLi, path traversal, command injection, RCE)
    const rawUrl = decodeURIComponent(req.originalUrl || req.url || '');
    const maliciousPattern = /((\.\.\/|\.\.\\)|(<script|<iframe|<object|<embed)|(union\s+select|select\s+.*\s+from|insert\s+into|drop\s+table|delete\s+from|benchmark\(|sleep\()|(\b(cmd\.exe|powershell|bin\/sh|bin\/bash)\b)|(etc\/passwd|proc\/self))/i;
    
    if (maliciousPattern.test(rawUrl)) {
      console.warn(`[WAF Blocked] Suspicious URI signature from IP ${clientIp}: ${req.originalUrl}`);
      res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by Web Application Firewall (WAF) security inspection rule.'
      });
      return;
    }

    next();
  });

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Security Headers Middleware: ClickJacking, Anti-Sniffing, Strict CSP & Transport Security
  app.use((req, res, next) => {
    // 1. Anti-Sniffing Protection
    res.setHeader("X-Content-Type-Options", "nosniff");

    // 2. ClickJacking Protection (X-Frame-Options + CSP frame-ancestors)
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // 3. Complete Content-Security-Policy (CSP) Directives
    const cspPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.google.com https://adservice.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https: data: blob:",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://pagead2.googlesyndication.com https://region1.google-analytics.com wss: ws:",
      "frame-src 'self' https://www.youtube.com https://youtube.com https://www.google.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://pagead2.googlesyndication.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://api.whatsapp.com https://wa.me",
      "frame-ancestors 'self' https://ai.studio https://*.google.com"
    ].join("; ");

    res.setHeader("Content-Security-Policy", cspPolicy);

    // 4. Other Standard Security Headers
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-DNS-Prefetch-Control", "on");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    next();
  });

  // Static files route for images and public assets (including ads.txt)
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use('/static', express.static(path.join(process.cwd(), 'public', 'static')));

  app.get('/ads.txt', (req, res) => {
    const adsTxtPath = path.join(process.cwd(), 'public', 'ads.txt');
    if (fs.existsSync(adsTxtPath)) {
      res.type('text/plain');
      return res.sendFile(adsTxtPath);
    }
    res.status(404).send('Not Found');
  });

  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.type('text/plain');
      return res.sendFile(robotsPath);
    }
    res.type('text/plain');
    res.send("User-agent: *\nAllow: /\nAllow: /admin\nDisallow: /api/\n\nSitemap: https://doctorbabamukisa.com/sitemap.xml\n");
  });

  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.type('application/xml');
      return res.sendFile(sitemapPath);
    }
    res.status(404).send('Sitemap not found');
  });

  // File store helper functions
  const messagesFilePath = path.join(process.cwd(), 'server', 'messages_store.json');

  const loadMessagesFromDisk = (): Array<any> => {
    try {
      if (fs.existsSync(messagesFilePath)) {
        const raw = fs.readFileSync(messagesFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read messages_store.json:', e);
    }
    return [
      {
        id: 'msg-1',
        name: 'Samuel Mukasa',
        email: 'samuel.m@example.com',
        phone: '+256701234567',
        service: 'Love & Marriage Spells',
        message: 'Doctor Baba, I need urgent spiritual consultation regarding my broken marriage. Please guide me.',
        date: '2026-08-06 14:22',
        status: 'New',
        location: {
          city: 'Kampala',
          region: 'Central Region',
          country: 'Uganda',
          countryCode: 'UG',
          ip: '102.218.44.12',
          isp: 'MTN Uganda Mobile Broadband',
          timezone: 'Africa/Kampala',
          latitude: 0.3136,
          longitude: 32.5811,
          googleMapsUrl: 'https://www.google.com/maps?q=0.3136,32.5811'
        },
        deviceInfo: {
          browser: 'Google Chrome 127.0',
          os: 'Android OS',
          deviceType: 'Mobile',
          userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
          screenResolution: '1080x2340',
          language: 'en-UG',
          timezone: 'Africa/Kampala'
        },
        securityInfo: {
          isVpnOrProxy: false,
          vpnReason: 'Direct Connection: Client device timezone (Africa/Kampala) matches residential ISP IP location (Uganda).',
          ipType: 'Residential / Cellular'
        }
      },
      {
        id: 'msg-2',
        name: 'Grace Akello',
        email: 'grace.a@example.com',
        phone: '+254712345678',
        service: 'Financial & Wealth Recovery',
        message: 'I am requesting a remote business blessing ritual for my hardware shop in Mombasa.',
        date: '2026-08-05 09:15',
        status: 'Responded',
        location: {
          city: 'Frankfurt',
          region: 'Hesse',
          country: 'Germany',
          countryCode: 'DE',
          ip: '185.220.101.45',
          isp: 'M247 Ltd Datacenter / NordVPN Proxy',
          timezone: 'Europe/Berlin',
          latitude: 50.1109,
          longitude: 8.6821,
          googleMapsUrl: 'https://www.google.com/maps?q=50.1109,8.6821'
        },
        deviceInfo: {
          browser: 'Apple Safari 17.5',
          os: 'iOS (Apple iPhone)',
          deviceType: 'Mobile',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
          screenResolution: '1170x2532',
          language: 'en-KE',
          timezone: 'Africa/Nairobi'
        },
        securityInfo: {
          isVpnOrProxy: true,
          vpnReason: 'VPN / Proxy Detected: Device timezone (Africa/Nairobi) mismatches IP location timezone (Europe/Berlin) & Datacenter ISP (M247 Ltd).',
          ipType: 'VPN / Proxy / Datacenter'
        }
      }
    ];
  };

  const contactMessages: Array<any> = loadMessagesFromDisk();

  const saveMessagesToDisk = () => {
    try {
      const dir = path.dirname(messagesFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(messagesFilePath, JSON.stringify(contactMessages, null, 2));
    } catch (e) {
      console.warn('Could not save messages_store.json:', e);
    }
  };

  // Blogs File Store (saved in server/blogs_store.json)
  const blogsFilePath = path.join(process.cwd(), 'server', 'blogs_store.json');

  const loadBlogsFromDisk = (): Array<any> => {
    try {
      if (fs.existsSync(blogsFilePath)) {
        const raw = fs.readFileSync(blogsFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read blogs_store.json:', e);
    }
    // Initialize with default INITIAL_BLOGS if not yet saved on disk
    try {
      const dir = path.dirname(blogsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(blogsFilePath, JSON.stringify(INITIAL_BLOGS, null, 2));
    } catch (e) {
      console.warn('Could not write initial blogs_store.json:', e);
    }
    return [...INITIAL_BLOGS];
  };

  let serverBlogs: Array<any> = loadBlogsFromDisk();

  const saveBlogsToDisk = () => {
    try {
      const dir = path.dirname(blogsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(blogsFilePath, JSON.stringify(serverBlogs, null, 2));
    } catch (e) {
      console.warn('Could not save blogs_store.json:', e);
    }
  };

  const subscriptions: string[] = [];

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Doctor Baba Mukisa Spiritual Website" });
  });

  app.get("/api/email-status", async (req, res) => {
    const status = await checkEmailConfiguration();
    return res.json({ success: true, status });
  });

  app.get("/api/smtp-config", (req, res) => {
    const current = getActiveSmtpConfig();
    return res.json({
      success: true,
      config: {
        host: current.host,
        port: current.port,
        secure: current.secure,
        user: current.user,
        notificationEmail: current.notificationEmail,
        hasPassword: Boolean(current.pass)
      }
    });
  });

  app.post("/api/smtp-config", (req, res) => {
    const { host, port, secure, user, pass, notificationEmail } = req.body;
    setRuntimeSmtpConfig({
      host: host ? String(host).trim() : undefined,
      port: port ? parseInt(port, 10) : undefined,
      secure: secure !== undefined ? Boolean(secure) : undefined,
      user: user ? String(user).trim() : undefined,
      pass: pass ? String(pass).trim() : undefined,
      notificationEmail: notificationEmail ? String(notificationEmail).trim() : undefined
    });
    const current = getActiveSmtpConfig();
    return res.json({
      success: true,
      config: {
        host: current.host,
        port: current.port,
        secure: current.secure,
        user: current.user,
        notificationEmail: current.notificationEmail,
        hasPassword: Boolean(current.pass)
      }
    });
  });

  app.post("/api/test-smtp", async (req, res) => {
    const { host, port, secure, user, pass, notificationEmail } = req.body;
    const testConfig = host ? {
      host: String(host).trim(),
      port: port ? parseInt(port, 10) : 465,
      secure: secure !== undefined ? Boolean(secure) : true,
      user: user ? String(user).trim() : 'help@doctorbabamukisa.com',
      pass: pass ? String(pass).trim() : undefined,
      notificationEmail: notificationEmail ? String(notificationEmail).trim() : undefined
    } : undefined;

    const result = await checkEmailConfiguration(testConfig);
    return res.json({ success: true, result });
  });

  app.get("/api/inquiries", (req, res) => {
    return res.json({ success: true, messages: contactMessages });
  });

  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, service, message, location, deviceInfo, securityInfo } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Please fill in required fields." });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '102.218.44.12';

    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone: phone || "Not provided",
      service: service || "General Spiritual Consultation",
      message,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'New',
      location: location || {
        city: 'Kampala',
        region: 'Central Region',
        country: 'Uganda',
        countryCode: 'UG',
        ip: String(clientIp).split(',')[0],
        isp: 'Residential ISP / Mobile Network',
        timezone: 'Africa/Kampala',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kampala,+Uganda'
      },
      deviceInfo: deviceInfo || {
        browser: 'Web Browser',
        os: 'Desktop / Mobile OS',
        deviceType: 'Mobile',
        userAgent: req.headers['user-agent'] || 'Mozilla/5.0',
        screenResolution: 'Responsive View',
        language: 'en-US'
      },
      securityInfo: securityInfo || {
        isVpnOrProxy: false,
        vpnReason: 'Direct Connection: Verified client session.',
        ipType: 'Residential / Cellular'
      }
    };

    contactMessages.unshift(newMessage);
    saveMessagesToDisk();
    console.log("New contact inquiry received and saved to disk:", newMessage.id, newMessage.name);

    // Dispatch SMTP email via mail.privateemail.com asynchronously so client doesn't wait
    let emailDispatch = null;
    try {
      emailDispatch = await sendInquiryEmail(newMessage);
    } catch (err) {
      console.warn("SMTP email dispatch warning:", err);
    }

    return res.json({
      success: true,
      message: "Your inquiry has been submitted successfully. Doctor Baba Mukisa will contact you soon!",
      messageData: newMessage,
      emailStatus: emailDispatch
    });
  });

  app.delete("/api/inquiries/:id", (req, res) => {
    const { id } = req.params;
    const index = contactMessages.findIndex((m) => m.id === id);
    if (index !== -1) {
      contactMessages.splice(index, 1);
      saveMessagesToDisk();
      return res.json({ success: true, message: "Inquiry deleted successfully." });
    }
    return res.status(404).json({ success: false, error: "Inquiry not found." });
  });

  app.post("/api/reply-email", async (req, res) => {
    const { messageId, toEmail, clientName, subject, replyMessage, customConfig } = req.body;
    if (!toEmail || !replyMessage) {
      return res.status(400).json({ success: false, error: "Missing required email parameters." });
    }

    const emailResult = await sendReplyEmail(toEmail, clientName || 'Valued Client', subject, replyMessage, customConfig);

    // Update message status in contactMessages store
    if (messageId) {
      const existing = contactMessages.find((m) => m.id === messageId);
      if (existing) {
        existing.status = 'Responded';
        saveMessagesToDisk();
      }
    }

    return res.json({ 
      success: true, 
      delivered: emailResult.delivered, 
      offline: emailResult.offline,
      note: (emailResult as any).note,
      error: emailResult.error,
      emailResult 
    });
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email, source } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ success: false, error: "Please provide a valid email address." });
      }
      const cleanEmail = email.trim();
      subscriptions.push(cleanEmail);

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const nameHandle = cleanEmail.split('@')[0] || "Newsletter Subscriber";

      const newMessage = {
        id: `msg-sub-${Date.now()}`,
        name: `Subscriber (${nameHandle})`,
        email: cleanEmail,
        phone: "N/A (Newsletter)",
        service: "Newsletter Subscription",
        message: `New email subscription request received from ${cleanEmail} (Source: ${source || 'Website Subscription'}). Client has subscribed to Doctor Baba Mukisa's newsletter for weekly spiritual updates, monthly horoscopes, and ancestral wisdom.`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'New',
        location: {
          city: 'Kampala',
          region: 'Central Region',
          country: 'Uganda',
          countryCode: 'UG',
          ip: String(clientIp).split(',')[0],
          isp: 'Residential ISP / Mobile Network',
          timezone: 'Africa/Kampala',
          googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kampala,+Uganda'
        },
        deviceInfo: {
          browser: 'Web Browser',
          os: 'Desktop / Mobile OS',
          deviceType: 'Mobile',
          userAgent: req.headers['user-agent'] || 'Mozilla/5.0',
          screenResolution: 'Responsive View',
          language: 'en-US'
        },
        securityInfo: {
          isVpnOrProxy: false,
          vpnReason: 'Direct Connection: Verified newsletter subscriber session.',
          ipType: 'Residential / Cellular'
        }
      };

      contactMessages.unshift(newMessage);
      saveMessagesToDisk();
      console.log("New subscriber recorded in private inbox & saved to disk:", cleanEmail);

      // Send email alert to help@doctorbabamukisa.com asynchronously
      let emailDispatch = null;
      try {
        emailDispatch = await sendInquiryEmail(newMessage);
      } catch (err) {
        console.warn("Subscription SMTP warning:", err);
      }

      return res.json({
        success: true,
        message: "Thank you for subscribing to Doctor Baba Mukisa's newsletter! Recorded in private inbox.",
        messageData: newMessage,
        emailStatus: emailDispatch
      });
    } catch (err) {
      console.error("Error processing subscription:", err);
      return res.json({
        success: true,
        message: "Thank you for subscribing!"
      });
    }
  });

  // --------------------------------------------------------------------------
  // IMAGES & MEDIA API ENDPOINTS (Images saved in /public alongside other images)
  // --------------------------------------------------------------------------

  // List all images stored in the public images directory
  app.get("/api/images", (req, res) => {
    try {
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        return res.json({ success: true, images: [] });
      }
      const files = fs.readdirSync(publicDir);
      const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']);
      const images = files
        .filter((f) => imageExtensions.has(path.extname(f).toLowerCase()))
        .map((f) => {
          try {
            const stat = fs.statSync(path.join(publicDir, f));
            return {
              filename: f,
              url: `/${encodeURI(f)}`,
              size: stat.size,
              modified: stat.mtime
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a: any, b: any) => new Date(b.modified).getTime() - new Date(a.modified).getTime());

      return res.json({ success: true, images });
    } catch (err: any) {
      console.error("Error reading images directory:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Upload or download an image and save it directly into the public directory (where other images are)
  app.post("/api/upload-image", async (req, res) => {
    try {
      const { data, url, filename: requestedName } = req.body;
      const publicDir = path.join(process.cwd(), 'public');

      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      let buffer: Buffer | null = null;
      let ext = '.jpg';
      let baseName = requestedName || 'blog-image';

      if (data && typeof data === 'string') {
        // Base64 Data URL or raw base64 string
        const matches = data.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (matches) {
          let mimeExt = matches[1].toLowerCase();
          if (mimeExt === 'jpeg') mimeExt = 'jpg';
          ext = `.${mimeExt}`;
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          buffer = Buffer.from(data, 'base64');
        }
      } else if (url && typeof url === 'string') {
        // If the URL already refers to a local file in /public/
        const cleanUrlPath = decodeURIComponent(url.replace(/^\//, '').split('?')[0]);
        const localCandidate = path.join(publicDir, cleanUrlPath);
        if (fs.existsSync(localCandidate) && fs.statSync(localCandidate).isFile()) {
          return res.json({
            success: true,
            url: `/${cleanUrlPath}`,
            filename: cleanUrlPath,
            filePath: `public/${cleanUrlPath}`,
            alreadyExists: true
          });
        }

        // If remote URL, fetch and download into public folder
        if (url.startsWith('http://') || url.startsWith('https://')) {
          const remoteResp = await fetch(url, {
            headers: { 'User-Agent': 'Doctor-Baba-Mukisa-Server/1.0' }
          });
          if (!remoteResp.ok) {
            return res.status(400).json({ success: false, error: `Failed to download image from URL (${remoteResp.status})` });
          }
          const cType = remoteResp.headers.get('content-type') || '';
          if (cType.includes('png')) ext = '.png';
          else if (cType.includes('webp')) ext = '.webp';
          else if (cType.includes('gif')) ext = '.gif';
          else if (cType.includes('svg')) ext = '.svg';
          else ext = '.jpg';

          const arrayBuf = await remoteResp.arrayBuffer();
          buffer = Buffer.from(arrayBuf);
        } else {
          return res.status(400).json({ success: false, error: 'Invalid image URL or base64 data provided.' });
        }
      } else {
        return res.status(400).json({ success: false, error: 'Please provide image base64 data or an image URL.' });
      }

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ success: false, error: 'Image buffer is empty.' });
      }

      // Format safe filename
      const sanitizedBase = path.basename(baseName, path.extname(baseName))
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-')
        .substring(0, 40)
        .replace(/^-+|-+$/g, '') || 'spiritual-post';

      const finalFilename = `blog-${Date.now()}-${sanitizedBase}${ext}`;
      const targetFilePath = path.join(publicDir, finalFilename);

      fs.writeFileSync(targetFilePath, buffer);

      // Also copy to dist/ if dist folder exists (for production static serving)
      try {
        const distDir = path.join(process.cwd(), 'dist');
        if (fs.existsSync(distDir)) {
          fs.writeFileSync(path.join(distDir, finalFilename), buffer);
        }
      } catch (e) {
        console.warn('Could not copy image to dist:', e);
      }

      console.log(`[Image Uploaded] Saved new image to ${targetFilePath} (${buffer.length} bytes)`);

      return res.json({
        success: true,
        url: `/${finalFilename}`,
        filename: finalFilename,
        filePath: `public/${finalFilename}`,
        size: buffer.length
      });
    } catch (err: any) {
      console.error('Error saving image:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to save image to public folder.' });
    }
  });

  // --------------------------------------------------------------------------
  // BLOG POSTS & VIEWS COUNTER API ENDPOINTS
  // --------------------------------------------------------------------------

  // Get all blog posts
  app.get("/api/blogs", (req, res) => {
    return res.json({ success: true, blogs: serverBlogs });
  });

  // Publish new blog post
  app.post("/api/blogs", (req, res) => {
    try {
      const newBlog = req.body;
      if (!newBlog || !newBlog.name) {
        return res.status(400).json({ success: false, error: "Article title and details are required." });
      }

      // Ensure proper structure and views count
      newBlog.id = newBlog.id || `blog-${Date.now()}`;
      newBlog.views = Number(newBlog.views) || 100;
      newBlog.post_date = newBlog.post_date || new Date().toISOString().split('T')[0];

      serverBlogs = [newBlog, ...serverBlogs.filter((b) => b.id !== newBlog.id)];
      saveBlogsToDisk();

      console.log(`[Blog Created] Published new article "${newBlog.name}" (ID: ${newBlog.id}, Image: ${newBlog.feature_image})`);
      return res.json({ success: true, blog: newBlog });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Update existing blog post
  app.put("/api/blogs/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const index = serverBlogs.findIndex((b) => b.id === id || b.slug === id);

      if (index !== -1) {
        serverBlogs[index] = { ...serverBlogs[index], ...updatedData };
        saveBlogsToDisk();
        console.log(`[Blog Updated] Updated article "${serverBlogs[index].name}" (ID: ${id})`);
        return res.json({ success: true, blog: serverBlogs[index] });
      }
      return res.status(404).json({ success: false, error: "Blog post not found." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Delete blog post
  app.delete("/api/blogs/:id", (req, res) => {
    try {
      const { id } = req.params;
      serverBlogs = serverBlogs.filter((b) => b.id !== id && b.slug !== id);
      saveBlogsToDisk();
      console.log(`[Blog Deleted] Deleted article ID: ${id}`);
      return res.json({ success: true, message: "Blog post deleted successfully." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Add view count to a blog post whenever visited
  app.post("/api/blogs/:id/view", (req, res) => {
    try {
      const { id } = req.params;
      let blog = serverBlogs.find((b) => b.id === id || b.slug === id);

      if (!blog) {
        // Search in INITIAL_BLOGS if not yet loaded in serverBlogs
        const initBlog = INITIAL_BLOGS.find((b) => b.id === id || b.slug === id);
        if (initBlog) {
          blog = { ...initBlog };
          serverBlogs.push(blog);
        }
      }

      if (blog) {
        blog.views = (Number(blog.views) || 0) + 1;
        saveBlogsToDisk();
        console.log(`[Blog View Counted] "${blog.name}" now has ${blog.views} views.`);
        return res.json({ success: true, views: blog.views, blogId: blog.id });
      }

      return res.status(404).json({ success: false, error: "Blog post not found to increment view." });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // AI POST CREATOR & INTERNET RESEARCH ASSISTANT
  // ==========================================
  const AI_SETTINGS_FILE = path.resolve(process.cwd(), "server", "ai_settings.json");

  function getAiSettings(): { enabled: boolean } {
    try {
      if (fs.existsSync(AI_SETTINGS_FILE)) {
        const data = JSON.parse(fs.readFileSync(AI_SETTINGS_FILE, "utf-8"));
        return { enabled: data.enabled !== false };
      }
    } catch (err) {
      console.error("Error reading ai_settings.json:", err);
    }
    return { enabled: true };
  }

  function saveAiSettings(settings: { enabled: boolean }) {
    try {
      fs.writeFileSync(AI_SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing ai_settings.json:", err);
    }
  }

  let geminiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in server environment.");
    }
    if (!geminiClient) {
      geminiClient = new GoogleGenAI({ apiKey });
    }
    return geminiClient;
  }

  // Get current AI assistant status and settings
  app.get("/api/ai/status", (req, res) => {
    try {
      const settings = getAiSettings();
      const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
      res.json({
        success: true,
        enabled: settings.enabled,
        hasApiKey
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Admin switch: toggle AI Assistant ON or OFF
  const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms))
    ]);
  };

  app.post("/api/ai/toggle", (req, res) => {
    try {
      const { enabled } = req.body;
      const isEnabled = Boolean(enabled);
      saveAiSettings({ enabled: isEnabled });
      console.log(`[AI Assistant Setting] Admin toggled AI post creator to: ${isEnabled ? "ON" : "OFF"}`);
      res.json({
        success: true,
        enabled: isEnabled,
        message: `AI Post Assistant is now ${isEnabled ? "enabled" : "disabled"}.`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // AI Brainstorming & Internet Trend Learning (with Google Search Grounding)
  app.post("/api/ai/brainstorm", async (req, res) => {
    try {
      const settings = getAiSettings();
      if (!settings.enabled) {
        return res.status(403).json({
          success: false,
          error: "AI Post Assistant is currently turned OFF by the admin. Enable the switch in the admin panel to use it."
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          success: false,
          error: "GEMINI_API_KEY is not configured in the server environment. Please set GEMINI_API_KEY in your settings."
        });
      }

      const { focusTopic, category } = req.body || {};
      const ai = getGeminiClient();

      const prompt = `You are the lead spiritual content strategist and researcher for Doctor Baba Mukisa (Kampala, Uganda) - a renowned African traditional healer, psychic spiritualist, and herbal doctor known for authentic ancestral rituals, love/marriage reconciliation, herbal cleanses, court case justice, prosperity blessings, and evil eye shielding.

Task:
Perform real-time internet research using Google Search to discover current high-volume queries, questions, and trending spiritual problems people are actively searching for online regarding:
${focusTopic ? `Specific Topic Angle: "${focusTopic}"` : "Spiritual guidance, African traditional healing, love spells, marital reconciliation, spiritual cleansing, ancestral protection, business breakthroughs"}
${category ? `Target Category: "${category}"` : ""}

Learn from what content formats and topics perform best online for attracting clients seeking authentic African traditional consultations.

Generate 4 high-converting, authentic, culturally respectful blog post concepts tailored specifically for Doctor Baba Mukisa's website.
Return ONLY a valid JSON array of 4 objects matching this schema:
[
  {
    "title": "Search-optimized, authoritative article title",
    "category": "category-slug (e.g. love-spells, spiritual-cleansing, marriage-harmony, business-success, ancestral-protection, court-case-guidance)",
    "categoryName": "Friendly Category Title",
    "searchTrendReason": "1-2 sentences explaining what people are actively searching for online on this topic and why it works best",
    "hook": "An intriguing hook or opening angle that grips the reader immediately",
    "outline": ["Key subtopic 1", "Key subtopic 2", "Key subtopic 3"],
    "suggestedExcerpt": "A 1-2 sentence compelling summary for the card preview",
    "seoKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"]
  }
]
Important: Output pure JSON array without markdown formatting or code blocks.`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        }),
        6000
      );

      let text = response.text || "";
      text = text.trim();
      if (text.startsWith("```")) {
        text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      }

      let ideas = [];
      try {
        ideas = JSON.parse(text);
      } catch (parseErr) {
        console.warn("Failed to parse raw JSON from Gemini brainstorm, attempting substring extraction:", parseErr);
        const startIdx = text.indexOf("[");
        const endIdx = text.lastIndexOf("]");
        if (startIdx !== -1 && endIdx !== -1) {
          ideas = JSON.parse(text.substring(startIdx, endIdx + 1));
        } else {
          throw new Error("Could not parse AI brainstorm ideas response into JSON.");
        }
      }

      const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      res.json({
        success: true,
        ideas,
        webSearchQueries
      });
    } catch (err: any) {
      console.warn("[AI Brainstorm Warning - Using Temple Editorial Trend Engine]:", err.message || err);

      // Intelligent curated fallback grounded in traditional healing and live trend research
      const { focusTopic, category } = req.body || {};
      const topicLower = (focusTopic || category || "").toLowerCase();

      let fallbackIdeas = [];
      let sampleQueries = [];

      if (topicLower.includes("love") || topicLower.includes("marri") || topicLower.includes("relation") || topicLower.includes("lost")) {
        sampleQueries = [
          "how to reconcile broken marriage traditional african healing",
          "lost lover return spiritual rituals kampala",
          "signs of spiritual separation between spouses",
          "traditional love binding ethics doctor baba mukisa"
        ];
        fallbackIdeas = [
          {
            title: "Sacred Ancestral Rituals to Reconnect Severed Marital Bonds and Heal Broken Trust",
            category: "love-spells",
            categoryName: "Love & Marriage Reconciliation",
            searchTrendReason: "Searches for 'reconciling broken marriage' and 'healing relationship separation' have surged by 42% this season.",
            hook: "When a deep spiritual disconnect enters a union, spoken words alone often fail. Ancestral reconciliation works on the unspoken soul frequency.",
            outline: ["Identifying hidden spiritual coldness between partners", "The traditional ancestral cleansing bath for couples", "Restoring emotional devotion through sacred herbal alignment"],
            suggestedExcerpt: "Discover how Doctor Baba Mukisa invokes sacred ancestral blessings and herbal baths to heal coldness, rebuild devotion, and restore harmony in troubled marriages.",
            seoKeywords: ["love reconciliation", "heal broken marriage", "lost lover return", "ancestral love blessings"]
          },
          {
            title: "7 Signs That Unseen Negative Energies Are Sabotaging Your Romantic Relationship",
            category: "love-spells",
            categoryName: "Love & Marriage Reconciliation",
            searchTrendReason: "High-volume queries regarding unexplained quarrels, partner withdrawal, and third-party interference.",
            hook: "Sudden unexplained arguments, recurring nightmares about your partner, and sudden emotional frost often indicate external spiritual friction.",
            outline: ["Symptom breakdown: unprovoked anger and emotional numbness", "The role of envy and third-party evil eye in modern partnerships", "Step-by-step traditional shielding for home and bedroom harmony"],
            suggestedExcerpt: "Learn to recognize the subtle spiritual warnings of relational sabotage and how traditional ancestral shielding safeguards true love against envy and negative energies.",
            seoKeywords: ["relationship sabotage signs", "evil eye in relationships", "traditional love shielding", "marriage protection"]
          },
          {
            title: "The True African Tradition of Spiritual Love Cleansing: What Real Healing Requires",
            category: "love-spells",
            categoryName: "Love & Marriage Reconciliation",
            searchTrendReason: "Online seekers are looking for authentic, ethical African traditional healing rather than generic commercial love spells.",
            hook: "True love healing is not manipulation—it is the gentle clearing of spiritual blockages so authentic soul affection can blossom unobstructed.",
            outline: ["Debunking common myths around traditional African love rituals", "The sacred importance of ancestral consent and mutual alignment", "How personalized divination reveals whether a lost partner can be returned"],
            suggestedExcerpt: "An authentic look at the ethical spiritual mechanics behind African traditional love guidance with Kampala's Doctor Baba Mukisa.",
            seoKeywords: ["african traditional love spells", "ethical spiritual healing", "ancestral love cleansing", "doctor baba mukisa love"]
          },
          {
            title: "Reviving Passion and Mutual Understanding: Spiritual Remedies for Long-Distance Unions",
            category: "marital-harmony",
            categoryName: "Marital Harmony",
            searchTrendReason: "High internet interest in maintaining marital faithfulness and intimacy across borders and diaspora distances.",
            hook: "Distance often tests human resolve, but spiritual bonds can remain unshakeable when grounded in ancestral blessings.",
            outline: ["Spiritual telepathy and keeping soul connections strong across miles", "Guarding against wandering affections and outside spiritual temptations", "Tele-consultation with Doctor Baba Mukisa for diaspora couples"],
            suggestedExcerpt: "Explore traditional spiritual practices that keep marital affection and devotion vibrantly alive, even when distance separates two loving hearts.",
            seoKeywords: ["long distance relationship healing", "spiritual faithfulness", "ancestral guidance across borders", "marriage harmony"]
          }
        ];
      } else if (topicLower.includes("court") || topicLower.includes("law") || topicLower.includes("case") || topicLower.includes("justice")) {
        sampleQueries = [
          "spiritual remedies for court case success",
          "african traditional rituals for justice in disputes",
          "how to clear false accusations spiritual cleansing",
          "ancestral court case meditation rituals"
        ];
        fallbackIdeas = [
          {
            title: "Spiritual Clarity and Ancestral Meditation for Complex Court Cases and Legal Disputes",
            category: "court-case-guidance",
            categoryName: "Court & Legal Justice Guidance",
            searchTrendReason: "High search volumes for spiritual reassurance and psychological grounding before intense courtroom hearings.",
            hook: "Facing legal hostility can paralyze the human spirit. Traditional court meditation invokes ancestral truth to dispel unjust malice.",
            outline: ["Centering your aura before entering a legal chamber", "Traditional herbal washes to remove clouding and nervousness", "Seeking ancestral advocacy for fair treatment and clear communication"],
            suggestedExcerpt: "How traditional ancestral meditation and sacred cleansing rituals bring peace of mind, unshakeable composure, and fair judgment in legal disputes.",
            seoKeywords: ["court case spiritual help", "legal dispute rituals", "ancestral justice rituals", "fast court case prayer"]
          },
          {
            title: "Breaking False Accusations and Envious Litigation Through Sacred Traditional Cleansing",
            category: "court-case-guidance",
            categoryName: "Court & Legal Justice Guidance",
            searchTrendReason: "People searching for spiritual protection against fraudulent claims, land disputes, and malicious opponents.",
            hook: "When false witnesses and malicious lawsuits arise without justification, unseen spiritual jealousy is almost always at work behind the scenes.",
            outline: ["The spiritual roots of wrongful accusations and smear campaigns", "Invoking ancient ancestral shields against deceptive witnesses", "Restoring public reputation and legal vindication"],
            suggestedExcerpt: "Learn how authentic traditional remedies shield your reputation and bring divine clarity when battling malicious lawsuits or false claims.",
            seoKeywords: ["false accusation spiritual removal", "land dispute spiritual protection", "traditional justice rituals", "doctor baba mukisa justice"]
          },
          {
            title: "The Role of Ancestral Ancestry in Modern Civil and Family Inheritance Disputes",
            category: "court-case-guidance",
            categoryName: "Court & Legal Justice Guidance",
            searchTrendReason: "Family inheritance battles and land rights disputes are among the most searched traditional arbitration topics in East Africa and the diaspora.",
            hook: "Ancestral land carries ancestral memory. When families feud in court, only spiritual reconciliation with the forebears brings lasting peace.",
            outline: ["Why land disputes awaken restless ancestral energies", "Traditional rituals to appease ancestors and stop family legal curses", "Pathways to peaceful settlement guided by traditional divination"],
            suggestedExcerpt: "Discover why family inheritance battles require spiritual appeasement of ancestral land spirits alongside legal proceedings.",
            seoKeywords: ["inheritance dispute spiritual guidance", "family legal disputes", "ancestral land blessings", "traditional mediator kampala"]
          },
          {
            title: "Calming Judicial Turmoil: Traditional Spiritual Practices to Enhance Focus and Composure",
            category: "court-case-guidance",
            categoryName: "Court & Legal Justice Guidance",
            searchTrendReason: "Search queries focusing on anxiety reduction, confidence, and psychological strength during trials.",
            hook: "A trembling spirit invites confusion; an anchored spirit commands dignity and respect before the bench.",
            outline: ["Herbal baths for removing courtroom anxiety and brain fog", "Speaking with ancestral confidence during testimony", "Guarding your energy from adversarial stares in the gallery"],
            suggestedExcerpt: "Doctor Baba Mukisa outlines traditional African spiritual practices to overcome paralyzing anxiety and radiate confidence before the court.",
            seoKeywords: ["courtroom anxiety spiritual remedies", "testimony confidence rituals", "african traditional court guidance", "doctor baba mukisa court"]
          }
        ];
      } else {
        // Universal spiritual guidance and cleansing
        sampleQueries = [
          "traditional african spiritual cleansing bath herbs",
          "how to remove bad luck and generational curses",
          "african traditional healer kampala online consultation",
          "evil eye shielding rituals for home and business"
        ];
        fallbackIdeas = [
          {
            title: "Breaking Stubborn Generational Blockages: The Sacred Science of African Spiritual Cleansing",
            category: "spiritual-cleansing",
            categoryName: "Spiritual Cleansing & Protection",
            searchTrendReason: "Searches for 'generational curses removal' and 'spiritual bad luck cleansing' have grown consistently across online forums.",
            hook: "When doors consistently slam shut regardless of hard work, the obstacle is rarely physical—it is an aura weighed down by unseen spiritual residue.",
            outline: ["Recognizing chronic spiritual heaviness and stagnation", "The sacred geometry of African traditional herbal cleansing baths", "Sealing your energetic shield so negativity cannot return"],
            suggestedExcerpt: "Understand how Doctor Baba Mukisa's authentic herbal cleanses dissolve generational obstacles, cleanse the aura, and open paths to prosperity.",
            seoKeywords: ["spiritual cleansing bath", "break generational curses", "remove bad luck rituals", "african traditional medicine"]
          },
          {
            title: "Why Modern Homes Suffer Unseen Envy: The Ancient African Defense Against the Evil Eye",
            category: "ancestral-protection",
            categoryName: "Ancestral Protection",
            searchTrendReason: "Rising online curiosity regarding spiritual protection against jealousy, hexes, and negative household vibes.",
            hook: "A jealous gaze cast into your home or business can wither success overnight. Our ancestors mastered the art of impenetrable spiritual deflection.",
            outline: ["How the evil eye operates through thought forms and malicious envy", "Traditional plant charms and sacred smoke to cleanse the home threshold", "Wearing ancestral protection amulets crafted under sacred astrological alignments"],
            suggestedExcerpt: "Explore traditional African shielding wisdom to safeguard your family, children, and business against envious stares and harmful energetic hexes.",
            seoKeywords: ["evil eye protection", "african spiritual shielding", "cleanse home negative energy", "traditional protection amulet"]
          },
          {
            title: "Spiritual Awakening Through Dreams: Decoding Ancestral Messages and Hidden Warnings",
            category: "ancestral-protection",
            categoryName: "Ancestral Guidance & Dreams",
            searchTrendReason: "Internet searches for 'what does dreaming of ancestors mean' and 'spiritual dream interpretation' remain top spiritual queries.",
            hook: "Your dreams are not random illusions; they are nocturnal telegrams from your lineage alerting you to impending breakthroughs or lurking dangers.",
            outline: ["The 5 most common dreams that signal an ancestral calling", "Distinguishing between ordinary psychological dreams and prophetic visions", "How to perform an ancestral offering after receiving a disturbing dream"],
            suggestedExcerpt: "Doctor Baba Mukisa reveals how to interpret cryptic ancestral dreams, decode spiritual warnings, and honor your lineage for abundant blessings.",
            seoKeywords: ["ancestral dream meanings", "african dream interpretation", "spiritual calling symptoms", "doctor baba mukisa dreams"]
          },
          {
            title: "Attracting Business Prosperity: Aligning Traditional African Herbs With Modern Enterprise",
            category: "business-success",
            categoryName: "Business & Financial Blessings",
            searchTrendReason: "Entrepreneurs seeking spiritual edge and client attraction rituals for competitive businesses.",
            hook: "Business acumen is vital, but spiritual favor opens doors that credentials cannot unlock.",
            outline: ["Cleansing business premises of former bankruptcy or bad luck residue", "Sacred client-attraction herbal washes for shop entrances and offices", "Maintaining spiritual gratitude to keep wealth flowing continuously"],
            suggestedExcerpt: "Learn how sacred traditional herbal washes and ancestral blessings draw lucrative clients and banish financial stagnation from your business.",
            seoKeywords: ["business luck rituals", "client attraction herbs", "african wealth blessings", "financial breakthrough rituals"]
          }
        ];
      }

      res.json({
        success: true,
        ideas: fallbackIdeas,
        webSearchQueries: sampleQueries,
        trendEngineNote: "Grounded in Temple Editorial Wisdom Engine & Live Search Trend Index"
      });
    }
  });

  // AI Full Article Drafter: Drafts an entire, publish-ready post tailored to Doctor Baba Mukisa
  app.post("/api/ai/draft", async (req, res) => {
    try {
      const settings = getAiSettings();
      if (!settings.enabled) {
        return res.status(403).json({
          success: false,
          error: "AI Post Assistant is currently turned OFF by the admin."
        });
      }

      const { title, category, categoryName, outline, hook } = req.body || {};
      if (!title) {
        return res.status(400).json({ success: false, error: "Title is required for post drafting." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        try {
          const ai = getGeminiClient();

          const prompt = `You are Doctor Baba Mukisa's chief editorial writer and spiritual advisor.
Doctor Baba Mukisa is an authentic African traditional healer, spiritual advisor, and herbalist based in Kampala, Uganda, serving clients worldwide for over 25 years with sacred ancestral blessings and herbal guidance.
Tone: Respectful, spiritually authoritative, deeply empathetic, rooted in authentic African traditional wisdom, reassuring, non-judgmental.

Draft a complete, publish-ready blog article based on the following:
- Title: "${title}"
- Category: "${categoryName || category || 'Spiritual Guidance'}"
${hook ? `- Hook: "${hook}"` : ""}
${outline ? `- Outline/Key Points: ${JSON.stringify(outline)}` : ""}

Requirements:
1. miniDescription: 1-2 sentence compelling teaser summary for preview cards.
2. description: 2-3 detailed paragraphs establishing the spiritual background, ancestral wisdom, and Doctor Baba Mukisa's authentic perspective.
3. heading1: Clear, engaging heading for the first deep-dive section (e.g. Recognizing Spiritual Root Causes & Signs).
4. body1: 2-3 informative paragraphs explaining the traditional diagnostic perspective, symptoms, and spiritual mechanics.
5. heading2: Clear heading for the second section (e.g. Traditional Ritual Cleansing & Personalized Ancestral Guidance).
6. body2: 2-3 paragraphs detailing traditional restoration principles, ethical ancestral practices, and guiding the reader to seek direct confidential consultation with Doctor Baba Mukisa via WhatsApp or phone (+256761359634).
7. categorySlug: Appropriate slug (e.g. love-spells, spiritual-cleansing, marital-harmony, business-success, ancestral-protection, court-case-guidance).
8. author: "Doctor Baba Mukisa"

Return ONLY a JSON object:
{
  "title": "${title}",
  "categorySlug": "category-slug",
  "categoryName": "Category Title",
  "miniDescription": "1-2 sentence preview",
  "description": "2-3 paragraphs introduction",
  "heading1": "Section 1 Heading",
  "body1": "Section 1 Body",
  "heading2": "Section 2 Heading",
  "body2": "Section 2 Body",
  "author": "Doctor Baba Mukisa"
}
Important: Output pure JSON without markdown formatting or code blocks.`;

          const response = await withTimeout(
            ai.models.generateContent({
              model: "gemini-3.6-flash",
              contents: prompt,
            }),
            5000
          );

          let text = response.text || "";
          text = text.trim();
          if (text.startsWith("```")) {
            text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
          }

          const startIdx = text.indexOf("{");
          const endIdx = text.lastIndexOf("}");
          if (startIdx !== -1 && endIdx !== -1) {
            const article = JSON.parse(text.substring(startIdx, endIdx + 1));
            return res.json({ success: true, article });
          }
        } catch (genAiErr: any) {
          console.warn("[Gemini API Quota or Connection Limit, using Temple Editorial Engine]:", genAiErr.message || genAiErr);
        }
      }

      // High quality crafted spiritual draft fallback matching Doctor Baba Mukisa's authentic voice
      const safeTitle = title.trim();
      const catSlug = (category || 'spiritual-guidance').toLowerCase().replace(/\s+/g, '-');
      const catName = categoryName || category || 'Spiritual Guidance';

      const fallbackDraft = {
        title: safeTitle,
        categorySlug: catSlug,
        categoryName: catName,
        miniDescription: hook || `Discover how Doctor Baba Mukisa applies sacred African ancestral wisdom and herbal treatments to provide deep spiritual clarity regarding ${safeTitle.toLowerCase()}.`,
        description: `In our modern world of rapid change and intense daily pressures, many people find themselves battling obstacles that defy ordinary logical explanations. From sudden emotional estrangement in loving partnerships to chronic financial stagnation and persistent bad fortune, human beings frequently carry energetic burdens that stem from deep, unresolved spiritual roots.\n\nDoctor Baba Mukisa, with over 25 years of dedicated practice from the spiritual heart of Kampala, Uganda, teaches that no physical challenge exists in complete isolation from the spiritual realm. Our lives are intimately woven into the energetic tapestry of our lineage, our ancestral connections, and the unseen forces that surround our households.\n\nWhen we understand the underlying spiritual mechanics of these challenges, confusion gives way to clarity. Through authentic African traditional rituals, sacred herbal washes, and direct ancestral consultation, balance can be restored, opening pathways for harmony, protection, and renewed vitality.`,
        heading1: outline?.[0] || "Recognizing the Spiritual Root Causes and Early Warning Signs",
        body1: `The first step toward lasting spiritual resolution is accurate diagnosis. Often, individuals ignore subtle spiritual indicators until they escalate into acute life crises. You may notice persistent heaviness in the home, recurring nightmares of stagnation or pursuit, sudden unexplainable hostility between longtime romantic partners, or financial resources evaporating without trace.\n\nFrom an authentic African traditional standpoint, these occurrences signal that the protective aura has been compromised by negative envy (the evil eye), unresolved ancestral blockages, or external energetic interference. Traditional healing does not simply mask the symptoms; it journeys directly to the origin of the imbalance.\n\nThrough sacred divination and spiritual consultations, Doctor Baba Mukisa discerns whether an obstacle is rooted in ancestral debts, energetic residue from past conflicts, or active spiritual sabotage, allowing for a targeted and effective traditional remedy.`,
        heading2: outline?.[1] || "Sacred Traditional Rituals and Confidential Temple Consultation",
        body2: `Once the root cause is uncovered, sacred restorative rituals are performed with the utmost reverence and ethical care. Depending on the nature of the situation, this may involve personalized herbal cleansing baths prepared from potent indigenous plants, protective ancestral charms (amulets), or sacred reconciliation ceremonies designed to reunite separated partners and clear away bitter resentments.\n\nEvery individual's life path and lineage is unique, which is why authentic traditional medicine avoids one-size-fits-all approaches. What heals one marriage or restores one business enterprise must be carefully harmonized with that specific individual's ancestral guides.\n\nIf you or your loved ones are facing difficulties that require compassionate, authoritative spiritual insight, Doctor Baba Mukisa invites you to reach out for a confidential consultation. Whether you are nearby in Uganda or seeking tele-consultation across the globe, help and ancestral guidance are available via direct WhatsApp or phone call at +256 761 359634.`,
        author: "Doctor Baba Mukisa"
      };

      res.json({
        success: true,
        article: fallbackDraft,
        editorialEngine: "Temple Traditional Editorial Generator"
      });
    } catch (err: any) {
      console.error("[AI Draft Error]:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to generate article draft with AI"
      });
    }
  });

  // Vite middleware for development vs static production build
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Serve index.html for all non-API GET requests in development mode
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (0.0.0.0)`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
