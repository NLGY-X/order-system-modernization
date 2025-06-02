# Data Files for Migration

This directory should contain the CSV files needed for data migration:

## Required Files

1. **PPP Classification.csv** - Contains country names and their PPP tier classifications
   - Expected columns: `country_name`, `ppp_tier` (or similar variations)

2. **Product Pricing.csv** - Contains product names and pricing information across different tiers
   - Expected columns: `Certification Package` (product name) and pricing columns like `Global (Tier 1-100)`, `PPP1 (Tier 101-400)`, etc.

## Usage

1. Place the CSV files in this directory
2. Copy `env.example` to `.env` and fill in your Supabase credentials
3. Run the migration scripts:
   ```bash
   cd backend/scripts
   npm install
   npm run migrate-ppp
   npm run migrate-pricing
   ```

## Notes

- The migration scripts are idempotent - they can be run multiple times safely
- Existing records will be skipped to avoid duplicates
- Check the console output for detailed progress and any errors 