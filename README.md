# 🚀 Order System - Certification Platform

A modern, full-stack order system for certifications with PPP-based pricing, built with **Nuxt.js 3** and **Supabase**.

## 📋 Project Overview

**Purpose**: Professional certification order system with global PPP (Purchasing Power Parity) pricing  
**Frontend**: Nuxt.js 3 + Vue.js 3 + Tailwind CSS  
**Backend**: Supabase (PostgreSQL + Auth + Storage)  
**Features**: Public order form, admin panel, PPP pricing, Stripe integration  

### 🎯 Key Features
- ✅ **PPP-based pricing** for 150+ countries
- ✅ **Multiple certifications** (Vue, Nuxt, Angular, JavaScript)
- ✅ **Public order form** with country detection
- ✅ **Admin panel** with modern UI/UX
- ✅ **Stripe payment integration**
- ✅ **Responsive design** with professional interface
- ✅ **Toast notifications** and skeleton loading states

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Add your Supabase keys to .env:
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. **Run Development Server**
```bash
npm run dev
```

**✅ Application runs at:** http://localhost:3000

---

## 🏗️ Project Structure

```
📁 Root
├── 📁 pages/                 # Nuxt.js pages (routes)
│   ├── index.vue            # Public order form
│   └── 📁 admin/            # Admin panel pages
│       ├── dashboard.vue    # Admin dashboard
│       ├── products.vue     # Product management
│       └── countries.vue    # Country/PPP management
├── 📁 layouts/              # Layout components
│   └── admin.vue           # Admin panel layout
├── 📁 components/           # Reusable Vue components
├── 📁 composables/          # Vue composables
│   ├── useSupabase.js      # Supabase client
│   ├── useAdminAuthV2.js   # Admin authentication
│   └── useToast.js         # Toast notifications
├── 📁 server/              # Nuxt server API routes
│   └── 📁 api/             # API endpoints
├── 📁 middleware/          # Route middleware
├── 📁 assets/              # Static assets
├── 📁 public/              # Public files
├── 📁 tests/               # Test files
├── nuxt.config.ts          # Nuxt configuration
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### 🔄 Data Flow
1. **Public Form** → Supabase (anon key) → **Order creation**
2. **Admin Panel** → Supabase (service role) → **Full management access**
3. **Payments** → Stripe webhooks → **Order status updates**

---

## 🛠️ Development Guide

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### **Database Management**
The database is managed through Supabase with the following key tables:
- `products` - Available certifications
- `product_prices` - PPP-based pricing matrix
- `ppp_classifications` - Country PPP tiers
- `orders` - Customer orders
- `admin_users` - Admin authentication

### **Admin Panel Features**
- 📊 **Dashboard** - Revenue overview and order statistics
- 🛍️ **Products** - Manage certifications and pricing
- 🌍 **Countries** - Manage PPP classifications
- 🔔 **Toast Notifications** - User feedback system
- 💀 **Skeleton Loading** - Professional loading states
- 🍞 **Breadcrumb Navigation** - Easy navigation

---

## 📊 Database Schema

### **Core Tables**
```sql
📋 products              # Available certifications
├── id (UUID)            # Primary key
├── name (TEXT)          # "Vue Mid: Voucher Only"
└── description (TEXT)   # Certification details

📋 ppp_classifications   # Country PPP tiers  
├── country_name (TEXT)  # "United States", "India"
└── ppp_tier (TEXT)      # "Global", "Tier 1", "Tier 2", "Tier 3"

📋 product_prices       # Tiered pricing matrix
├── product_id (UUID)    # Links to products
├── ppp_tier (TEXT)      # Pricing tier
├── min_quantity (INT)   # Minimum quantity for tier
├── max_quantity (INT)   # Maximum quantity for tier
└── price_usd (NUMERIC)  # Price per unit

📋 orders               # Customer orders
├── id (UUID)           # Primary key
├── customer_email (TEXT)
├── product_id (UUID)    
├── country_name (TEXT)
├── quantity (INT)
├── total_price_usd (NUMERIC)
└── status (TEXT)        # pending/paid/completed/cancelled
```

---

## 🔐 Security & Configuration

### **Environment Variables**
```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Row Level Security (RLS)**
- ✅ **Products**: Public read access
- ✅ **Countries**: Public read access  
- ✅ **Orders**: Insert access for customers, full access for admins
- ✅ **Pricing**: Public read access
- ✅ **Admin Users**: Admin-only access

---

## 🧪 Testing

### **Running Tests**
```bash
npm test              # Run all tests
npm run test:ui       # Interactive test UI
npm run test:coverage # Coverage report
```

### **Test Files**
- `tests/productCalculations.test.js` - Product pricing calculations

---

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm run preview  # Test production build locally
```

### **Environment Variables for Production**
Set the following in your deployment platform:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Vercel Deployment**
The project is configured for Vercel deployment with automatic builds on push.

---

## 📞 Support & Maintenance

### **Key Files**
```bash
nuxt.config.ts           # Nuxt configuration
composables/useSupabase.js  # Database connection
layouts/admin.vue        # Admin panel layout
pages/admin/dashboard.vue # Admin dashboard
```

### **Useful Commands**
```bash
# Development
npm run dev

# Production build
npm run build

# Run tests
npm test

# Check dependencies
npm audit
```

### **Project URLs**
- 🌐 **Application**: http://localhost:3000 (development)
- 🗄️ **Database**: Supabase Dashboard
- 📊 **Admin Panel**: http://localhost:3000/admin

---

## 🎯 Features Implemented

### **UI/UX Enhancements** ✅
- Modern admin panel with professional design
- Toast notification system
- Skeleton loading states
- Enhanced product cards with gradients and icons
- Sortable data tables with hover effects
- Breadcrumb navigation
- Responsive sidebar layout

### **Core Functionality** ✅
- PPP-based pricing system
- Order management
- Product management
- Country/PPP classification management
- Admin authentication
- Real-time data updates

### **Technical Features** ✅
- Nuxt.js 3 with Vue.js 3
- Tailwind CSS for styling
- Supabase integration
- TypeScript support
- Vitest for testing
- Git version control

---

**🎉 This project is production-ready with a modern, professional interface!**
