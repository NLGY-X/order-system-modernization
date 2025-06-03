# Adding New Certification Products

This guide explains how to add the new certification products to your order system with proper PPP (Purchasing Power Parity) and volume discounts.

## 📋 Products to Add

**24 new certification products** across 4 categories:

### Vue Certifications (6 products)
- Vue Mid: Voucher Only ($220.00)
- Vue Mid: Voucher + Preparation ($499.00)
- Vue Mid: Voucher + Preparation + Bootcamp ($999.00)
- Vue Mid + Senior: Voucher Only ($499.00)
- Vue Mid + Senior: Voucher + Preparation ($1,057.00)
- Vue Mid + Senior: Voucher + Preparation + Bootcamp ($2,257.00)

### Nuxt Certifications (6 products)
- Nuxt Mid: Voucher Only ($220.00)
- Nuxt Mid: Voucher + Preparation ($499.00)
- Nuxt Mid: Voucher + Preparation + Bootcamp ($999.00)
- Nuxt Mid + Senior: Voucher Only ($499.00)
- Nuxt Mid + Senior: Voucher + Preparation ($1,057.00)
- Nuxt Mid + Senior: Voucher + Preparation + Bootcamp ($2,257.00)

### Angular Certifications (8 products)
- Angular Junior: Voucher Only ($69.00)
- Angular Junior: Voucher + Preparation ($99.00)
- Angular Mid: Voucher Only ($179.00)
- Angular Mid: Voucher + Preparation ($378.00)
- Angular Mid: Voucher + Preparation + Bootcamp ($999.00)
- Angular Mid + Senior: Voucher Only ($398.00)
- Angular Mid + Senior: Voucher + Preparation ($796.00)
- Angular Mid + Senior: Voucher + Preparation + Bootcamp ($2,166.00)

### JavaScript Certifications (8 products)
- JavaScript Junior: Voucher Only ($69.00)
- JavaScript Junior: Voucher + Preparation ($99.00)
- JavaScript Mid: Voucher Only ($179.00)
- JavaScript Mid: Voucher + Preparation ($378.00)
- JavaScript Mid: Voucher + Preparation + Bootcamp ($999.00)
- JavaScript Mid + Senior: Voucher Only ($398.00)
- JavaScript Mid + Senior: Voucher + Preparation ($796.00)
- JavaScript Mid + Senior: Voucher + Preparation + Bootcamp ($2,166.00)

## 💰 Pricing Structure

Each product gets **16 pricing entries** (4 quantity tiers × 4 PPP tiers):

### Quantity Tiers (Volume Discounts)
- **1-100**: No discount (100%)
- **101-400**: 5% volume discount (95%)
- **401-800**: 10% volume discount (90%)
- **801+**: 15% volume discount (85%)

### PPP Tiers (Regional Discounts)
- **Global**: No discount (100%)
- **Tier 1**: 20% PPP discount (80%)
- **Tier 2**: 35% PPP discount (65%)
- **Tier 3**: 50% PPP discount (50%)

### Example: Vue Mid: Voucher Only ($220.00)
```
┌─────────────┬─────────┬──────────┬──────────┬──────────┐
│ Quantity    │ Global  │ Tier 1   │ Tier 2   │ Tier 3   │
├─────────────┼─────────┼──────────┼──────────┼──────────┤
│ 1-100       │ $220.00 │ $176.00  │ $143.00  │ $110.00  │
│ 101-400     │ $209.00 │ $167.20  │ $135.85  │ $104.50  │
│ 401-800     │ $198.00 │ $158.40  │ $128.70  │  $99.00  │
│ 801+        │ $187.00 │ $149.60  │ $121.55  │  $93.50  │
└─────────────┴─────────┴──────────┴──────────┴──────────┘
```

## 🚀 Method 1: Automated Script (Recommended)

### Prerequisites
1. **Get Supabase Service Role Key**:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Open your project
   - Navigate to **Settings → API**
   - Copy the **service_role** key

2. **Set Environment Variable**:
   ```powershell
   $env:SUPABASE_SERVICE_ROLE_KEY = "your_service_role_key_here"
   ```

### Run the Script
```bash
node add-new-products.mjs
```

The script will:
- ✅ Test database connection
- 📊 Show pricing example
- 🔍 Check for existing products (skips duplicates)
- ➕ Add new products with all pricing tiers
- 📈 Provide detailed progress and summary

## 🔧 Method 2: Manual Admin Panel

If the automated script doesn't work, you can add products manually:

1. **Access Admin Panel**: `/admin/login`
2. **Go to Products**: `/admin/products`
3. **Click "Add New Product"**
4. **For each product**:
   - Enter product name exactly as listed above
   - Set base price (Global, 1-100 quantity tier)
   - Use auto-calculate feature or enter all 16 pricing combinations
   - Save product

## 🔄 Method 3: Direct Database Insert

Advanced users can insert directly into the database:

```sql
-- Example for one product
INSERT INTO products (name, description) 
VALUES ('Vue Mid: Voucher Only', 'Certification package: Vue Mid: Voucher Only');

-- Then insert 16 pricing entries into product_prices table
-- (See the script for complete examples)
```

## ✅ Verification Steps

After adding products:

1. **Check Admin Panel**:
   - Visit `/admin/products`
   - Verify all 24 new products appear
   - Check pricing tables show correct values

2. **Test Order Form**:
   - Visit main page (`/`)
   - Verify new products appear in dropdown
   - Test selecting different countries (PPP discounts)
   - Test different quantities (volume discounts)

3. **Test Checkout**:
   - Complete an order with a new product
   - Verify pricing calculation is correct
   - Check Stripe shows correct amount

## 🏗️ System Updates Made

### 1. Enhanced Pricing Engine (`create-checkout.post.ts`)
- ✅ Updated to query database for pricing
- ✅ Added fallback pricing for all new products
- ✅ Proper PPP tier lookup from country
- ✅ Accurate quantity tier calculation

### 2. Product Addition Script (`add-new-products.mjs`)
- ✅ Automated bulk product creation
- ✅ Duplicate detection and skipping
- ✅ Complete pricing matrix generation
- ✅ Error handling and rollback

### 3. Fallback Pricing
- ✅ All new products added to fallback system
- ✅ Backward compatibility maintained
- ✅ Consistent discount application

## 🔍 Troubleshooting

### "Database connection failed"
- Verify Supabase service role key is correct
- Check network connectivity
- Ensure Supabase project is active

### "Product already exists"
- Script automatically skips existing products
- Use admin panel to edit existing products
- Or manually delete and re-run script

### "Pricing calculation errors"
- Check PPP classifications table has countries
- Verify product_prices table structure
- Review console logs for specific errors

### "Products don't appear in order form"
- Check products table has entries
- Verify RLS policies allow anonymous read access
- Clear browser cache and refresh

## 📊 Expected Results

After successful completion:
- **24 new products** in products table
- **384 pricing entries** in product_prices table (24 × 16)
- **Automatic discounts** applied based on country and quantity
- **Seamless ordering** experience for customers

## 🎯 Next Steps

1. **Test thoroughly** with different countries and quantities
2. **Update any hardcoded product lists** in documentation
3. **Train staff** on new product offerings
4. **Monitor orders** to ensure pricing is calculated correctly
5. **Consider adding** product categories for better organization

## 📞 Support

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify database structure matches expectations
3. Ensure all environment variables are set correctly
4. Contact the development team with specific error details 