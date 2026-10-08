# Doctor Baba Mukisa - African Traditional Herbalist & Spiritual Guidance Sanctuary

Official web application and consultation portal for Doctor Baba Mukisa, an authentic African traditional herbalist and spiritual advisor with over 25 years of ancestral guidance practice based in Kampala, Uganda.

## 🌿 Overview

This platform provides a complete digital sanctuary featuring:
- **Services Showcase**: Relationship reconciliation, marriage harmony, spiritual cleansing, prosperity consultations, and ancestral guidance.
- **Direct Client Communication**: Instant WhatsApp routing (`+256761359634`), direct phone calling, and responsive client contact inquiry forms.
- **Private Admin Management**: Client inquiry inbox with geolocation insights, device details, response management, and email dispatch.
- **Editorial & Knowledge Base**: Cultural articles, traditional rituals guide, gallery, and video repository.
- **AI Assisted Post Drafting**: Server-side Gemini API integration for editorial outlines and trend research with traditional knowledge grounding.
- **Comprehensive SEO & Structured Data**: JSON-LD schema (`ProfessionalService`), OpenGraph cards, Twitter preview cards, sitemap, and robots directives.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/), [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Backend**: [Express](https://expressjs.com/), [Node.js 22](https://nodejs.org/), [TSX](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/)
- **Email Dispatch**: [Nodemailer](https://nodemailer.com/) (SMTP with PrivateEmail / Custom Host)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini SDK)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20+` or `v22+`
- **npm**: `v10+`

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/babamukiisa-byte/Doctor-Baba-.git
cd Doctor-Baba-
npm install
```

### 3. Environment Variables
Copy the example environment configuration file:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```ini
# Server-side Gemini API Key (optional, for AI post creation features)
GEMINI_API_KEY=your_gemini_api_key_here

# SMTP Email Configuration (optional, for inquiry notifications)
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=help@doctorbabamukisa.com
SMTP_PASS=your_smtp_password_here
NOTIFICATION_EMAIL=help@doctorbabamukisa.com
```

### 4. Running the Development Server
Start the local full-stack server on `http://localhost:3000`:
```bash
npm run dev
```

### 5. Building for Production
Create the production bundle (Vite client build + esbuild server bundle):
```bash
npm run build
```

Run the production server:
```bash
npm start
```

### 6. Linting & Type Checking
Verify TypeScript types:
```bash
npm run lint
```

---

## 📁 Project Structure

```
├── public/                 # Static assets, branding, and images
│   ├── sitemap.xml         # XML Sitemap for search engines
│   └── robots.txt          # Web crawler instructions
├── server/                 # Server data stores & emailer utilities
│   ├── ai_settings.json    # AI editorial toggles
│   ├── blogs_store.json    # Persistent blog data store
│   ├── mailer.ts           # SMTP email dispatcher
│   └── messages_store.json # Persistent client inquiries store
├── src/
│   ├── components/         # UI Views & React components
│   ├── context/            # React contexts (WhatsApp, Email)
│   ├── data/               # Static dataset definitions & site info
│   ├── utils/              # SEO helpers, routing, image normalization
│   ├── App.tsx             # Main application orchestrator
│   └── main.tsx            # Application entry point
├── server.ts               # Express full-stack server with Vite middleware
├── index.html              # HTML entry point with JSON-LD structured data
├── package.json            # Scripts & project dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## 🔒 Security & Best Practices

- **Web Application Firewall (WAF)**: Built-in anti-DDoS rate limiter and malicious payload inspection rules.
- **Strict Headers**: Includes Content-Security-Policy (CSP), `X-Content-Type-Options: nosniff`, and `X-Frame-Options`.
- **Protected Credentials**: All secret tokens and SMTP credentials remain strictly server-side.

---

## 📄 License

Private & Proprietary © Doctor Baba Mukisa Temple Sanctuary.
