# 👨‍💻 Developer Setup Guide

**⚡ Get the order system running in 5 minutes**

## 🎯 Prerequisites
- Node.js 18+ installed
- Access to Supabase dashboard
- Basic knowledge of Vue.js/Nuxt.js

## 🚀 Step-by-Step Setup

### **1. Clone & Install**
```bash
# Navigate to project
cd order-system-modernization

# Install all dependencies  
npm install
cd frontend && npm install
cd ../backend/scripts && npm install
cd ../..
```

### **2. Get API Keys**
```bash
# Go to Supabase dashboard
# URL: https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/settings/api

# Copy these 2 keys:
# - anon / public key
# - service_role key
```

### **3. Configure Keys**
```bash
# Edit: supabase-config.js
# Replace placeholders with your actual keys:

module.exports = {
  supabaseUrl: 'https://zezcsjltcbajkuqyxupt.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIs...',      # Paste anon key
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIs...' # Paste service_role key
};
```

### **4. Test Configuration**
```bash
# Verify everything works
node test-everything.js

# Expected output:
# ✅ Frontend connection successful!
# ✅ Backend connection successful!
# ✅ Database ready
```

### **5. Start Development**
```bash
# Start the application
cd frontend && npm run dev

# Application runs at: http://localhost:3000
```

## ✅ Verification Checklist

**After setup, verify these work:**

- [ ] **Home page loads** at http://localhost:3000
- [ ] **Product dropdown** shows real Angular certifications
- [ ] **Country dropdown** shows 150+ countries  
- [ ] **No yellow "mock data" banner** visible
- [ ] **Admin panel** accessible at http://localhost:3000/admin/login
- [ ] **Console shows** real data from Supabase (not mock data)

## 🐛 Common Issues

### Issue: "Invalid API key"
```bash
# Solution: Get fresh keys from Supabase dashboard
# Keys expire - always get new ones
```

### Issue: "supabaseUrl is required"  
```bash
# Solution: Run the test script
node test-everything.js
# This auto-updates frontend/.env.local
```

### Issue: Still seeing mock data
```bash
# Check your keys in supabase-config.js
# Make sure they're the latest from dashboard
# Look for yellow warning banner on website
```

### Issue: Port 3000 in use
```bash
# App will auto-use next available port (3001, 3002, etc.)
# Check terminal output for actual URL
```

## 🔧 Development Workflow

### **Daily Development**
```bash
# 1. Start development server
cd frontend && npm run dev

# 2. Open browser to http://localhost:3000
# 3. Code away! Hot reload enabled

# 4. Check connections (if issues)
node test-everything.js
```

### **Key Files to Know**
```bash
supabase-config.js           # 🔑 API keys (only file to edit)
frontend/pages/index.vue     # 🏠 Main order form  
frontend/pages/admin/        # 🛡️ Admin panel pages
backend/database/schema.sql  # 🗄️ Database structure
test-everything.js           # 🧪 Health check script
```

### **Debugging Tips**
```bash
# Frontend issues
cd frontend && npm run dev
# Check browser console for errors

# Database issues  
node test-everything.js
# Check connection status

# Database viewer
# https://supabase.com/dashboard/project/zezcsjltcbajkuqyxupt/editor
```

## 🚀 You're Ready!

**At this point you should have:**
- ✅ Working application with real data
- ✅ Database connection established  
- ✅ Development environment running
- ✅ All tools configured

**Start building! The codebase is clean, documented, and ready for development.**

---

### 📞 Need Help?
- Check `README.md` for comprehensive documentation
- Review `supabase-config.js` for API key configuration
- Run `node test-everything.js` for health checks 