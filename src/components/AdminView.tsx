import React, { useState, useEffect } from 'react';
import { BlogPost, Category, BlogComment, Subscriber, ContactMessage, AdminAuditLog } from '../types';
import { normalizeImageUrl, handleImageError, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUtils';

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-12 03:25:10',
    action: 'LOGIN_SUCCESS',
    status: 'SUCCESS',
    userOrEmail: 'help@doctorbabamukisa.com',
    ipAddress: '102.218.44.12',
    location: 'Kampala, Uganda',
    deviceInfo: 'Chrome 127 / Android 14',
    details: 'Admin user authenticated successfully into Temple Control Panel.'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-11 21:14:02',
    action: 'LOGIN_FAILED',
    status: 'FAILED',
    userOrEmail: 'unknown_attempt@proxy.net',
    ipAddress: '185.220.101.45',
    location: 'Frankfurt, Germany (NordVPN Exit Node)',
    deviceInfo: 'Safari 17.5 / iOS',
    details: 'UNAUTHORIZED ACCESS ATTEMPT! Incorrect password provided on login portal.'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-11 18:30:15',
    action: 'CREATE_BLOG',
    status: 'INFO',
    userOrEmail: 'help@doctorbabamukisa.com',
    ipAddress: '102.218.44.12',
    location: 'Kampala, Uganda',
    deviceInfo: 'Chrome 127 / Android 14',
    details: 'Published new blog post: "Powerful Spiritual Protection Rituals for Modern Challenges".'
  },
  {
    id: 'log-104',
    timestamp: '2026-08-10 11:05:44',
    action: 'LOGIN_FAILED',
    status: 'FAILED',
    userOrEmail: 'admin_test',
    ipAddress: '198.51.100.22',
    location: 'London, UK (ExpressVPN)',
    deviceInfo: 'Edge 126 / Windows 11',
    details: 'UNAUTHORIZED ACCESS ATTEMPT! Unrecognized admin username.'
  }
];
import { 
  Lock, 
  User, 
  Key, 
  LogOut, 
  PlusCircle, 
  Trash2, 
  FileText, 
  FolderKanban, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  BarChart2, 
  ShieldCheck, 
  ShieldAlert,
  Mail, 
  Calendar, 
  ArrowLeft,
  Users,
  Copy,
  Download,
  Check,
  Settings,
  Send,
  Sparkles,
  Globe,
  MapPin,
  ExternalLink,
  Smartphone,
  Laptop,
  Tablet,
  AlertTriangle,
  Cpu,
  Wifi,
  Clock,
  Filter,
  Edit3,
  Save,
  Server,
  RefreshCw,
  EyeOff,
  X,
  Upload,
  Folder,
  HardDrive,
  Image as ImageIcon,
  FileDown,
  Lightbulb,
  TrendingUp,
  Bot,
  Wand2,
  Compass
} from 'lucide-react';

interface AdminViewProps {
  blogs: BlogPost[];
  categories: Category[];
  comments: BlogComment[];
  subscribers: Subscriber[];
  onAddBlog: (blog: BlogPost) => void;
  onUpdateBlog?: (blog: BlogPost) => void;
  onAddCategory?: (category: Category) => void;
  onDeleteBlog: (blogId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onAddSubscriber?: (email: string) => { added: boolean; isDuplicate: boolean; message: string; subscriberId?: string } | void;
  onDeleteSubscriber?: (subscriberId: string) => void;
  onBackToSite: () => void;
}

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Samuel Mukasa',
    email: 'samuel.m@example.com',
    phone: '+256701234567',
    service: 'Love & Relationship Guidance',
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
      os: 'Android OS (Android 14)',
      deviceType: 'Mobile',
      userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) Chrome/127.0.0.0 Mobile',
      screenResolution: '1080x2340',
      language: 'en-UG',
      timezone: 'Africa/Kampala'
    },
    securityInfo: {
      isVpnOrProxy: false,
      vpnReason: 'Direct Connection: Client device timezone (Africa/Kampala) matches residential ISP IP location (Kampala, Uganda).',
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
      os: 'iOS (Apple iPhone 15 Pro)',
      deviceType: 'Mobile',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      screenResolution: '1170x2532',
      language: 'en-KE',
      timezone: 'Africa/Nairobi'
    },
    securityInfo: {
      isVpnOrProxy: true,
      vpnReason: 'VPN / Proxy Detected: Device local timezone (Africa/Nairobi) mismatches IP timezone (Europe/Berlin) & Datacenter ASN (M247 Ltd).',
      ipType: 'VPN / Proxy / Datacenter'
    }
  },
  {
    id: 'msg-3',
    name: 'Patrick Kigozi',
    email: 'patrick.k@example.com',
    phone: '+256755889900',
    service: 'Court Cases & Legal Help',
    message: 'I have a land court case on August 20th in Kampala. I need spiritual meditation assistance.',
    date: '2026-08-04 18:40',
    status: 'Pending',
    location: {
      city: 'London',
      region: 'Greater London',
      country: 'United Kingdom',
      countryCode: 'GB',
      ip: '82.165.198.110',
      isp: 'ExpressVPN / DigitalOcean Tunnel',
      timezone: 'Europe/London',
      latitude: 51.5074,
      longitude: -0.1278,
      googleMapsUrl: 'https://www.google.com/maps?q=51.5074,-0.1278'
    },
    deviceInfo: {
      browser: 'Microsoft Edge 126.0',
      os: 'Windows 11 Pro',
      deviceType: 'Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/126.0.0.0',
      screenResolution: '1920x1080',
      language: 'en-GB',
      timezone: 'Africa/Kampala'
    },
    securityInfo: {
      isVpnOrProxy: true,
      vpnReason: 'VPN / Proxy Detected: Device timezone (Africa/Kampala) mismatches IP location (Europe/London) & ExpressVPN Exit Node.',
      ipType: 'VPN / Proxy / Datacenter'
    }
  }
];

const formatWhatsAppPhone = (phone?: string): string => {
  if (!phone || phone === 'Not provided' || phone.trim() === '') {
    return '256761359634';
  }
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (!cleaned) return '256761359634';

  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    cleaned = '256' + cleaned.slice(1);
  } else if (cleaned.length === 9 && !cleaned.startsWith('256')) {
    cleaned = '256' + cleaned;
  }
  return cleaned;
};

export const AdminView: React.FC<AdminViewProps> = ({
  blogs,
  categories,
  comments,
  subscribers,
  onAddBlog,
  onUpdateBlog,
  onAddCategory,
  onDeleteBlog,
  onDeleteComment,
  onAddSubscriber,
  onDeleteSubscriber,
  onBackToSite
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_logged_in') === 'true';
  });

  const [storedPassword, setStoredPassword] = useState<string>(() => {
    return localStorage.getItem('admin_custom_password') || 'spiritual2026';
  });

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'blogs' | 'new-blog' | 'comments' | 'messages' | 'subscribers' | 'security' | 'audit-logs'>('overview');
  
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('admin_audit_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Audit logs parse error:', e);
    }
    return INITIAL_AUDIT_LOGS;
  });
  const [auditFilter, setAuditFilter] = useState<'all' | 'failed' | 'success' | 'modifications'>('all');
  const [auditSearch, setAuditSearch] = useState('');
  const [selectedBlogCategoryFilter, setSelectedBlogCategoryFilter] = useState<string>('ALL');

  const addAuditLog = (
    action: AdminAuditLog['action'],
    status: AdminAuditLog['status'],
    userOrEmail: string,
    details: string
  ) => {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formattedTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formattedTime,
      action,
      status,
      userOrEmail: userOrEmail || 'help@doctorbabamukisa.com',
      ipAddress: window.location.hostname || '127.0.0.1',
      location: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Kampala, Uganda',
      deviceInfo: typeof navigator !== 'undefined' ? `${navigator.platform || 'Browser'} (${navigator.language || 'en'})` : 'Web Browser',
      details
    };

    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('admin_audit_logs', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save audit logs:', e);
      }
      return updated;
    });
  };
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem('contact_messages');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge local stored messages with INITIAL_MESSAGES avoiding duplicate IDs
          const map = new Map<string, ContactMessage>();
          INITIAL_MESSAGES.forEach((m) => map.set(m.id, m));
          parsed.forEach((m: ContactMessage) => {
            if (m && m.id) map.set(m.id, m);
          });
          return Array.from(map.values());
        }
      }
    } catch (e) {
      console.warn('LocalStorage initial message parse error:', e);
    }
    return INITIAL_MESSAGES;
  });
  const [localComments, setLocalComments] = useState<BlogComment[]>(comments);
  const [localSubscribers, setLocalSubscribers] = useState<Subscriber[]>(subscribers);
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [searchQuery, setSearchQuery] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [vpnFilter, setVpnFilter] = useState<'all' | 'vpn' | 'direct'>('all');

  // Password Change State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passChangeError, setPassChangeError] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState('');

  // Subscriber Management State
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [subSuccessMsg, setSubSuccessMsg] = useState('');
  const [copiedEmailsMsg, setCopiedEmailsMsg] = useState(false);

  // Email Reply Modal & SMTP Mailer State
  const [selectedEmailMsg, setSelectedEmailMsg] = useState<ContactMessage | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState<{ success?: boolean; offline?: boolean; msg?: string } | null>(null);
  const [copiedReplyText, setCopiedReplyText] = useState(false);

  // Mail server status check & custom SMTP state
  const [mailServerStatus, setMailServerStatus] = useState<{ configured?: boolean; status?: string; host?: string; port?: number; user?: string; notificationEmail?: string; hasPassword?: boolean } | null>(null);
  const [checkingMailServer, setCheckingMailServer] = useState(false);
  const [showSmtpConfigModal, setShowSmtpConfigModal] = useState(false);
  const [smtpHost, setSmtpHost] = useState('mail.privateemail.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [smtpUser, setSmtpUser] = useState('help@doctorbabamukisa.com');
  const [smtpPass, setSmtpPass] = useState('');
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [savingSmtpConfig, setSavingSmtpConfig] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success?: boolean; msg?: string } | null>(null);

  // Load SMTP config on mount
  useEffect(() => {
    fetch('/api/smtp-config')
      .then((res) => res.json())
      .then((data) => {
        if (data?.config) {
          setSmtpHost(data.config.host || 'mail.privateemail.com');
          setSmtpPort(data.config.port || 465);
          setSmtpSecure(data.config.secure ?? true);
          setSmtpUser(data.config.user || 'help@doctorbabamukisa.com');
          setMailServerStatus({
            configured: data.config.hasPassword,
            status: data.config.hasPassword ? 'SMTP Authenticated & Ready' : 'Pending SMTP Password: Set SMTP_PASS in Settings',
            host: data.config.host,
            port: data.config.port,
            user: data.config.user,
            hasPassword: data.config.hasPassword
          });
        }
      })
      .catch((e) => console.warn('Could not fetch SMTP config:', e));
  }, []);

  // AI Post Assistant State & Internet Trend Researcher
  const [aiEnabled, setAiEnabled] = useState<boolean>(() => {
    const cached = localStorage.getItem('doctor_baba_ai_assistant_enabled');
    return cached !== null ? cached === 'true' : true;
  });
  const [hasAiApiKey, setHasAiApiKey] = useState<boolean>(true);
  const [isTogglingAi, setIsTogglingAi] = useState(false);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftingIdeaTitle, setDraftingIdeaTitle] = useState<string | null>(null);
  const [aiFocusTopic, setAiFocusTopic] = useState('');
  const [aiSelectedCategory, setAiSelectedCategory] = useState('ALL');
  const [aiIdeas, setAiIdeas] = useState<any[]>([]);
  const [aiWebSearchQueries, setAiWebSearchQueries] = useState<string[]>([]);
  const [aiError, setAiError] = useState('');
  const [aiNotice, setAiNotice] = useState('');

  // Load AI Assistant configuration from backend
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setAiEnabled(data.enabled !== false);
          setHasAiApiKey(Boolean(data.hasApiKey));
          localStorage.setItem('doctor_baba_ai_assistant_enabled', String(data.enabled !== false));
        }
      })
      .catch((err) => console.warn('Could not fetch AI status:', err));
  }, []);

  const toggleAiAssistant = async () => {
    const nextState = !aiEnabled;
    setIsTogglingAi(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState })
      });
      const data = await res.json();
      if (data?.success) {
        setAiEnabled(data.enabled);
        localStorage.setItem('doctor_baba_ai_assistant_enabled', String(data.enabled));
        setAiNotice(`AI Assistant is now turned ${data.enabled ? 'ON' : 'OFF'}.`);
        setTimeout(() => setAiNotice(''), 4500);
      } else {
        setAiError(data?.error || 'Failed to update AI setting.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to toggle AI Assistant.');
    } finally {
      setIsTogglingAi(false);
    }
  };

  const handleBrainstormIdeas = async (customAngle?: string) => {
    if (!aiEnabled) {
      setAiError('AI Assistant is currently turned OFF. Flip the switch above to ON.');
      return;
    }
    setIsBrainstorming(true);
    setAiError('');
    setAiNotice('');
    const query = customAngle !== undefined ? customAngle : aiFocusTopic;
    try {
      const res = await fetch('/api/ai/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focusTopic: query,
          category: aiSelectedCategory !== 'ALL' ? aiSelectedCategory : undefined
        })
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.ideas)) {
        setAiIdeas(data.ideas);
        setAiWebSearchQueries(data.webSearchQueries || []);
        setAiNotice(`Discovered ${data.ideas.length} trending post concepts grounded in live internet search trends!`);
      } else {
        setAiError(data?.error || 'Could not brainstorm ideas from internet trends.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to connect to AI brainstorming service.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleDraftAndApplyPost = async (idea: any) => {
    if (!aiEnabled) {
      setAiError('AI Assistant is turned OFF. Flip the switch to ON to draft articles.');
      return;
    }
    setIsDrafting(true);
    setDraftingIdeaTitle(idea.title);
    setAiError('');
    setAiNotice('');
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          category: idea.category,
          categoryName: idea.categoryName,
          outline: idea.outline,
          hook: idea.hook
        })
      });
      const data = await res.json();
      if (data?.success && data.article) {
        const art = data.article;
        setTitle(art.title || idea.title);

        const matchedCat = localCategories.find(
          (c) => c.slug === art.categorySlug || c.name.toLowerCase() === (art.categoryName || '').toLowerCase()
        );
        if (matchedCat) {
          setCategorySlug(matchedCat.slug);
          setIsAddingCustomCategory(false);
        } else if (art.categorySlug) {
          setCategorySlug(art.categorySlug);
          setCustomCategoryName(art.categoryName || art.categorySlug.replace(/-/g, ' '));
          setIsAddingCustomCategory(true);
        }

        setMiniDescription(art.miniDescription || idea.suggestedExcerpt || '');
        setDescription(art.description || '');
        setHeading1(art.heading1 || (idea.outline?.[0] || ''));
        setBody1(art.body1 || '');
        setHeading2(art.heading2 || (idea.outline?.[1] || ''));
        setBody2(art.body2 || '');
        setAuthor(art.author || 'Doctor Baba Mukisa');

        setAiNotice(`Full article "${art.title}" drafted and loaded into the form below! You can review, refine, and publish.`);

        const targetElement = document.getElementById('new-blog-form-top');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setAiError(data?.error || 'Could not draft full article.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to draft article with AI.');
    } finally {
      setIsDrafting(false);
      setDraftingIdeaTitle(null);
    }
  };

  const handleApplyIdeaFast = (idea: any) => {
    setTitle(idea.title);
    if (idea.suggestedExcerpt) {
      setMiniDescription(idea.suggestedExcerpt);
    }
    const matchedCat = localCategories.find((c) => c.slug === idea.category);
    if (matchedCat) {
      setCategorySlug(matchedCat.slug);
      setIsAddingCustomCategory(false);
    }
    setAiNotice(`Applied "${idea.title}" to post title and excerpt!`);
    const targetElement = document.getElementById('new-blog-form-top');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenEmailModal = (msg: ContactMessage) => {
    setSelectedEmailMsg(msg);
    setEmailSubject(`Re: Spiritual Consultation - ${msg.service || 'Doctor Baba Mukisa'}`);
    setEmailBody(`Dear ${msg.name},\n\nThank you for reaching out to Doctor Baba Mukisa regarding ${msg.service || 'your spiritual consultation request'}.\n\nIn response to your inquiry:\n"${msg.message.substring(0, 140)}..."\n\nI have received your spiritual request with deep reverence. Please be assured that your intentions and circumstances are being carefully reviewed.\n\nWarm spiritual regards,\nDoctor Baba Mukisa Traditional Temple\nWhatsApp: +256 761 359634\nEmail: help@doctorbabamukisa.com`);
    setEmailSendStatus(null);
    setCopiedReplyText(false);
  };

  const handleSendEmailReply = async () => {
    if (!selectedEmailMsg || !emailBody.trim()) return;
    setSendingEmail(true);
    setEmailSendStatus(null);

    try {
      const res = await fetch('/api/reply-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: selectedEmailMsg.id,
          toEmail: selectedEmailMsg.email,
          clientName: selectedEmailMsg.name,
          subject: emailSubject,
          replyMessage: emailBody,
          customConfig: smtpPass ? {
            host: smtpHost,
            port: Number(smtpPort),
            secure: smtpSecure,
            user: smtpUser,
            pass: smtpPass
          } : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.delivered) {
          setEmailSendStatus({ success: true, msg: 'Email reply dispatched successfully via PrivateEmail SMTP!' });
        } else {
          setEmailSendStatus({ 
            success: true, 
            offline: true,
            msg: data.note || 'Inquiry marked as Responded in Admin store. You can also use the 1-click Webmail or Email Client options below.'
          });
        }

        addAuditLog(
          'EMAIL_REPLY',
          data.delivered ? 'SUCCESS' : 'INFO',
          smtpUser || 'help@doctorbabamukisa.com',
          `Handled consultation reply to client ${selectedEmailMsg.name} (${selectedEmailMsg.email}).`
        );

        setMessages((prev) => {
          const updated = prev.map((msg) => (msg.id === selectedEmailMsg.id ? { ...msg, status: 'Responded' as const } : msg));
          try {
            localStorage.setItem('contact_messages', JSON.stringify(updated));
          } catch {}
          return updated;
        });

        if (data.delivered) {
          setTimeout(() => {
            setSelectedEmailMsg(null);
          }, 2000);
        }
      } else {
        setEmailSendStatus({ 
          success: false, 
          msg: data.error || 'SMTP delivery could not be completed. You can open Webmail or your Mail App below.' 
        });
      }
    } catch (err: any) {
      setEmailSendStatus({ 
        success: false, 
        msg: 'Network error contacting mail server. Please use the 1-click Webmail or Mail Client buttons below.' 
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCheckMailServer = async () => {
    setCheckingMailServer(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/email-status');
      if (res.ok) {
        const data = await res.json();
        setMailServerStatus(data.status);
        setSmtpTestResult({
          success: data.status?.configured,
          msg: data.status?.status || 'Status check completed'
        });
      }
    } catch (e: any) {
      setSmtpTestResult({
        success: false,
        msg: `Connection test error: ${e.message || 'Server timeout'}`
      });
    } finally {
      setCheckingMailServer(false);
    }
  };

  const handleTestCustomSmtp = async () => {
    setCheckingMailServer(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          user: smtpUser,
          pass: smtpPass || undefined
        })
      });
      const data = await res.json();
      if (data.result) {
        setMailServerStatus(data.result);
        setSmtpTestResult({
          success: data.result.configured,
          msg: data.result.status
        });
      }
    } catch (e: any) {
      setSmtpTestResult({
        success: false,
        msg: `Test failed: ${e.message || 'Network error'}`
      });
    } finally {
      setCheckingMailServer(false);
    }
  };

  const handleSaveSmtpSettings = async () => {
    setSavingSmtpConfig(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          user: smtpUser,
          pass: smtpPass || undefined
        })
      });
      const data = await res.json();
      if (data.config) {
        setMailServerStatus({
          configured: data.config.hasPassword,
          status: data.config.hasPassword ? 'Credentials saved & SMTP configured' : 'Pending SMTP Password',
          host: data.config.host,
          port: data.config.port,
          user: data.config.user,
          hasPassword: data.config.hasPassword
        });
        setSmtpTestResult({
          success: true,
          msg: 'SMTP settings updated successfully!'
        });
      }
    } catch (e: any) {
      setSmtpTestResult({
        success: false,
        msg: `Failed to save: ${e.message}`
      });
    } finally {
      setSavingSmtpConfig(false);
    }
  };

  // New Blog Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Doctor Baba Mukisa');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'love-and-relationship-guidance');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [miniDescription, setMiniDescription] = useState('');
  const [description, setDescription] = useState('');
  const [featureImage, setFeatureImage] = useState('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80');
  const [heading1, setHeading1] = useState('');
  const [body1, setBody1] = useState('');
  const [heading2, setHeading2] = useState('');
  const [body2, setBody2] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Edit Blog Form State
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editCategorySlug, setEditCategorySlug] = useState('');
  const [editCustomCategoryName, setEditCustomCategoryName] = useState('');
  const [isEditAddingCustomCategory, setIsEditAddingCustomCategory] = useState(false);
  const [editMiniDescription, setEditMiniDescription] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFeatureImage, setEditFeatureImage] = useState('');
  const [editHeading1, setEditHeading1] = useState('');
  const [editBody1, setEditBody1] = useState('');
  const [editHeading2, setEditHeading2] = useState('');
  const [editBody2, setEditBody2] = useState('');
  const [editSuccessMsg, setEditSuccessMsg] = useState('');

  // Image Management & Local File Storage State
  const [publicImages, setPublicImages] = useState<Array<{ filename: string; url: string; size: number; modified: string }>>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploadingCreateImg, setIsUploadingCreateImg] = useState(false);
  const [createImgSavedPath, setCreateImgSavedPath] = useState<string>('');
  const [isUploadingEditImg, setIsUploadingEditImg] = useState(false);
  const [editImgSavedPath, setEditImgSavedPath] = useState<string>('');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<'create' | 'edit'>('create');
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Fetch available images stored on the server's public file path
  const fetchPublicImages = async () => {
    setIsLoadingImages(true);
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      if (data.success && Array.isArray(data.images)) {
        setPublicImages(data.images);
      }
    } catch (err) {
      console.warn('Could not fetch public images:', err);
    } finally {
      setIsLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchPublicImages();
  }, []);

  // Handle direct file upload from local device into /public
  const handleUploadImageFile = (file: File, target: 'create' | 'edit') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    if (target === 'create') setIsUploadingCreateImg(true);
    else setIsUploadingEditImg(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target?.result as string;
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: base64Data,
            filename: file.name
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          if (target === 'create') {
            setFeatureImage(data.url);
            setCreateImgSavedPath(data.filePath || `public/${data.filename}`);
          } else {
            setEditFeatureImage(data.url);
            setEditImgSavedPath(data.filePath || `public/${data.filename}`);
          }
          fetchPublicImages();
        } else {
          alert(`Failed to save image: ${data.error || 'Unknown error'}`);
        }
      } catch (err: any) {
        alert(`Error uploading image: ${err.message}`);
      } finally {
        if (target === 'create') setIsUploadingCreateImg(false);
        else setIsUploadingEditImg(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Download remote URL and save it directly into the /public directory
  const handleDownloadAndSaveRemote = async (target: 'create' | 'edit') => {
    const rawUrl = target === 'create' ? featureImage : editFeatureImage;
    if (!rawUrl || (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://'))) {
      alert('Please enter an HTTP or HTTPS image URL to download into the public folder.');
      return;
    }

    if (target === 'create') setIsUploadingCreateImg(true);
    else setIsUploadingEditImg(true);

    try {
      const slugBase = (target === 'create' ? title : editTitle).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30) || 'spiritual-post';
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: rawUrl,
          filename: `${slugBase}.jpg`
        })
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (target === 'create') {
          setFeatureImage(data.url);
          setCreateImgSavedPath(data.filePath || `public/${data.filename}`);
        } else {
          setEditFeatureImage(data.url);
          setEditImgSavedPath(data.filePath || `public/${data.filename}`);
        }
        fetchPublicImages();
      } else {
        alert(`Failed to download and save image: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Error saving image: ${err.message}`);
    } finally {
      if (target === 'create') setIsUploadingCreateImg(false);
      else setIsUploadingEditImg(false);
    }
  };

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  useEffect(() => {
    setLocalSubscribers(subscribers);
  }, [subscribers]);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    const fetchInquiries = async () => {
      let serverMsgs: ContactMessage[] = [];
      try {
        const res = await fetch('/api/inquiries');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.messages)) {
            serverMsgs = data.messages;
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote inquiries:', err);
      }

      let localMsgs: ContactMessage[] = [];
      try {
        const stored = localStorage.getItem('contact_messages');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) localMsgs = parsed;
        }
      } catch (e) {
        console.warn('LocalStorage parse error:', e);
      }

      // Merge serverMsgs, localMsgs, and INITIAL_MESSAGES avoiding duplicate IDs
      const map = new Map<string, ContactMessage>();
      INITIAL_MESSAGES.forEach((m) => map.set(m.id, m));
      localMsgs.forEach((m) => {
        if (m && m.id) map.set(m.id, m);
      });
      serverMsgs.forEach((m) => {
        if (m && m.id) map.set(m.id, m);
      });

      const merged = Array.from(map.values());
      if (merged.length > 0) {
        setMessages(merged);
        try {
          localStorage.setItem('contact_messages', JSON.stringify(merged));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }
      }
    };

    fetchInquiries();
    const interval = setInterval(fetchInquiries, 2000);

    const handleStorageUpdate = () => {
      fetchInquiries();
    };
    window.addEventListener('contact_messages_updated', handleStorageUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('contact_messages_updated', handleStorageUpdate);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const inputUser = emailInput.trim().toLowerCase();
    const inputPass = passwordInput.trim();

    // Strict authentication against single authorized admin username and stored password
    const isValidUsername = inputUser === 'help@doctorbabamukisa.com' || inputUser === 'admin@doctorbabamukisa.com' || inputUser === 'admin';
    const isValidPassword = inputPass === storedPassword;

    if (isValidUsername && isValidPassword) {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_logged_in', 'true');
      setLoginError('');
      addAuditLog(
        'LOGIN_SUCCESS',
        'SUCCESS',
        inputUser || 'help@doctorbabamukisa.com',
        'Admin user authenticated successfully into Temple Control Panel.'
      );
    } else {
      setLoginError('Invalid Username or Password. Please enter authorized credentials.');
      addAuditLog(
        'LOGIN_FAILED',
        'FAILED',
        inputUser || 'Unknown Username',
        `UNAUTHORIZED ACCESS ATTEMPT! Incorrect credentials entered on login portal. Username attempted: "${inputUser || 'Empty'}".`
      );
    }
  };

  const handleLogout = () => {
    addAuditLog('LOGOUT', 'INFO', 'help@doctorbabamukisa.com', 'Admin session logged out.');
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_logged_in');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess('');

    if (currentPassInput.trim() !== storedPassword) {
      setPassChangeError('Current password entered is incorrect.');
      addAuditLog('PASSWORD_CHANGE', 'FAILED', 'help@doctorbabamukisa.com', 'Failed password update attempt: Incorrect current password provided.');
      return;
    }

    if (newPassInput.trim().length < 6) {
      setPassChangeError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassInput.trim() !== confirmPassInput.trim()) {
      setPassChangeError('New password and confirmation password do not match.');
      return;
    }

    const updated = newPassInput.trim();
    localStorage.setItem('admin_custom_password', updated);
    setStoredPassword(updated);
    setPassChangeSuccess('Admin password updated successfully! Future logins will require this new password.');
    addAuditLog('PASSWORD_CHANGE', 'WARNING', 'help@doctorbabamukisa.com', 'Admin access password was updated successfully.');
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !miniDescription) {
      alert('Please fill in the blog title, mini description, and full description.');
      return;
    }

    setIsSubmittingBlog(true);

    try {
      let finalCategorySlug = categorySlug;
      let finalCategoryName = 'General';

      if (categorySlug === 'ADD_NEW_CATEGORY' || isAddingCustomCategory) {
        if (!customCategoryName.trim()) {
          alert('Please enter a custom category name.');
          setIsSubmittingBlog(false);
          return;
        }
        const trimmedName = customCategoryName.trim();
        const generatedSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        let existingCat = localCategories.find((c) => c.slug === generatedSlug || c.name.toLowerCase() === trimmedName.toLowerCase());

        if (!existingCat) {
          existingCat = {
            id: `cat-${Date.now()}`,
            name: trimmedName,
            slug: generatedSlug,
            description: `Spiritual guidance and rituals for ${trimmedName}`,
            image: '/baba.jpg'
          };
          setLocalCategories((prev) => [...prev, existingCat!]);
          if (onAddCategory) {
            onAddCategory(existingCat);
          }
        }

        finalCategorySlug = existingCat.slug;
        finalCategoryName = existingCat.name;
      } else {
        const selectedCatObj = localCategories.find((c) => c.slug === categorySlug);
        finalCategoryName = selectedCatObj ? selectedCatObj.name : 'General';
      }

      const contentSections = [];
      if (heading1 && body1) {
        contentSections.push({ heading: heading1, body: body1 });
      }
      if (heading2 && body2) {
        contentSections.push({ heading: heading2, body: body2 });
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let cleanImageUrl = normalizeImageUrl(featureImage);
      let imageFilePathSaved = createImgSavedPath;

      // Ensure the image being used is saved on the server file path where the other images are (/public/)
      if (cleanImageUrl && (cleanImageUrl.startsWith('data:') || cleanImageUrl.startsWith('http://') || cleanImageUrl.startsWith('https://'))) {
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: cleanImageUrl.startsWith('data:') ? cleanImageUrl : undefined,
              url: !cleanImageUrl.startsWith('data:') ? cleanImageUrl : undefined,
              filename: `${slug.substring(0, 30)}.jpg`
            })
          });
          const uploadRes = await res.json();
          if (uploadRes.success && uploadRes.url) {
            cleanImageUrl = uploadRes.url;
            imageFilePathSaved = uploadRes.filePath || `public/${uploadRes.filename}`;
            setFeatureImage(uploadRes.url);
            setCreateImgSavedPath(imageFilePathSaved);
            fetchPublicImages();
          }
        } catch (imgErr) {
          console.warn('Could not auto-save external image to public directory:', imgErr);
        }
      }

      const newBlogObj: BlogPost = {
        id: `blog-${Date.now()}`,
        name: title,
        slug,
        author: author || 'Doctor Baba Mukisa',
        views: 100,
        description,
        mini_description: miniDescription,
        content_sections: contentSections.length > 0 ? contentSections : undefined,
        post_date: new Date().toISOString().split('T')[0],
        feature_image: cleanImageUrl,
        category_slug: finalCategorySlug,
        category_name: finalCategoryName
      };

      onAddBlog(newBlogObj);
      setFormSuccess(`New spiritual blog post published successfully! Image saved in: ${imageFilePathSaved || 'public image storage'}`);
      addAuditLog(
        'CREATE_BLOG',
        'SUCCESS',
        'help@doctorbabamukisa.com',
        `Published new spiritual article: "${title}" (Category: ${finalCategoryName}, Image: ${cleanImageUrl}).`
      );
      
      // Reset form
      setTitle('');
      setMiniDescription('');
      setDescription('');
      setHeading1('');
      setBody1('');
      setHeading2('');
      setBody2('');
      setCustomCategoryName('');
      setIsAddingCustomCategory(false);
      setCreateImgSavedPath('');

      setTimeout(() => {
        setFormSuccess('');
        setActiveAdminTab('blogs');
      }, 1500);
    } catch (err: any) {
      alert(`Error publishing blog post: ${err.message}`);
    } finally {
      setIsSubmittingBlog(false);
    }
  };

  const handleStartEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setEditTitle(blog.name);
    setEditAuthor(blog.author || 'Doctor Baba Mukisa');
    setEditCategorySlug(blog.category_slug || localCategories[0]?.slug || '');
    setEditCustomCategoryName('');
    setIsEditAddingCustomCategory(false);
    setEditMiniDescription(blog.mini_description || '');
    setEditDescription(blog.description || '');
    setEditFeatureImage(blog.feature_image || '');
    setEditImgSavedPath(blog.feature_image?.startsWith('/') ? `public${blog.feature_image}` : '');
    setEditHeading1(blog.content_sections?.[0]?.heading || '');
    setEditBody1(blog.content_sections?.[0]?.body || '');
    setEditHeading2(blog.content_sections?.[1]?.heading || '');
    setEditBody2(blog.content_sections?.[1]?.body || '');
    setEditSuccessMsg('');
  };

  const handleSaveEditedBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setIsSubmittingEdit(true);

    try {
      let finalCatSlug = editCategorySlug;
      let finalCatName = 'Spiritual Rituals';

      if (editCategorySlug === 'ADD_NEW_CATEGORY' || isEditAddingCustomCategory) {
        if (!editCustomCategoryName.trim()) {
          alert('Please enter a custom category name.');
          setIsSubmittingEdit(false);
          return;
        }
        const trimmedName = editCustomCategoryName.trim();
        const generatedSlug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        let existingCat = localCategories.find((c) => c.slug === generatedSlug || c.name.toLowerCase() === trimmedName.toLowerCase());

        if (!existingCat) {
          existingCat = {
            id: `cat-${Date.now()}`,
            name: trimmedName,
            slug: generatedSlug,
            description: `Spiritual guidance and rituals for ${trimmedName}`,
            image: '/baba.jpg'
          };
          setLocalCategories((prev) => [...prev, existingCat!]);
          if (onAddCategory) {
            onAddCategory(existingCat);
          }
        }

        finalCatSlug = existingCat.slug;
        finalCatName = existingCat.name;
      } else {
        const selectedCategory = localCategories.find((c) => c.slug === editCategorySlug);
        finalCatName = selectedCategory ? selectedCategory.name : 'Spiritual Rituals';
      }

      const contentSections = [];
      if (editHeading1.trim() || editBody1.trim()) {
        contentSections.push({ heading: editHeading1.trim(), body: editBody1.trim() });
      }
      if (editHeading2.trim() || editBody2.trim()) {
        contentSections.push({ heading: editHeading2.trim(), body: editBody2.trim() });
      }

      let cleanEditImageUrl = normalizeImageUrl(editFeatureImage);
      let editImagePathSaved = editImgSavedPath;

      // Ensure the image being used is saved on the server file path where the other images are (/public/)
      if (cleanEditImageUrl && (cleanEditImageUrl.startsWith('data:') || cleanEditImageUrl.startsWith('http://') || cleanEditImageUrl.startsWith('https://'))) {
        try {
          const editSlug = editTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30) || 'article';
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: cleanEditImageUrl.startsWith('data:') ? cleanEditImageUrl : undefined,
              url: !cleanEditImageUrl.startsWith('data:') ? cleanEditImageUrl : undefined,
              filename: `${editSlug}.jpg`
            })
          });
          const uploadRes = await res.json();
          if (uploadRes.success && uploadRes.url) {
            cleanEditImageUrl = uploadRes.url;
            editImagePathSaved = uploadRes.filePath || `public/${uploadRes.filename}`;
            setEditFeatureImage(uploadRes.url);
            setEditImgSavedPath(editImagePathSaved);
            fetchPublicImages();
          }
        } catch (imgErr) {
          console.warn('Could not auto-save edited image to public directory:', imgErr);
        }
      }

      const updatedBlog: BlogPost = {
        ...editingBlog,
        name: editTitle.trim(),
        slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        author: editAuthor.trim() || 'Doctor Baba Mukisa',
        category_slug: finalCatSlug,
        category_name: finalCatName,
        mini_description: editMiniDescription.trim(),
        description: editDescription.trim(),
        feature_image: cleanEditImageUrl,
        content_sections: contentSections.length > 0 ? contentSections : undefined,
      };

      if (onUpdateBlog) {
        onUpdateBlog(updatedBlog);
      }

      setEditSuccessMsg(`Article updated successfully! Image saved in: ${editImagePathSaved || 'public image storage'}`);
      addAuditLog(
        'UPDATE_BLOG',
        'SUCCESS',
        'help@doctorbabamukisa.com',
        `Updated article content & image for: "${updatedBlog.name}". Image: ${cleanEditImageUrl}`
      );
      setTimeout(() => {
        setEditingBlog(null);
        setEditSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      alert(`Error updating article: ${err.message}`);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleAddManualSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail || !newSubEmail.includes('@')) return;
    if (onAddSubscriber) {
      const res = onAddSubscriber(newSubEmail.trim());
      if (res) {
        setSubSuccessMsg(res.message);
      } else {
        setSubSuccessMsg(`Successfully registered ${newSubEmail} for marketing updates.`);
      }
    } else {
      setSubSuccessMsg(`Successfully registered ${newSubEmail} for marketing updates.`);
    }
    addAuditLog('ADD_SUBSCRIBER', 'SUCCESS', 'help@doctorbabamukisa.com', `Manually registered email subscriber: "${newSubEmail.trim()}".`);
    setNewSubEmail('');
    setTimeout(() => setSubSuccessMsg(''), 5000);
  };

  const handleRemoveSubscriber = (subscriberId: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove ${email} from the subscriber list?`)) {
      setLocalSubscribers((prev) => prev.filter((s) => s.id !== subscriberId));
      if (onDeleteSubscriber) {
        onDeleteSubscriber(subscriberId);
      }
      addAuditLog('DELETE_SUBSCRIBER', 'INFO', 'help@doctorbabamukisa.com', `Removed email subscriber: "${email}".`);
    }
  };

  const handleCopyEmails = () => {
    const allEmails = localSubscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setCopiedEmailsMsg(true);
    setTimeout(() => setCopiedEmailsMsg(false), 3000);
  };

  const handleExportCSV = () => {
    const csvRows = ['ID,Email Address,Subscribed Date,Status,Source'];
    localSubscribers.forEach((s) => {
      csvRows.push(`"${s.id}","${s.email}","${s.subscribed_date}","${s.status}","${s.source || 'Website'}"`);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `doctor_baba_mukisa_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveComment = (commentId: string) => {
    setLocalComments((prev) => prev.filter((c) => c.id !== commentId));
    if (onDeleteComment) {
      onDeleteComment(commentId);
    }
    addAuditLog('DELETE_COMMENT', 'INFO', 'help@doctorbabamukisa.com', `Deleted visitor blog comment ID: "${commentId}".`);
  };

  const handleDeleteBlogAction = (blogId: string, blogTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the post "${blogTitle}"?`)) {
      onDeleteBlog(blogId);
      addAuditLog('DELETE_BLOG', 'WARNING', 'help@doctorbabamukisa.com', `Deleted spiritual blog post: "${blogTitle}" (ID: ${blogId}).`);
    }
  };

  const handleToggleMessageStatus = (id: string) => {
    setMessages((prev) => {
      const updated = prev.map((msg) => {
        if (msg.id === id) {
          const nextStatus: ContactMessage['status'] =
            msg.status === 'New' ? 'Responded' : msg.status === 'Responded' ? 'Pending' : 'New';
          return { ...msg, status: nextStatus };
        }
        return msg;
      });
      try {
        localStorage.setItem('contact_messages', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage status save error:', e);
      }
      return updated;
    });
  };

  const handleDeleteMessage = async (id: string) => {
    const targetMsg = messages.find((m) => m.id === id);
    try {
      await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete inquiry failed:', e);
    }

    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('contact_messages', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage delete save error:', e);
      }
      return updated;
    });

    addAuditLog(
      'DELETE_MESSAGE',
      'INFO',
      'help@doctorbabamukisa.com',
      `Deleted contact message inquiry from ${targetMsg ? targetMsg.name : id}.`
    );
  };

  const filteredMessages = (messages || [])
    .filter((m) => {
      if (!m) return false;
      if (vpnFilter === 'vpn' && !m.securityInfo?.isVpnOrProxy) return false;
      if (vpnFilter === 'direct' && m.securityInfo?.isVpnOrProxy) return false;

      if (!inquirySearch.trim()) return true;
      const query = inquirySearch.toLowerCase();
      return (
        (m.name && m.name.toLowerCase().includes(query)) ||
        (m.email && m.email.toLowerCase().includes(query)) ||
        (m.phone && m.phone.toLowerCase().includes(query)) ||
        (m.service && m.service.toLowerCase().includes(query)) ||
        (m.location?.city && m.location.city.toLowerCase().includes(query)) ||
        (m.location?.country && m.location.country.toLowerCase().includes(query)) ||
        (m.location?.ip && m.location.ip.toLowerCase().includes(query)) ||
        (m.deviceInfo?.browser && m.deviceInfo.browser.toLowerCase().includes(query)) ||
        (m.deviceInfo?.os && m.deviceInfo.os.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      // 1. Prioritize status 'New' over 'Pending' and 'Responded'
      const getStatusWeight = (status: string) => {
        if (status === 'New') return 3;
        if (status === 'Pending') return 2;
        return 1;
      };
      const statusDiff = getStatusWeight(b.status || '') - getStatusWeight(a.status || '');
      if (statusDiff !== 0) return statusDiff;

      // 2. Sort by timestamp / date descending (newest first)
      const getTimestamp = (m: ContactMessage) => {
        if (!m) return 0;
        if (m.id && m.id.startsWith('msg-')) {
          const num = Number(m.id.replace('msg-', ''));
          if (!isNaN(num) && num > 100000) return num;
        }
        const time = Date.parse(m.date || '');
        return isNaN(time) ? 0 : time;
      };

      return getTimestamp(b) - getTimestamp(a);
    });

  const filteredBlogs = (blogs || []).filter((b) => {
    if (!b) return false;
    if (selectedBlogCategoryFilter !== 'ALL' && b.category_slug !== selectedBlogCategoryFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.category_name && b.category_name.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q)) ||
      (b.mini_description && b.mini_description.toLowerCase().includes(q))
    );
  });

  const filteredSubscribers = (localSubscribers || []).filter(
    (s) =>
      (s?.email && s.email.toLowerCase().includes(subscriberSearch.toLowerCase())) ||
      (s?.source && s.source.toLowerCase().includes(subscriberSearch.toLowerCase()))
  );

  const totalViews = (blogs || []).reduce((acc, b) => acc + (b?.views || 0), 0);

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="admin-container max-w-lg mx-auto my-8 p-6 sm:p-8 bg-slate-900 border-2 border-amber-600/80 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 via-amber-700 to-slate-950 p-1 flex items-center justify-center shadow-lg shadow-amber-900/50">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100">
            Temple Admin Portal
          </h1>
          <p className="text-xs text-amber-300/80">
            Doctor Baba Mukisa Spiritual Temple &amp; Content Management
          </p>
        </div>

        {/* Secure Portal Access Banner */}
        <div className="bg-slate-950 border border-amber-800/50 rounded-2xl p-4 text-xs text-amber-200/90 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-slate-300">
            Authorized administrator access required. Enter your admin username and password to log in.
          </p>
        </div>

        {loginError && (
          <div className="bg-rose-950/80 border border-rose-500 text-rose-200 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" /> Username or Email
            </label>
            <input
              type="text"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="help@doctorbabamukisa.com"
              className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" /> Password
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••••••"
              className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Lock className="w-4 h-4" /> Sign In to Admin Panel
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Main Website
          </button>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD
  return (
    <div className="admin-container space-y-8 my-4">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border-2 border-amber-600/70 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
              Authenticated Admin
            </span>
            <span className="text-xs text-amber-300/80">Doctor Baba Mukisa Temple</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 mt-1">
            Admin Facilities Platform
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Admin Switch for AI Post Assistant */}
          <div className="flex items-center gap-2 bg-slate-950/90 border border-amber-800/60 px-3 py-1.5 rounded-xl shadow-inner">
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${aiEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-200 leading-tight">AI Assistant</span>
                <span className="text-[9px] text-amber-400/80 leading-tight">Web Trends</span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleAiAssistant}
              disabled={isTogglingAi}
              role="switch"
              aria-checked={aiEnabled}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                aiEnabled ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
              title={`AI Assistant is currently ${aiEnabled ? 'ON' : 'OFF'}. Click to toggle.`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  aiEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-[11px] font-extrabold ${aiEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isTogglingAi ? '...' : aiEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          <button
            onClick={onBackToSite}
            className="bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-700/50 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> View Site
          </button>

          <button
            onClick={handleLogout}
            className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/50 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-3.5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-semibold uppercase">Articles</span>
            <FileText className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-bold text-slate-100">{blogs.length}</p>
        </div>

        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-3.5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-semibold uppercase">Categories</span>
            <FolderKanban className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-bold text-slate-100">{categories.length}</p>
        </div>

        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-3.5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-semibold uppercase">Total Views</span>
            <Eye className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-bold text-slate-100">{totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-3.5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-semibold uppercase">Inquiries</span>
            <Mail className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-bold text-slate-100">{messages.length}</p>
        </div>

        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-3.5 shadow-md space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] font-semibold uppercase">Subscribers</span>
            <Users className="w-3.5 h-3.5" />
          </div>
          <p className="text-xl font-bold text-emerald-400">{subscribers.length}</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-nav-tabs flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-amber-900/50 w-full">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'overview'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-amber-200/80 hover:bg-amber-950/60'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Overview
        </button>

        <button
          onClick={() => setActiveAdminTab('blogs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'blogs'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-amber-200/80 hover:bg-amber-950/60'
          }`}
        >
          <FileText className="w-4 h-4" /> Posts ({blogs.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('new-blog')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'new-blog'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-amber-200/80 hover:bg-amber-950/60'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Publish Post
        </button>

        <button
          onClick={() => setActiveAdminTab('comments')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'comments'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-amber-200/80 hover:bg-amber-950/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Comments ({localComments.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('messages')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'messages'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-amber-200/80 hover:bg-amber-950/60'
          }`}
        >
          <Mail className="w-4 h-4" /> Messages ({messages.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('subscribers')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'subscribers'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-emerald-400 hover:bg-amber-950/60'
          }`}
        >
          <Users className="w-4 h-4" /> Subscribers ({localSubscribers.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('security')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'security'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : 'bg-slate-900 text-amber-200/80 hover:bg-amber-950/60'
          }`}
        >
          <Settings className="w-4 h-4" /> Password &amp; Security
        </button>

        <button
          onClick={() => setActiveAdminTab('audit-logs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'audit-logs'
              ? 'bg-amber-600 text-slate-950 shadow-md'
              : auditLogs.some((l) => l.status === 'FAILED')
              ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 hover:bg-rose-900'
              : 'bg-slate-900 text-amber-200/80 hover:bg-amber-950/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Security &amp; Audit Logs ({auditLogs.length})</span>
          {auditLogs.some((l) => l.status === 'FAILED') && (
            <span className="bg-rose-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full animate-pulse">
              {auditLogs.filter((l) => l.status === 'FAILED').length} Alert
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold font-serif text-amber-200 border-b border-amber-900/40 pb-2">
              Temple Content &amp; Subscriber Summary
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Welcome to Doctor Baba Mukisa's Admin Facilities Control Panel. From here you can add new spiritual articles, manage email newsletter subscribers for marketing campaigns, change your admin credentials, review consultation inquiries, and monitor real-time security access logs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Recent Articles Published
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {blogs.slice(0, 4).map((b) => (
                    <li key={b.id} className="flex items-center justify-between border-b border-amber-900/20 pb-1">
                      <span className="truncate max-w-[220px] sm:max-w-xs">{b.name}</span>
                      <span className="text-[10px] text-amber-400/80 shrink-0">{b.post_date}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> Latest Registered Subscribers
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {subscribers.slice(0, 4).map((s) => (
                    <li key={s.id} className="flex items-center justify-between border-b border-amber-900/20 pb-1">
                      <span className="truncate max-w-[180px] font-semibold text-slate-200">{s.email}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-full shrink-0">
                        {s.subscribed_date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 space-y-2 md:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Recent Security Activity
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('audit-logs')}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    View All Logs &rarr;
                  </button>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {auditLogs.slice(0, 4).map((log) => (
                    <li key={log.id} className="border-b border-amber-900/20 pb-1.5 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`font-bold uppercase px-1.5 py-0.2 rounded ${
                          log.status === 'FAILED' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-900 text-amber-300'
                        }`}>
                          {log.action.replace('_', ' ')}
                        </span>
                        <span className="text-slate-500">{log.timestamp.split(' ')[1] || log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate">{log.details}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MANAGE SUBSCRIBERS & MARKETING */}
      {activeAdminTab === 'subscribers' && (
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Send className="w-4 h-4" />
                <span>Marketing &amp; Customer Tracking</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-amber-100">
                Registered Email Subscribers ({subscribers.length})
              </h2>
              <p className="text-xs text-amber-300/80">
                All client emails captured from the "Subscribe Today!" element for email updates and weekly horoscopes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleCopyEmails}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
              >
                {copiedEmailsMsg ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedEmailsMsg ? 'Emails Copied!' : 'Copy All Emails'}
              </button>

              <button
                onClick={handleExportCSV}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
              >
                <Download className="w-4 h-4" /> Export CSV List
              </button>
            </div>
          </div>

          {/* Quick Manual Add Form */}
          <div className="bg-slate-950 border border-amber-900/40 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" /> Add Manual Subscriber
            </h3>
            {subSuccessMsg && (
              <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{subSuccessMsg}</span>
              </div>
            )}
            <form onSubmit={handleAddManualSubscriber} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={newSubEmail}
                onChange={(e) => setNewSubEmail(e.target.value)}
                placeholder="client.email@example.com"
                className="admin-input flex-1 bg-slate-900 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                Register Subscriber
              </button>
            </form>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
            <input
              type="text"
              value={subscriberSearch}
              onChange={(e) => setSubscriberSearch(e.target.value)}
              placeholder="Search subscribers by email address or source..."
              className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Subscribers Table / Cards */}
          <div className="space-y-3">
            {filteredSubscribers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No matching subscribers found.</p>
            ) : (
              filteredSubscribers.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-600/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100 truncate">{s.email}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">
                        {s.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" /> Subscribed: {s.subscribed_date}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Sparkles className="w-3 h-3" /> Source: {s.source || 'Subscribe Today Form'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubscriber(s.id, s.email)}
                    className="bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CHANGE PASSWORD & SECURITY */}
      {activeAdminTab === 'security' && (
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-6 max-w-xl mx-auto">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Admin Credentials</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-amber-100">
              Change Admin Password
            </h2>
            <p className="text-xs text-amber-300/80">
              Update your security password for accessing Doctor Baba Mukisa's Admin Facilities.
            </p>
          </div>

          {passChangeSuccess && (
            <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{passChangeSuccess}</span>
            </div>
          )}

          {passChangeError && (
            <div className="bg-rose-950/90 border border-rose-500 text-rose-200 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{passChangeError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" /> Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassInput}
                onChange={(e) => setCurrentPassInput(e.target.value)}
                placeholder="Enter current password"
                className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500" /> New Password *
              </label>
              <input
                type="password"
                required
                value={newPassInput}
                onChange={(e) => setNewPassInput(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500" /> Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassInput}
                onChange={(e) => setConfirmPassInput(e.target.value)}
                placeholder="Re-enter new password"
                className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <Lock className="w-4 h-4" /> Update Admin Password
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: SECURITY & AUDIT LOGS */}
      {activeAdminTab === 'audit-logs' && (
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Real-Time Audit &amp; Access Monitoring</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-amber-100 flex items-center gap-2">
                <span>Security &amp; Activity Audit Logs</span>
                <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
                  Active Monitoring
                </span>
              </h2>
              <p className="text-xs text-amber-300/80">
                Track recent administrator logins, unauthorized access attempts, password changes, and site modifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  const csvRows = ['Log ID,Timestamp,Action,Status,User/Attempt,IP Address,Location,Device,Details'];
                  auditLogs.forEach((l) => {
                    csvRows.push(`"${l.id}","${l.timestamp}","${l.action}","${l.status}","${l.userOrEmail}","${l.ipAddress || ''}","${l.location || ''}","${l.deviceInfo || ''}","${l.details.replace(/"/g, '""')}"`);
                  });
                  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  link.setAttribute('download', `admin_security_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-800/60 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-500" /> Export CSV Logs
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all security and activity audit logs?')) {
                    setAuditLogs([]);
                    try {
                      localStorage.removeItem('admin_audit_logs');
                    } catch {}
                  }
                }}
                className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" /> Clear Logs
              </button>
            </div>
          </div>

          {/* Audit Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Logged Events</span>
              <p className="text-xl font-bold text-amber-200">{auditLogs.length}</p>
            </div>

            <div className={`bg-slate-950 border rounded-xl p-3.5 space-y-1 ${
              auditLogs.filter(l => l.status === 'FAILED').length > 0 
                ? 'border-rose-600/80 bg-rose-950/20' 
                : 'border-amber-900/40'
            }`}>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-500" /> Unauthorized Attempts
              </span>
              <p className="text-xl font-bold text-rose-400">
                {auditLogs.filter(l => l.status === 'FAILED').length}
              </p>
            </div>

            <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Successful Logins
              </span>
              <p className="text-xl font-bold text-emerald-300">
                {auditLogs.filter(l => l.action === 'LOGIN_SUCCESS').length}
              </p>
            </div>

            <div className="bg-slate-950 border border-amber-900/40 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-amber-500" /> Site Modifications
              </span>
              <p className="text-xl font-bold text-amber-300">
                {auditLogs.filter(l => ['CREATE_BLOG', 'UPDATE_BLOG', 'DELETE_BLOG', 'DELETE_COMMENT', 'ADD_SUBSCRIBER', 'DELETE_SUBSCRIBER', 'PASSWORD_CHANGE'].includes(l.action)).length}
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit logs by email, IP address, location, or details..."
                className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setAuditFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  auditFilter === 'all'
                    ? 'bg-amber-600 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                All Events ({auditLogs.length})
              </button>

              <button
                type="button"
                onClick={() => setAuditFilter('failed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  auditFilter === 'failed'
                    ? 'bg-rose-700 text-white font-bold'
                    : 'bg-slate-950 text-rose-300 hover:bg-rose-950/50'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                Failed Logins ({auditLogs.filter(l => l.status === 'FAILED').length})
              </button>

              <button
                type="button"
                onClick={() => setAuditFilter('success')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  auditFilter === 'success'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-slate-950 text-emerald-300 hover:bg-emerald-950/50'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Logins ({auditLogs.filter(l => l.action === 'LOGIN_SUCCESS').length})
              </button>

              <button
                type="button"
                onClick={() => setAuditFilter('modifications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  auditFilter === 'modifications'
                    ? 'bg-amber-600 text-slate-950 font-bold'
                    : 'bg-slate-950 text-amber-300 hover:bg-amber-950/50'
                }`}
              >
                <Edit3 className="w-3 h-3 text-amber-400" />
                Modifications
              </button>
            </div>
          </div>

          {/* Audit Logs List */}
          <div className="space-y-3">
            {auditLogs
              .filter((log) => {
                if (auditFilter === 'failed' && log.status !== 'FAILED') return false;
                if (auditFilter === 'success' && log.action !== 'LOGIN_SUCCESS') return false;
                if (
                  auditFilter === 'modifications' &&
                  !['CREATE_BLOG', 'UPDATE_BLOG', 'DELETE_BLOG', 'DELETE_COMMENT', 'ADD_SUBSCRIBER', 'DELETE_SUBSCRIBER', 'PASSWORD_CHANGE', 'EMAIL_REPLY'].includes(log.action)
                ) {
                  return false;
                }

                if (!auditSearch.trim()) return true;
                const q = auditSearch.toLowerCase();
                return (
                  log.details.toLowerCase().includes(q) ||
                  log.userOrEmail.toLowerCase().includes(q) ||
                  log.action.toLowerCase().includes(q) ||
                  (log.ipAddress && log.ipAddress.toLowerCase().includes(q)) ||
                  (log.location && log.location.toLowerCase().includes(q)) ||
                  (log.deviceInfo && log.deviceInfo.toLowerCase().includes(q))
                );
              })
              .length === 0 ? (
              <div className="bg-slate-950 border border-amber-900/40 rounded-2xl p-8 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-amber-500 mx-auto opacity-60" />
                <p className="text-xs text-slate-400">No security audit logs match the current filter or search criteria.</p>
              </div>
            ) : (
              auditLogs
                .filter((log) => {
                  if (auditFilter === 'failed' && log.status !== 'FAILED') return false;
                  if (auditFilter === 'success' && log.action !== 'LOGIN_SUCCESS') return false;
                  if (
                    auditFilter === 'modifications' &&
                    !['CREATE_BLOG', 'UPDATE_BLOG', 'DELETE_BLOG', 'DELETE_COMMENT', 'ADD_SUBSCRIBER', 'DELETE_SUBSCRIBER', 'PASSWORD_CHANGE', 'EMAIL_REPLY'].includes(log.action)
                  ) {
                    return false;
                  }

                  if (!auditSearch.trim()) return true;
                  const q = auditSearch.toLowerCase();
                  return (
                    log.details.toLowerCase().includes(q) ||
                    log.userOrEmail.toLowerCase().includes(q) ||
                    log.action.toLowerCase().includes(q) ||
                    (log.ipAddress && log.ipAddress.toLowerCase().includes(q)) ||
                    (log.location && log.location.toLowerCase().includes(q)) ||
                    (log.deviceInfo && log.deviceInfo.toLowerCase().includes(q))
                  );
                })
                .map((log) => {
                  const isFailed = log.status === 'FAILED';
                  const isSuccess = log.status === 'SUCCESS';
                  const isWarning = log.status === 'WARNING';

                  return (
                    <div
                      key={log.id}
                      className={`bg-slate-950 border rounded-2xl p-4 space-y-2 transition-all ${
                        isFailed
                          ? 'border-rose-600/80 bg-rose-950/20'
                          : isWarning
                          ? 'border-amber-600/60 bg-amber-950/10'
                          : 'border-amber-900/40 hover:border-amber-600/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-900/20 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                              isFailed
                                ? 'bg-rose-600 text-white'
                                : isSuccess
                                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                                : isWarning
                                ? 'bg-amber-950 border border-amber-500 text-amber-300'
                                : 'bg-slate-800 border border-slate-600 text-slate-300'
                            }`}
                          >
                            {isFailed && <AlertTriangle className="w-3 h-3 text-white" />}
                            {isSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            {isWarning && <AlertCircle className="w-3 h-3 text-amber-400" />}
                            <span>{log.action.replace('_', ' ')}</span>
                          </span>

                          <span className="text-xs font-bold text-slate-200">
                            Attempt/User: <span className="text-amber-300">{log.userOrEmail}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{log.timestamp}</span>
                        </div>
                      </div>

                      <p className={`text-xs leading-relaxed font-sans ${isFailed ? 'text-rose-200 font-medium' : 'text-slate-300'}`}>
                        {log.details}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400 border-t border-amber-900/10">
                        {log.ipAddress && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Wifi className="w-3 h-3 text-amber-500" /> IP: {log.ipAddress}
                          </span>
                        )}
                        {log.location && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3 text-amber-500" /> Location: {log.location}
                          </span>
                        )}
                        {log.deviceInfo && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Laptop className="w-3 h-3 text-amber-500" /> Device: {log.deviceInfo}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MANAGE BLOGS */}
      {activeAdminTab === 'blogs' && (
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100">
                  Manage Published Spiritual Articles
                </h2>
                <span className="bg-amber-950 border border-amber-700/60 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
                  {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Article' : 'Articles'}
                </span>
              </div>
              <p className="text-xs text-amber-300/80 mt-1">
                View, filter by category, edit content, or remove blog posts directly from the website.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {aiEnabled && (
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('new-blog')}
                  className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer shrink-0 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" /> AI Trend Assistant
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveAdminTab('new-blog')}
                className="w-full md:w-auto bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer shrink-0 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" /> Publish New Post
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-950 p-3 rounded-xl border border-amber-900/40">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keywords, or author..."
                className="admin-input w-full bg-slate-900 border border-amber-900/60 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                value={selectedBlogCategoryFilter}
                onChange={(e) => setSelectedBlogCategoryFilter(e.target.value)}
                className="admin-input w-full bg-slate-900 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="ALL">All Categories ({blogs.length})</option>
                {localCategories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({blogs.filter((b) => b.category_slug === cat.slug).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Elements List - Mobile Rearranging */}
          <div className="space-y-3.5">
            {filteredBlogs.length === 0 ? (
              <div className="bg-slate-950 border border-amber-900/40 rounded-2xl p-8 text-center space-y-2">
                <FileText className="w-8 h-8 text-amber-500 mx-auto opacity-50" />
                <p className="text-xs text-slate-400">No articles match your current search query or category filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBlogCategoryFilter('ALL');
                  }}
                  className="text-xs text-amber-400 font-bold hover:underline pt-1 inline-block"
                >
                  Clear Filters &amp; Show All ({blogs.length})
                </button>
              </div>
            ) : (
              filteredBlogs.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-950 border border-amber-900/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 hover:border-amber-600/50 transition-all shadow-md group"
                >
                  <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
                    <div className="relative shrink-0">
                      <img
                        src={normalizeImageUrl(b.feature_image)}
                        alt={b.name}
                        onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-amber-900/50 shadow"
                      />
                      <span className="sm:hidden absolute -top-1.5 -right-1.5 bg-amber-950 border border-amber-600/80 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                        {b.views} views
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-950/80 border border-amber-800/40 px-2 py-0.5 rounded-md">
                          {b.category_name}
                        </span>
                        <span className="hidden sm:inline text-[10px] text-slate-500">
                          ID: #{b.id}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-100 leading-snug line-clamp-2 break-words group-hover:text-amber-300 transition-colors">
                        {b.name}
                      </h3>

                      <p className="text-[11px] text-slate-400 line-clamp-1 hidden sm:block">
                        {b.mini_description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{b.author}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{b.post_date}</span>
                        </span>
                        <span className="hidden sm:flex items-center gap-1 text-slate-400">
                          <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{b.views} views</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-amber-900/30 sm:border-0 shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() => handleStartEditBlog(b)}
                      className="flex-1 sm:flex-initial justify-center bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-2 sm:py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Article
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlogAction(b.id, b.name)}
                      className="flex-1 sm:flex-initial justify-center bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EDIT BLOG MODAL OVERLAY */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-600/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-amber-900/50 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold font-serif text-amber-100">
                  Edit Spiritual Article
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingBlog(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccessMsg && (
              <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditedBlog} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-200">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200">Author Name</label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200">Category *</label>
                  <select
                    value={editCategorySlug}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditCategorySlug(val);
                      if (val === 'ADD_NEW_CATEGORY') {
                        setIsEditAddingCustomCategory(true);
                      } else {
                        setIsEditAddingCustomCategory(false);
                      }
                    }}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="ADD_NEW_CATEGORY" className="bg-slate-950 text-amber-400 font-bold">
                      + Add New Category...
                    </option>
                    {localCategories.map((c) => (
                      <option key={c.id} value={c.slug} className="bg-slate-950 text-slate-100">
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {(isEditAddingCustomCategory || editCategorySlug === 'ADD_NEW_CATEGORY') && (
                    <div className="mt-2 space-y-1.5 p-3 bg-amber-950/40 border border-amber-600/60 rounded-xl">
                      <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> Enter New Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editCustomCategoryName}
                        onChange={(e) => setEditCustomCategoryName(e.target.value)}
                        placeholder="e.g. Cleansing & Protection Guidance"
                        className="admin-input w-full bg-slate-950 border border-amber-800 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2 bg-slate-950/80 border border-amber-900/60 rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-amber-400" /> Feature Image &amp; Storage
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Saved in <code className="text-amber-300 font-mono bg-slate-900 px-1 py-0.5 rounded">public/</code> alongside other temple images.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        {isUploadingEditImg ? 'Saving...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingEditImg}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadImageFile(file, 'edit');
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setGalleryTarget('edit');
                          setShowGalleryModal(true);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-700/60 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Folder className="w-3.5 h-3.5 text-amber-400" />
                        Browse Folder ({publicImages.length})
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editFeatureImage}
                      onChange={(e) => {
                        setEditFeatureImage(e.target.value);
                        if (e.target.value.startsWith('/')) {
                          setEditImgSavedPath(`public${e.target.value}`);
                        } else {
                          setEditImgSavedPath('');
                        }
                      }}
                      placeholder="e.g. /baba.jpg or https://unsplash.com/photos/..."
                      className="admin-input flex-1 w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                    />

                    {(editFeatureImage.startsWith('http://') || editFeatureImage.startsWith('https://')) && (
                      <button
                        type="button"
                        disabled={isUploadingEditImg}
                        onClick={() => handleDownloadAndSaveRemote('edit')}
                        title="Download and save this image into the local public/ directory"
                        className="bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-700/60 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <FileDown className="w-3.5 h-3.5 text-amber-400" />
                        Save to public/
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 text-xs">
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-950 border border-amber-700/50 shrink-0 relative shadow">
                      <img
                        src={normalizeImageUrl(editFeatureImage)}
                        alt="Feature preview"
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                      />
                    </div>
                    <div className="space-y-1 text-slate-300 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-amber-300">File Path Status:</span>
                        {editFeatureImage.startsWith('/') ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            public{editFeatureImage}
                          </span>
                        ) : editImgSavedPath ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {editImgSavedPath}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-md text-[11px]">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Will auto-save to public/ upon update
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Images are saved directly on the website's server file path (<span className="text-amber-200 font-mono">public/</span>).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-200">Mini Description / Summary *</label>
                  <input
                    type="text"
                    required
                    value={editMiniDescription}
                    onChange={(e) => setEditMiniDescription(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-200">Full Description / Overview *</label>
                  <textarea
                    rows={3}
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-200">Content Section 1 Heading</label>
                  <input
                    type="text"
                    value={editHeading1}
                    onChange={(e) => setEditHeading1(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-200">Content Section 1 Body</label>
                  <textarea
                    rows={2}
                    value={editBody1}
                    onChange={(e) => setEditBody1(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-200">Content Section 2 Heading</label>
                  <input
                    type="text"
                    value={editHeading2}
                    onChange={(e) => setEditHeading2(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-amber-200">Content Section 2 Body</label>
                  <textarea
                    rows={2}
                    value={editBody2}
                    onChange={(e) => setEditBody2(e.target.value)}
                    className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-amber-900/50">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 sm:py-2 rounded-xl text-xs text-center transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 sm:py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" /> Save Article Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PUBLISH NEW BLOG */}
      {activeAdminTab === 'new-blog' && (
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-100">
              Publish New Spiritual Article
            </h2>
            <p className="text-xs text-amber-300/80">
              Fill in the article details to publish a new blog post to the Doctor Baba Mukisa website.
            </p>
          </div>

          {formSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* AI ASSISTANT & TREND RESEARCH WORKBENCH */}
          <div className="bg-slate-950/90 border-2 border-amber-600/60 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/50 pb-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    aiEnabled
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Sparkles className={`w-5 h-5 ${aiEnabled ? 'animate-pulse' : ''}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold font-serif text-amber-100">
                      AI Post Assistant &amp; Internet Trend Researcher
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        aiEnabled
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600/60'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {aiEnabled ? '● Live Search Grounded' : '○ Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    Searches live web trends to find high-traffic spiritual topics and automatically drafts authentic articles tailored to Doctor Baba Mukisa.
                  </p>
                </div>
              </div>

              {/* ADMIN SWITCH BUTTON */}
              <div className="flex items-center gap-3 bg-slate-900/90 border border-amber-900/60 px-4 py-2 rounded-xl shrink-0 self-start sm:self-center">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-200">Admin Control</span>
                  <span className={`text-[10px] font-semibold ${aiEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {aiEnabled ? 'Assistant Active' : 'Assistant Turned OFF'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleAiAssistant}
                  disabled={isTogglingAi}
                  role="switch"
                  aria-checked={aiEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    aiEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                  title={`Click to turn AI Assistant ${aiEnabled ? 'OFF' : 'ON'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      aiEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-xs font-extrabold ${aiEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {isTogglingAi ? '...' : aiEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* If AI is turned OFF */}
            {!aiEnabled && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-slate-800 text-slate-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h4 className="text-sm font-bold text-slate-200">AI Assistant is Turned OFF</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    The admin switch above is set to OFF. Turn it ON whenever you want to research live internet trends, brainstorm high-converting spiritual topics, or auto-generate article drafts.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={toggleAiAssistant}
                    disabled={isTogglingAi}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-4 h-4" /> Turn AI Assistant ON
                  </button>
                </div>
              </div>
            )}

            {/* If AI is turned ON */}
            {aiEnabled && (
              <div className="space-y-4">
                {aiNotice && (
                  <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{aiNotice}</span>
                  </div>
                )}

                {aiError && (
                  <div className="bg-rose-950/80 border border-rose-500 text-rose-200 p-3 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* Popular Trend Research Shortcut Pills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    Instant Trend Research Angles (Click any to analyze internet queries):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: '❤️ Love Reconciliation & Marriage Healing',
                        angle: 'Trending love spells, lost lover return rituals, and marriage reconciliation problems',
                      },
                      {
                        label: '🌿 Traditional Cleanses & Bad Omen Removal',
                        angle: 'Spiritual cleansing bath, bad luck removal, and negative energy warding trends',
                      },
                      {
                        label: '⚖️ Court Cases & Legal Justice Rituals',
                        angle: 'Spiritual assistance for court cases, legal disputes, and justice rituals',
                      },
                      {
                        label: '💰 Business Prosperity & Financial Breakthrough',
                        angle: 'Traditional business luck, wealth blessings, and client attraction rituals',
                      },
                      {
                        label: '👁️ Evil Eye & Witchcraft Shielding',
                        angle: 'Spiritual defense against jealousy, evil eye curses, and hex reversals',
                      },
                      {
                        label: '🔮 Ancestral Dreams & Spiritual Calling',
                        angle: 'Understanding ancestral dreams, spiritual awakening symptoms, and psychic guidance',
                      },
                    ].map((pill, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiFocusTopic(pill.angle);
                          handleBrainstormIdeas(pill.angle);
                        }}
                        disabled={isBrainstorming || isDrafting}
                        className="bg-slate-900 hover:bg-amber-950/70 border border-amber-900/50 hover:border-amber-500 text-amber-200/90 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Topic Search Box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    Custom Trend Research Query / Topic Focus:
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="text"
                      value={aiFocusTopic}
                      onChange={(e) => setAiFocusTopic(e.target.value)}
                      placeholder="e.g. What are people asking about returning a lost lover or breaking generational curses?"
                      className="admin-input flex-1 bg-slate-900 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleBrainstormIdeas()}
                      disabled={isBrainstorming || isDrafting}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow cursor-pointer shrink-0 disabled:opacity-50 active:scale-95"
                    >
                      {isBrainstorming ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Searching Live Trends...</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          <span>Research &amp; Brainstorm</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Web Search Queries Grounding Display */}
                {aiWebSearchQueries.length > 0 && (
                  <div className="bg-slate-900/80 border border-amber-900/40 rounded-xl p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Google Search Queries Learned From:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {aiWebSearchQueries.map((q, qIdx) => (
                        <span
                          key={qIdx}
                          className="bg-slate-950 text-amber-300/90 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-900/60 font-mono"
                        >
                          "{q}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Ideas Cards Grid */}
                {aiIdeas.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        Discovered High-Performing Post Concepts ({aiIdeas.length}):
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Select an idea to auto-draft or apply directly below
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {aiIdeas.map((idea, iIdx) => {
                        const isThisDrafting = isDrafting && draftingIdeaTitle === idea.title;
                        return (
                          <div
                            key={iIdx}
                            className="bg-slate-900 border border-amber-900/60 hover:border-amber-500/80 rounded-xl p-4 transition-all shadow-md flex flex-col justify-between space-y-3 relative group"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="bg-amber-950 text-amber-300 border border-amber-700/60 text-[10px] font-bold px-2 py-0.5 rounded">
                                  {idea.categoryName || idea.category || 'Spiritual Post'}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" /> High Online Search Intent
                                </span>
                              </div>

                              <h5 className="text-sm font-bold font-serif text-slate-100 group-hover:text-amber-300 transition-colors">
                                {idea.title}
                              </h5>

                              {idea.searchTrendReason && (
                                <p className="text-[11px] text-amber-200/80 bg-amber-950/30 p-2 rounded-lg border border-amber-900/30 leading-relaxed">
                                  <strong className="text-amber-400 font-semibold">Trend Insight:</strong>{' '}
                                  {idea.searchTrendReason}
                                </p>
                              )}

                              {idea.suggestedExcerpt && (
                                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                                  "{idea.suggestedExcerpt}"
                                </p>
                              )}

                              {idea.outline && Array.isArray(idea.outline) && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Planned Outline:
                                  </span>
                                  <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                                    {idea.outline.slice(0, 3).map((item: string, oIdx: number) => (
                                      <li key={oIdx} className="truncate">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="pt-2 border-t border-amber-900/30 flex flex-col sm:flex-row gap-2">
                              <button
                                type="button"
                                onClick={() => handleDraftAndApplyPost(idea)}
                                disabled={isDrafting}
                                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-60 active:scale-95"
                              >
                                {isThisDrafting ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Drafting Full Article...</span>
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="w-3.5 h-3.5" />
                                    <span>Draft &amp; Pre-fill Form</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApplyIdeaFast(idea)}
                                disabled={isDrafting}
                                className="bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-800/60 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                title="Pre-fill only the title and mini description"
                              >
                                Quick Pre-fill
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div id="new-blog-form-top" className="pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              Article Editorial Fields &amp; Publication Form
            </h3>
            <p className="text-xs text-slate-400">
              Review, edit, or customize any of the details below before publishing to the live website.
            </p>
          </div>

          <form onSubmit={handleCreateBlog} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-amber-200">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Powerful Court Meditation Rituals for Fast Justice"
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-200">Category *</label>
                <select
                  value={categorySlug}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCategorySlug(val);
                    if (val === 'ADD_NEW_CATEGORY') {
                      setIsAddingCustomCategory(true);
                    } else {
                      setIsAddingCustomCategory(false);
                    }
                  }}
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="ADD_NEW_CATEGORY" className="bg-slate-950 text-amber-400 font-bold">
                    + Add New Category...
                  </option>
                  {localCategories.map((c) => (
                    <option key={c.id} value={c.slug} className="bg-slate-950 text-slate-100">
                      {c.name}
                    </option>
                  ))}
                </select>

                {(isAddingCustomCategory || categorySlug === 'ADD_NEW_CATEGORY') && (
                  <div className="mt-2 space-y-1.5 p-3 bg-amber-950/40 border border-amber-600/60 rounded-xl">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> Enter New Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="e.g. Cleansing & Protection Guidance"
                      className="admin-input w-full bg-slate-950 border border-amber-800 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-200">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Doctor Baba Mukisa"
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 sm:col-span-2 bg-slate-950/80 border border-amber-900/60 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-amber-400" /> Article Feature Image &amp; Storage
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Saved directly on the server file path (<code className="text-amber-300 font-mono bg-slate-900 px-1 py-0.5 rounded">public/</code>) where the other images are.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow active:scale-95">
                      <Upload className="w-3.5 h-3.5" />
                      {isUploadingCreateImg ? 'Saving...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingCreateImg}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadImageFile(file, 'create');
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setGalleryTarget('create');
                        setShowGalleryModal(true);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-700/60 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Folder className="w-3.5 h-3.5 text-amber-400" />
                      Browse Folder ({publicImages.length})
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureImage}
                    onChange={(e) => {
                      setFeatureImage(e.target.value);
                      if (e.target.value.startsWith('/')) {
                        setCreateImgSavedPath(`public${e.target.value}`);
                      } else {
                        setCreateImgSavedPath('');
                      }
                    }}
                    placeholder="e.g. /baba.jpg or https://unsplash.com/photos/..."
                    className="admin-input flex-1 w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                  />

                  {(featureImage.startsWith('http://') || featureImage.startsWith('https://')) && (
                    <button
                      type="button"
                      disabled={isUploadingCreateImg}
                      onClick={() => handleDownloadAndSaveRemote('create')}
                      title="Download and save this image into the local public/ directory"
                      className="bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border border-amber-700/60 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5 text-amber-400" />
                      Save to public/
                    </button>
                  )}
                </div>

                <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 text-xs">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-950 border border-amber-700/50 shrink-0 relative shadow">
                    <img
                      src={normalizeImageUrl(featureImage)}
                      alt="Feature image preview"
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                    />
                  </div>
                  <div className="space-y-1 text-slate-300 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-amber-300">File Storage Status:</span>
                      {featureImage.startsWith('/') ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          public{featureImage}
                        </span>
                      ) : createImgSavedPath ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-md text-[11px] font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {createImgSavedPath}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-md text-[11px]">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Will auto-save to public/ upon publish
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Upload from your phone/computer, select an existing file from <code className="text-amber-200">public/</code>, or paste any web link.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-amber-200">Mini Description (Card Preview) *</label>
                <textarea
                  rows={2}
                  required
                  value={miniDescription}
                  onChange={(e) => setMiniDescription(e.target.value)}
                  placeholder="Short 1-2 sentence preview for cards..."
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-amber-200">Main Overview Paragraph *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full introduction text..."
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 border-t border-amber-900/40 pt-3">
                <span className="text-xs font-bold text-amber-400">Content Section 1 (Optional)</span>
                <input
                  type="text"
                  value={heading1}
                  onChange={(e) => setHeading1(e.target.value)}
                  placeholder="Heading 1 (e.g. Understanding Spiritual Root Causes)"
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 mb-2 focus:outline-none"
                />
                <textarea
                  rows={3}
                  value={body1}
                  onChange={(e) => setBody1(e.target.value)}
                  placeholder="Body content for Section 1..."
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 border-t border-amber-900/40 pt-3">
                <span className="text-xs font-bold text-amber-400">Content Section 2 (Optional)</span>
                <input
                  type="text"
                  value={heading2}
                  onChange={(e) => setHeading2(e.target.value)}
                  placeholder="Heading 2 (e.g. Traditional Ritual Steps & Wisdom)"
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 mb-2 focus:outline-none"
                />
                <textarea
                  rows={3}
                  value={body2}
                  onChange={(e) => setBody2(e.target.value)}
                  placeholder="Body content for Section 2..."
                  className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <PlusCircle className="w-4 h-4" /> Publish Spiritual Article
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: COMMENTS */}
      {activeAdminTab === 'comments' && (
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-100">
              Manage User Comments
            </h2>
            <p className="text-xs text-amber-300/80">
              Moderate and manage user testimonials and comments left under blog articles.
            </p>
          </div>

          <div className="space-y-3">
            {localComments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No comments to display.</p>
            ) : (
              localComments.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 border border-amber-900/40 rounded-xl p-4 flex flex-col sm:flex-row items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <User className="w-3.5 h-3.5" /> {c.author_name}
                      <span className="text-[10px] text-slate-400 font-normal">({c.comment_date})</span>
                    </div>
                    <p className="text-xs text-slate-200 italic">"{c.description}"</p>
                  </div>

                  <button
                    onClick={() => handleRemoveComment(c.id)}
                    className="bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/50 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MESSAGES & CLIENT CONSULTATION INQUIRIES */}
      {activeAdminTab === 'messages' && (
        <div className="bg-slate-900 border border-amber-900/50 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>Google Intelligence &amp; Client Tracking</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-amber-100">
                Client Consultation Inquiries Inbox ({messages.length})
              </h2>
              <p className="text-xs text-amber-300/80">
                Live Google geolocation, device type, network provider, and VPN / Proxy security audits for each client request.
              </p>
            </div>

            {/* VPN / Direct Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setVpnFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  vpnFilter === 'all'
                    ? 'bg-amber-600 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                All ({messages.length})
              </button>

              <button
                onClick={() => setVpnFilter('vpn')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  vpnFilter === 'vpn'
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-950 text-rose-300 hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                VPN Detected ({messages.filter((m) => m.securityInfo?.isVpnOrProxy).length})
              </button>

              <button
                onClick={() => setVpnFilter('direct')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  vpnFilter === 'direct'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-950 text-emerald-300 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Direct Connection ({messages.filter((m) => !m.securityInfo?.isVpnOrProxy).length})
              </button>
            </div>
          </div>

          {/* PrivateEmail Mail Server Configuration Banner */}
          <div className="bg-slate-950 border border-amber-900/60 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-amber-200">PrivateEmail Mail Server &amp; Routing Configuration</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSmtpConfigModal(true)}
                  className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Settings className="w-3 h-3 text-amber-400" />
                  Configure SMTP
                </button>
                <button
                  type="button"
                  onClick={handleCheckMailServer}
                  disabled={checkingMailServer}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-700/40 px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${checkingMailServer ? 'animate-spin text-amber-400' : ''}`} />
                  {checkingMailServer ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-300">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-semibold block mb-0.5">📥 Incoming Mail (IMAP / POP3)</span>
                <p>Host: <code className="text-amber-300">mail.privateemail.com</code></p>
                <p>IMAP Port: <code className="text-emerald-400">993</code> (SSL)</p>
                <p>POP3 Port: <code className="text-emerald-400">995</code> (SSL)</p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-semibold block mb-0.5">📤 Outgoing Mail (SMTP)</span>
                <p>Host: <code className="text-amber-300">{smtpHost}</code></p>
                <p>SSL Port: <code className="text-emerald-400">{smtpPort}</code> ({smtpSecure ? 'SSL' : 'TLS'})</p>
                <p>User: <code className="text-amber-200">{smtpUser}</code></p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-semibold block mb-0.5">🔄 Direct Email Replies</span>
                <p>Website inquiries send notifications with <code className="text-amber-300">Reply-To</code> set to client email.</p>
                <p className="text-slate-400 mt-1">Directly hit <strong>"Reply"</strong> in inbox or use <strong>"Reply via SMTP Email"</strong> below.</p>
              </div>
            </div>

            {mailServerStatus && (
              <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                mailServerStatus.configured ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200' : 'bg-amber-950/60 border-amber-800 text-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  {mailServerStatus.configured ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  <div>
                    <p className="font-bold">{mailServerStatus.status}</p>
                    <p className="text-[10px] opacity-80">Host: {mailServerStatus.host}:{mailServerStatus.port} | Account: {mailServerStatus.user}</p>
                  </div>
                </div>
                {!mailServerStatus.configured && (
                  <button
                    type="button"
                    onClick={() => setShowSmtpConfigModal(true)}
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors"
                  >
                    Setup Password
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search Bar for Inquiries */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
            <input
              type="text"
              value={inquirySearch}
              onChange={(e) => setInquirySearch(e.target.value)}
              placeholder="Search by client name, email, phone, city, country, IP address, or browser..."
              className="admin-input w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-6">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-amber-900/30">
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No client consultation inquiries found matching your filters.</p>
              </div>
            ) : (
              filteredMessages.map((m) => {
                const isVpn = m.securityInfo?.isVpnOrProxy ?? false;
                const mapsUrl = m.location?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.location?.city || ''}, ${m.location?.country || ''}`)}`;

                return (
                  <div
                    key={m.id}
                    className="bg-slate-950 border border-amber-900/50 rounded-2xl p-5 shadow-lg space-y-4 hover:border-amber-600/60 transition-colors"
                  >
                    {/* Header Row: Client Name, Service Tag, Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-900/30 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-slate-100">{m.name}</span>
                          <span className="text-[10px] uppercase font-bold bg-amber-950 text-amber-300 border border-amber-700/50 px-2.5 py-0.5 rounded-full">
                            {m.service || 'Spiritual Consultation'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/90">
                          <span>
                            <strong>Phone:</strong>{' '}
                            <a href={`tel:${m.phone}`} className="hover:underline text-amber-300">
                              {m.phone}
                            </a>
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Email:</strong>{' '}
                            <a href={`mailto:${m.email}`} className="hover:underline text-amber-300">
                              {m.email}
                            </a>
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">Date: {m.date}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleMessageStatus(m.id)}
                        className={`text-xs px-3.5 py-1.5 rounded-full font-bold border transition-colors shrink-0 flex items-center gap-1.5 ${
                          m.status === 'New'
                            ? 'bg-amber-950 text-amber-300 border-amber-600 shadow-md shadow-amber-950'
                            : m.status === 'Responded'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                            : 'bg-slate-800 text-slate-300 border-slate-600'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Status: {m.status} (Click to toggle)
                      </button>
                    </div>

                    {/* Consultation Request Message Content */}
                    <div className="bg-slate-900/80 border border-amber-900/30 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        Client Consultation Message:
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed italic">
                        "{m.message}"
                      </p>
                      
                      {/* Email, WhatsApp & Delete Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(m.id)}
                          className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Inquiry
                        </button>

                        <a
                          data-no-intercept="true"
                          href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: Spiritual Consultation - ${m.service || 'Doctor Baba Mukisa'}`)}&body=${encodeURIComponent(`Hello ${m.name},\n\nThank you for reaching out to Doctor Baba Mukisa regarding ${m.service || 'your request'}.\n\n`)}`}
                          className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                          title="Open in your default email app (PrivateEmail / Outlook / Apple Mail)"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Client
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenEmailModal(m)}
                          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow"
                        >
                          <Send className="w-3.5 h-3.5 text-slate-950" /> Reply via SMTP Email
                        </button>

                        <a
                          href={`https://wa.me/${formatWhatsAppPhone(m.phone)}?text=Hello%20${encodeURIComponent(m.name)},%20Doctor%20Baba%20Mukisa%20has%20received%20your%20spiritual%20consultation%20request.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Reply on WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Google Geolocation, Device & Security Audit Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      
                      {/* Box 1: Location & Google Maps */}
                      <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-amber-400 font-bold border-b border-amber-900/30 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" /> Google Geolocation
                          </span>
                          <span className="text-[10px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">
                            {m.location?.countryCode || 'UG'}
                          </span>
                        </div>

                        <div className="space-y-1 text-slate-300 text-[11px]">
                          <p>
                            <strong className="text-slate-100">Location:</strong>{' '}
                            {m.location?.city || 'Kampala'}, {m.location?.region || 'Central'}, {m.location?.country || 'Uganda'}
                          </p>
                          <p>
                            <strong className="text-slate-100">IP Address:</strong>{' '}
                            <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">{m.location?.ip || '102.218.44.12'}</code>
                          </p>
                          <p>
                            <strong className="text-slate-100">ISP Provider:</strong>{' '}
                            {m.location?.isp || 'Residential Mobile Network'}
                          </p>
                          <p>
                            <strong className="text-slate-100">Timezone:</strong>{' '}
                            {m.location?.timezone || 'Africa/Kampala'}
                          </p>
                        </div>

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-2 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-700/50 font-bold py-1.5 px-2.5 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-amber-400" /> Open in Google Maps
                        </a>
                      </div>

                      {/* Box 2: Device & Browser Intelligence */}
                      <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-amber-400 font-bold border-b border-amber-900/30 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Device &amp; Browser
                          </span>
                          <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                            {m.deviceInfo?.deviceType || 'Mobile'}
                          </span>
                        </div>

                        <div className="space-y-1 text-slate-300 text-[11px]">
                          <p>
                            <strong className="text-slate-100">Browser:</strong>{' '}
                            {m.deviceInfo?.browser || 'Google Chrome'}
                          </p>
                          <p>
                            <strong className="text-slate-100">Operating System:</strong>{' '}
                            {m.deviceInfo?.os || 'Android OS'}
                          </p>
                          <p>
                            <strong className="text-slate-100">Screen Resolution:</strong>{' '}
                            {m.deviceInfo?.screenResolution || '1080x2340'}
                          </p>
                          <p>
                            <strong className="text-slate-100">Client Language:</strong>{' '}
                            {m.deviceInfo?.language || 'en-UG'}
                          </p>
                        </div>
                      </div>

                      {/* Box 3: VPN & Security Detection Status */}
                      <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold border-b border-amber-900/30 pb-1.5">
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <Wifi className="w-3.5 h-3.5 text-amber-400" /> VPN &amp; Security Audit
                          </span>
                          {isVpn ? (
                            <span className="bg-rose-950 text-rose-300 border border-rose-600 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-rose-400" /> VPN Detected
                            </span>
                          ) : (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Direct Network
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 text-slate-300 text-[11px]">
                          <p>
                            <strong className="text-slate-100">Connection Type:</strong>{' '}
                            <span className={isVpn ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                              {m.securityInfo?.ipType || (isVpn ? 'VPN / Proxy / Datacenter' : 'Residential / Cellular')}
                            </span>
                          </p>

                          <div className={`p-2 rounded-lg border text-[11px] leading-tight ${
                            isVpn 
                              ? 'bg-rose-950/40 border-rose-800/60 text-rose-200' 
                              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                          }`}>
                            <span className="font-semibold block mb-0.5">Detection Analysis:</span>
                            {m.securityInfo?.vpnReason || (isVpn ? 'VPN or Proxy connection detected via network timezone mismatch.' : 'Direct residential connection verified.')}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Email Reply Modal */}
      {selectedEmailMsg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-600/60 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative text-slate-100 my-8">
            <button
              type="button"
              onClick={() => setSelectedEmailMsg(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between gap-3 border-b border-amber-900/40 pb-3 pr-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-amber-100">Reply to Consultation Inquiry</h3>
                  <p className="text-xs text-amber-300/80">Direct reply to client with automated tracking &amp; status updates</p>
                </div>
              </div>
            </div>

            {/* SMTP Status Chip */}
            <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
              mailServerStatus?.configured 
                ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200' 
                : 'bg-amber-950/50 border-amber-800/80 text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                {mailServerStatus?.configured ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold">
                    {mailServerStatus?.configured ? 'SMTP Server Ready:' : 'SMTP Server Notice:'}
                  </span>{' '}
                  <span className="opacity-90">{mailServerStatus?.status || 'Connecting to mail.privateemail.com...'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSmtpConfigModal(true)}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-md font-semibold shrink-0 transition-colors"
              >
                Settings
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p><strong className="text-amber-400">Client:</strong> {selectedEmailMsg.name} (&lt;{selectedEmailMsg.email}&gt;)</p>
                  {selectedEmailMsg.phone && (
                    <p><strong className="text-amber-400">Phone:</strong> {selectedEmailMsg.phone}</p>
                  )}
                </div>
                <p><strong className="text-amber-400">Service:</strong> {selectedEmailMsg.service}</p>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] font-semibold mb-1">Email Subject:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 text-[11px] font-semibold">Reply Message Content:</label>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(emailBody);
                      setCopiedReplyText(true);
                      setTimeout(() => setCopiedReplyText(false), 2000);
                    }}
                    className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-semibold"
                  >
                    {copiedReplyText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedReplyText ? 'Copied to Clipboard!' : 'Copy Text'}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-100 focus:outline-none leading-relaxed"
                  placeholder="Type your response to the client..."
                />
              </div>

              {emailSendStatus && (
                <div className={`p-3 rounded-xl text-xs space-y-1.5 ${
                  emailSendStatus.success 
                    ? (emailSendStatus.offline ? 'bg-amber-950/80 border border-amber-700 text-amber-200' : 'bg-emerald-950/80 border border-emerald-700 text-emerald-200') 
                    : 'bg-rose-950/80 border border-rose-700 text-rose-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {emailSendStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold">{emailSendStatus.msg}</span>
                  </div>
                  {emailSendStatus.offline && (
                    <p className="text-[11px] text-amber-300/90 pl-6">
                      💡 Tip: Click <strong>"Open Webmail"</strong> or <strong>"Mail Client"</strong> below to send via your email program with zero setup!
                    </p>
                  )}
                </div>
              )}

              {/* 1-Click Multi-Channel Actions Bar */}
              <div className="bg-slate-950/90 p-3 rounded-2xl border border-amber-900/40 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Quick Multi-Channel Reply Options:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://mail.privateemail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      navigator.clipboard.writeText(`To: ${selectedEmailMsg.email}\nSubject: ${emailSubject}\n\n${emailBody}`);
                      setCopiedReplyText(true);
                      setTimeout(() => setCopiedReplyText(false), 3000);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Opens PrivateEmail webmail and copies the reply text to your clipboard"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    Open PrivateEmail Webmail
                  </a>

                  <a
                    data-no-intercept="true"
                    href={`mailto:${selectedEmailMsg.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                    className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600/40 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Opens your device default mail program (Outlook, Apple Mail, Thunderbird)"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    Open in Mail App (mailto:)
                  </a>

                  {selectedEmailMsg.phone && (
                    <a
                      href={`https://wa.me/${formatWhatsAppPhone(selectedEmailMsg.phone)}?text=${encodeURIComponent(`Hello ${selectedEmailMsg.name},\n\nRegarding your consultation inquiry with Doctor Baba Mukisa:\n\n${emailBody}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      Reply on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Main Dialog Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEmailMsg(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSendEmailReply}
                  disabled={sendingEmail || !emailBody.trim()}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-lg"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingEmail ? 'animate-bounce' : ''}`} />
                  {sendingEmail ? 'Dispatching via SMTP...' : 'Send via SMTP Mailer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated SMTP Server Configuration Modal */}
      {showSmtpConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-600/60 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-100 my-8">
            <button
              type="button"
              onClick={() => setShowSmtpConfigModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-amber-900/40 pb-3 pr-8">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-amber-100">PrivateEmail SMTP Settings</h3>
                <p className="text-xs text-amber-300/80">Configure &amp; test outbound mail authentication for doctorbabamukisa.com</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-[11px] font-semibold mb-1">SMTP Host:</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="mail.privateemail.com"
                    className="w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-[11px] font-semibold mb-1">SMTP Port:</label>
                  <select
                    value={smtpPort}
                    onChange={(e) => {
                      const port = parseInt(e.target.value, 10);
                      setSmtpPort(port);
                      setSmtpSecure(port === 465);
                    }}
                    className="w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value={465}>Port 465 (SSL / Recommended)</option>
                    <option value={587}>Port 587 (STARTTLS)</option>
                    <option value={25}>Port 25 (Standard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] font-semibold mb-1">SMTP Account / Username:</label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="help@doctorbabamukisa.com"
                  className="w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 text-[11px] font-semibold">SMTP Password / App Secret:</label>
                  <span className="text-[10px] text-amber-400">PrivateEmail Mailbox Password</span>
                </div>
                <div className="relative">
                  <input
                    type={showSmtpPass ? 'text' : 'password'}
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Enter your PrivateEmail mailbox password..."
                    className="w-full bg-slate-950 border border-amber-900/60 focus:border-amber-500 rounded-xl pl-3 pr-10 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showSmtpPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Test Result Message */}
              {smtpTestResult && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  smtpTestResult.success 
                    ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-200' 
                    : 'bg-amber-950/80 border border-amber-700 text-amber-200'
                }`}>
                  {smtpTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold">{smtpTestResult.success ? 'Success' : 'Connection Notice'}</p>
                    <p className="text-[11px] leading-relaxed">{smtpTestResult.msg}</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <p><strong className="text-amber-400">PrivateEmail Official Parameters:</strong></p>
                <p>• Webmail URL: <a href="https://mail.privateemail.com" target="_blank" rel="noreferrer" className="text-amber-300 underline">https://mail.privateemail.com</a></p>
                <p>• Outgoing Server: <code className="text-slate-200">mail.privateemail.com</code> (Port 465 SSL or 587 TLS)</p>
                <p>• Incoming Server: <code className="text-slate-200">mail.privateemail.com</code> (Port 993 IMAP SSL)</p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-amber-900/30">
                <button
                  type="button"
                  onClick={() => setShowSmtpConfigModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTestCustomSmtp}
                  disabled={checkingMailServer}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/40 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${checkingMailServer ? 'animate-spin' : ''}`} />
                  {checkingMailServer ? 'Testing Live...' : 'Test Connection'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveSmtpSettings}
                  disabled={savingSmtpConfig}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingSmtpConfig ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUBLIC IMAGES GALLERY MODAL */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-600/80 rounded-3xl p-6 sm:p-8 max-w-4xl w-full my-8 shadow-2xl space-y-6 max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-amber-900/50 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <Folder className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100 flex items-center gap-2">
                    Server Image Storage Directory
                    <span className="text-xs font-mono font-normal text-amber-400/80 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/40">
                      public/ ({publicImages.length} files)
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select any image stored on the website server file path, or upload a new image.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-amber-900/40 rounded-xl p-3 shrink-0">
              <div className="flex items-center gap-2">
                <label className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow active:scale-95">
                  <Upload className="w-3.5 h-3.5" />
                  {isUploadingCreateImg || isUploadingEditImg ? 'Saving...' : 'Upload New File to public/'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingCreateImg || isUploadingEditImg}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadImageFile(file, galleryTarget);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={fetchPublicImages}
                  disabled={isLoadingImages}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoadingImages ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Targeting: <span className="text-amber-300 font-semibold">{galleryTarget === 'create' ? 'New Article Post' : 'Editing Article'}</span>
              </p>
            </div>

            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {isLoadingImages ? (
                <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                  <span>Loading server images...</span>
                </div>
              ) : publicImages.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  <HardDrive className="w-8 h-8 text-amber-500/50 mx-auto mb-2" />
                  No image files found in server storage yet. Upload your first image above.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {publicImages.map((img) => {
                    const isSelected = galleryTarget === 'create'
                      ? featureImage === img.url
                      : editFeatureImage === img.url;

                    return (
                      <div
                        key={img.filename}
                        onClick={() => {
                          if (galleryTarget === 'create') {
                            setFeatureImage(img.url);
                            setCreateImgSavedPath(`public/${img.filename}`);
                          } else {
                            setEditFeatureImage(img.url);
                            setEditImgSavedPath(`public/${img.filename}`);
                          }
                          setShowGalleryModal(false);
                        }}
                        className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all duration-150 p-2 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-500 shadow-lg ring-2 ring-amber-500/50'
                            : 'bg-slate-950/80 border-amber-900/40 hover:border-amber-500/80 hover:bg-slate-900'
                        }`}
                      >
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 relative mb-2">
                          <img
                            src={img.url}
                            alt={img.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => handleImageError(e, DEFAULT_FALLBACK_IMAGE)}
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[11px] font-mono text-slate-200 truncate font-semibold">
                            {img.filename}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{(img.size / 1024).toFixed(0)} KB</span>
                            <span className="text-amber-400/90 font-medium group-hover:underline">
                              {isSelected ? 'Selected' : 'Use Image'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-amber-900/50 pt-4 flex items-center justify-between shrink-0">
              <p className="text-xs text-slate-400">
                Images are saved in the project's root <code className="text-amber-300 font-mono">public/</code> folder and served automatically.
              </p>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
