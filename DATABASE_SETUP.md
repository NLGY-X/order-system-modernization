# Database Setup Guide

## 🚨 Current Status: Database Not Configured

The application is currently running with **mock data** due to database connectivity issues. The Supabase project exists but needs proper setup.

## 🔧 Required Actions for Full Functionality

### 1. Verify Supabase Project Access

Current Supabase Configuration:
- **Project URL**: https://zezcsjltcbajkuqyxupt.supabase.co
- **Anonymous Key**: Configured (but may be invalid)
- **Service Role Key**: Missing or invalid

### 2. Get Valid API Keys

You need to obtain fresh API keys from the Supabase dashboard:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open project: `zezcsjltcbajkuqyxupt`
3. Navigate to **Settings → API**
4. Copy the following keys:
   - **anon/public key** (for frontend)
   - **service_role key** (for admin operations)

### 3. Update Configuration Files

Update the following files with valid keys:

**File: `start-dev.ps1`**
```powershell
$env:SUPABASE_ANON_KEY = "your_new_anon_key_here"
```

**File: `frontend/nuxt.config.ts`**
```typescript
supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'your_new_anon_key_here'
```

**File: `execute-sql-supabase.js`**
```javascript
const supabaseServiceKey = 'your_service_role_key_here';
```

### 4. Run Database Setup

Once you have valid keys, run the database setup:

```bash
# Method 1: Using the setup script
node execute-sql-supabase.js

# Method 2: Manual SQL execution in Supabase Dashboard
# Copy and paste the contents of setup-database.sql into the SQL Editor
```

### 5. Required Database Schema

The application expects these tables:

```sql
-- Core Tables
products                 -- Certification products
ppp_classifications      -- Countries with PPP pricing tiers
product_prices          -- Tier-based pricing structure
orders                  -- Customer orders

-- See setup-database.sql for complete schema
```

## 🔍 Troubleshooting

### Issue: "Invalid API key" (401 Errors)
**Cause**: API keys are expired or invalid
**Solution**: Get fresh keys from Supabase dashboard

### Issue: "Table doesn't exist" 
**Cause**: Database schema not created
**Solution**: Run `setup-database.sql` in Supabase SQL Editor

### Issue: "Permission denied" with valid keys
**Cause**: Row Level Security (RLS) policies blocking access
**Solution**: Check RLS policies in Supabase dashboard

## 🔄 Current Workaround

The application currently uses **mock data** to allow development to continue:

**Mock Products:**
- Certified Kubernetes Administrator (CKA)
- Certified Kubernetes Application Developer (CKAD)
- Certified Kubernetes Security Specialist (CKS)
- AWS Solutions Architect Associate

**Mock Countries:**
- United States, Canada, United Kingdom, Germany, France
- Australia, Brazil, Mexico, India, Japan

## ✅ Verification Steps

After database setup, verify functionality:

1. **Check Products Load**:
   ```bash
   # Should show real products from database
   curl "https://zezcsjltcbajkuqyxupt.supabase.co/rest/v1/products?select=*" \
     -H "apikey: YOUR_ANON_KEY"
   ```

2. **Check Countries Load**:
   ```bash
   curl "https://zezcsjltcbajkuqyxupt.supabase.co/rest/v1/ppp_classifications?select=*" \
     -H "apikey: YOUR_ANON_KEY"
   ```

3. **Remove Mock Data Warning**:
   - Once database is working, the yellow warning banner will disappear
   - Real data will replace mock data automatically

## 📋 Database Schema Overview

```
products
├── id (UUID, Primary Key)
├── name (Text, Unique)
├── description (Text)
├── created_at (Timestamp)
└── updated_at (Timestamp)

ppp_classifications
├── id (UUID, Primary Key)
├── country_name (Text, Unique)
├── ppp_tier (Text: 'Tier 1', 'Tier 2', 'Tier 3', 'Global')
├── created_at (Timestamp)
└── updated_at (Timestamp)

product_prices
├── id (UUID, Primary Key)
├── product_id (UUID, Foreign Key)
├── ppp_tier (Text)
├── min_quantity (Integer)
├── max_quantity (Integer)
├── price_usd (Decimal)
├── created_at (Timestamp)
└── updated_at (Timestamp)

orders
├── id (UUID, Primary Key)
├── email (Text)
├── product_name (Text)
├── country_name (Text)
├── quantity (Integer)
├── unit_price_usd (Decimal)
├── total_price_usd (Decimal)
├── stripe_checkout_url (Text)
├── status (Text: 'pending', 'processed', 'error')
├── error_message (Text)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

## 🎯 Next Steps

1. **Priority 1**: Get valid Supabase API keys
2. **Priority 2**: Run database setup script or SQL manually
3. **Priority 3**: Verify data loads correctly (warning banner disappears)
4. **Priority 4**: Test order creation functionality
5. **Priority 5**: Configure Stripe and email services

## 📞 Support

If you need access to the Supabase project:
- Contact the project owner for dashboard access
- Or create a new Supabase project and update all configuration files with new URL/keys 