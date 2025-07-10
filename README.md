# PakeAja CRM

> **Enterprise-grade CRM system for coating industry with mobile field sales app**

[![Next.js](https://img.shields.io/badge/Next.js-13+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-blue)](https://tailwindcss.com/)

---

## 🚀 **QUICK START**

### **For Developers:**
1. **[Development Setup](./docs/development/)** - Get your environment ready
2. **[API Documentation](./docs/api/)** - Understand the backend APIs
3. **[Database Schema](./docs/database/)** - Know your data structure

### **For Mobile Team:**
1. **[Mobile App Documentation](./docs/mobile/)** - Complete mobile development guide
2. **[Mobile Setup Guide](./docs/mobile/setup-guide.md)** - React Native + Expo setup
3. **[Mobile API Reference](./docs/mobile/api-reference.md)** - Mobile-specific endpoints

### **For DevOps:**
1. **[Deployment Guide](./docs/deployment/)** - Production deployment
2. **[CI/CD Guide](./docs/development/CI_CD_GUIDE.md)** - Automated workflows
3. **[Troubleshooting](./docs/troubleshooting/)** - Fix issues quickly

---

## 📁 **PROJECT STRUCTURE**

```
pakeaja-crm/
├── 📚 docs/                    # Complete documentation
│   ├── api/                    # API documentation
│   ├── database/               # Database documentation
│   ├── deployment/             # Deployment guides
│   ├── development/            # Development guides
│   ├── mobile/                 # Mobile app documentation
│   ├── testing/                # Testing documentation
│   └── troubleshooting/        # Debug guides
│
├── 🗄️ database/               # Database management
│   ├── migrations/             # Schema migrations
│   ├── scripts/                # Database scripts
│   └── schema/                 # Schema definitions
│
├── 🔧 scripts/                # Build & automation
│   ├── build/                  # Build scripts
│   ├── deploy/                 # Deployment scripts
│   ├── development/            # Dev helpers
│   └── maintenance/            # Cleanup scripts
│
├── 🧪 tests/                  # All testing files
│   ├── e2e/                   # End-to-end tests
│   ├── integration/           # Integration tests
│   ├── unit/                  # Unit tests
│   └── reports/               # Test reports
│
├── 🛠️ tools/                  # Development tools
├── 📱 src/                    # Application source
├── 🌐 public/                 # Static assets
└── ⚙️ supabase/               # Supabase config
```

---

## ⚡ **FEATURES**

### **🖥️ Desktop CRM**
- **Sales Pipeline Management** - Kanban-style deal tracking
- **Customer Management** - Complete customer lifecycle
- **Project Management** - Gantt charts and task tracking
- **Quote & Estimate System** - Professional quote generation
- **Material Management** - Inventory and pricing
- **Reporting & Analytics** - Business intelligence dashboard
- **Role-Based Access Control** - Secure user management

### **📱 Mobile Field Sales App**
- **Offline-First Canvassing** - Work without internet (1-3 days retention)
- **GPS Location Tracking** - Automatic location capture
- **Photo Attachments** - Up to 50MB per submission
- **Real-Time Sync** - Instant updates when online
- **Lead Management** - Mobile-optimized lead capture
- **Activity Tracking** - Field sales activity logging

---

## 🛠️ **TECH STACK**

### **Frontend (Desktop)**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern UI components

### **Mobile App**
- **React Native + Expo** - Cross-platform mobile development
- **TypeScript** - Consistent type safety
- **AsyncStorage** - Offline data persistence
- **React Navigation** - Native navigation

### **Backend**
- **Supabase** - PostgreSQL database + Auth + Storage
- **Row Level Security** - Database-level security
- **Real-time Subscriptions** - Live data updates
- **Edge Functions** - Serverless backend logic

---

## 📖 **DOCUMENTATION**

### **📚 [Complete Documentation](./docs/)**
- **[API Reference](./docs/api/)** - REST API endpoints
- **[Database Schema](./docs/database/)** - Data structure
- **[Mobile App Guide](./docs/mobile/)** - Mobile development
- **[Testing Guide](./docs/testing/)** - Quality assurance
- **[Troubleshooting](./docs/troubleshooting/)** - Problem solving

### **🎯 Quick Links**
- **[Development Setup](./docs/development/)** - Start developing
- **[Mobile Setup](./docs/mobile/setup-guide.md)** - Mobile development
- **[Deployment](./docs/deployment/)** - Go to production
- **[Database Migrations](./database/migrations/)** - Schema changes

---

## 🚀 **GETTING STARTED**

### **1. Clone & Install**
```bash
git clone <repository-url>
cd pakeaja-crm
npm install
```

### **2. Environment Setup**
```bash
cp .env.example .env.local
# Configure your Supabase credentials
```

### **3. Database Setup**
```bash
# Run migrations
npm run db:migrate
```

### **4. Start Development**
```bash
npm run dev
# Open http://localhost:3000
```

### **5. Mobile Development**
See **[Mobile Setup Guide](./docs/mobile/setup-guide.md)** for complete React Native + Expo setup.

---

## 🤝 **CONTRIBUTING**

1. **Read** [Development Guide](./docs/development/)
2. **Follow** coding standards and conventions
3. **Test** your changes thoroughly
4. **Document** new features and APIs
5. **Submit** pull requests with clear descriptions

---

## 📞 **SUPPORT**

- **📚 Documentation:** [./docs/](./docs/)
- **🐛 Issues:** Use GitHub Issues
- **💬 Discussions:** GitHub Discussions
- **🔧 Troubleshooting:** [./docs/troubleshooting/](./docs/troubleshooting/)

---

## 📄 **LICENSE**

This project is proprietary software. All rights reserved.

---

**🏗️ Built with ❤️ for the coating industry**
