# Pricing Calculation Test Suite

This directory contains comprehensive tests for the certificates.dev Partner Program pricing calculation system, ensuring accurate discount calculations and order processing.

## Test Coverage

### 1. Volume Discount Testing
- **No Discount (1-100 quantity)**: Validates that small orders receive no volume discount
- **5% Discount (101-400 quantity)**: Tests medium volume discount tier
- **10% Discount (401-800 quantity)**: Tests large volume discount tier  
- **15% Discount (801+ quantity)**: Tests maximum volume discount tier
- **Boundary Testing**: Ensures exact boundaries (100/101, 400/401, 800/801) work correctly

### 2. PPP (Purchasing Power Parity) Discount Testing
- **Tier 1 Countries (20% discount)**: US, Canada, UK, Germany, France, etc.
- **Tier 2 Countries (35% discount)**: Poland, Czech Republic, Spain, Italy, etc.
- **Tier 3 Countries (50% discount)**: India, Brazil, Mexico, Argentina, etc.
- **Global Pricing (No discount)**: Unknown or unlisted countries

### 3. Combined Discount Logic
- **Multiplicative Application**: Ensures discounts multiply (not add) correctly
- **Maximum Discount Scenarios**: Tests 15% volume + 50% PPP combinations
- **Edge Cases**: Boundary values and decimal rounding

### 4. Product-Specific Testing
- **Vue.js Certifications**: Mid-level and senior bundles
- **JavaScript Certifications**: Junior through senior levels
- **Angular Certifications**: Complete preparation packages
- **Fallback Pricing**: Unknown products default to $100 base price

### 5. API Endpoint Testing
- **Calculate Pricing API** (`/api/calculate-pricing`): Real-time pricing previews
- **Create Order API** (`/api/create-order`): Order creation with accurate totals
- **Error Handling**: Invalid inputs and missing fields
- **Response Validation**: Correct pricing structure and values

## Test Files

### `pricing-calculations.test.js`
Unit tests using Vitest framework for the core pricing calculation logic.

### `pricing-api.test.js`  
Integration tests for the API endpoints with mocked database responses.

### `run-pricing-tests.js`
Standalone test runner with no dependencies for quick validation.

## Running Tests

### Quick Pricing Tests (No Dependencies)
```bash
npm run test:pricing
```

### Full Vitest Suite
```bash
npm test
```

### Watch Mode for Development
```bash
npm run test:pricing-watch
```

### With Coverage Report
```bash
npm run test:coverage
```

## Discount Calculation Examples

### Example 1: Basic Volume Discount
- Product: Vue Mid: Voucher Only ($220)
- Country: Unknown (Global pricing)
- Quantity: 200
- **Result**: $209/unit × 200 = $41,800 total (5% volume discount)

### Example 2: PPP Discount Only
- Product: Vue Mid: Voucher Only ($220)
- Country: India (Tier 3 PPP)
- Quantity: 5
- **Result**: $110/unit × 5 = $550 total (50% PPP discount)

### Example 3: Maximum Discounts Combined
- Product: Vue Mid: Voucher Only ($220)
- Country: India (Tier 3 PPP)
- Quantity: 1000 (15% volume)
- **Calculation**: $220 × 0.85 × 0.5 = $93.50/unit
- **Result**: $93.50/unit × 1000 = $93,500 total

### Example 4: Real Partner Scenario
- Product: JavaScript Junior: Voucher Only ($69)
- Country: Germany (Tier 1 PPP)
- Quantity: 150 (5% volume)
- **Calculation**: $69 × 0.95 × 0.8 = $52.44/unit
- **Result**: $52.44/unit × 150 = $7,866 total

## Validation Rules

### Volume Discounts
- 1-100 units: 0% discount (full price)
- 101-400 units: 5% discount
- 401-800 units: 10% discount
- 801+ units: 15% discount

### PPP Regional Discounts
- **Tier 1** (20% off): Developed economies (US, EU, etc.)
- **Tier 2** (35% off): Emerging economies (Eastern Europe, etc.)
- **Tier 3** (50% off): Developing economies (India, Brazil, etc.)
- **Global** (0% off): Default for unlisted countries

### Business Rules Tested
1. **Multiplicative Discounts**: Volume and PPP discounts multiply, not add
2. **Boundary Precision**: Exact quantity boundaries trigger correct tiers
3. **Decimal Rounding**: Prices rounded to 2 decimal places
4. **Fallback Pricing**: Unknown products default to $100 base price
5. **Error Handling**: Invalid quantities and missing fields rejected

## Test Automation

These tests run automatically:
- On every code commit (if CI/CD is configured)
- Before production deployments
- During development with watch mode

## Troubleshooting

### Common Issues
1. **Test Failures**: Check if pricing logic in API files matches test expectations
2. **Database Dependencies**: Use standalone runner for quick validation
3. **Environment Variables**: Ensure test environment is properly configured

### Updating Tests
When adding new products or changing discount rates:
1. Update base prices in test files
2. Add new test cases for new products
3. Verify boundary calculations remain accurate
4. Run full test suite before deploying

## Coverage Goals

Our test suite aims for:
- ✅ 100% coverage of pricing calculation functions
- ✅ All volume discount tiers tested
- ✅ All PPP discount tiers tested  
- ✅ All product categories tested
- ✅ Error conditions and edge cases tested
- ✅ API endpoints validated with realistic scenarios

This comprehensive testing ensures that partners receive accurate pricing quotes and orders are processed with correct discount calculations. 