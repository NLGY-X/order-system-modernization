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

### 6. Partner System Testing
- **Application Submission** (`/api/submit-partner-application`): Form validation, duplicate prevention, email format validation
- **Partner Creation** (`/api/admin/create-partner`): Admin partner creation, validation, duplicate prevention
- **Partner Authentication** (`/api/auth/verify-partner-status`): Login validation, role verification, cross-system access
- **Volume Tier Assignment**: Automatic tier assignment based on expected volume
- **Application Management**: Status updates (approve/reject/contact), admin workflow
- **Partner Status Management**: Active/suspended status toggles

### 7. Admin System Testing
- **Admin Authentication** (`/api/auth/verify-admin-status`): Login validation, session management, role verification
- **Admin Authorization**: Permission checks, suspended admin handling, cross-system access
- **Admin User Management**: Profile retrieval, login timestamp updates
- **Dashboard Access**: Admin dashboard data access, non-admin prevention
- **Role Validation**: Permission-based access control, inactive admin handling

### 8. Integration Testing
- **End-to-End Workflows**: Complete partner application → approval → login → ordering process
- **Partner Tier Benefits**: Volume tier pricing verification across different partner levels
- **Admin Cross-System Access**: Admin access to partner system with enterprise privileges
- **Error Recovery**: Partner creation failure handling, database connectivity issues
- **Security Testing**: Unauthorized access prevention, input sanitization, role-based access

## Test Files

### `pricing-calculations.test.js`
Unit tests using Vitest framework for the core pricing calculation logic.

### `pricing-api.test.js`  
Integration tests for the API endpoints with mocked database responses.

### `run-pricing-tests.js`
Standalone test runner with no dependencies for quick validation.

### `partner-system.test.js`
Comprehensive unit tests for the partner management system including:
- Partner application submission and validation
- Admin partner creation workflow
- Partner authentication and authorization
- Volume tier assignment logic
- Application and partner status management
- Password generation and security

### `admin-system.test.js`
Complete admin system testing covering:
- Admin authentication and session management
- Authorization checks and role validation
- Admin user management operations
- Dashboard access control
- Cross-system access permissions
- Error handling and security

### `integration.test.js`
End-to-end integration tests for complete workflows:
- Full partner application → approval → login → ordering workflow
- Partner tier benefits and pricing verification
- Admin cross-system access scenarios
- Error recovery and cleanup processes
- Security testing and input validation

## Running Tests

### Quick Pricing Tests (No Dependencies)
```bash
npm run test:pricing
```

### Partner System Tests
```bash
npm run test:partner
```

### Admin System Tests
```bash
npm run test:admin
```

### Authentication Tests (Partner + Admin)
```bash
npm run test:auth
```

### Integration Tests
```bash
npm run test:integration
```

### All Tests (Complete Suite)
```bash
npm run test:all
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
- ✅ Complete partner application workflow tested
- ✅ Admin authentication and authorization tested
- ✅ Partner authentication and role verification tested
- ✅ Integration between all systems tested
- ✅ Security vulnerabilities and edge cases tested
- ✅ Error recovery and cleanup procedures tested

## Test Statistics

**Total Tests**: 62 tests across 6 test files
- **Pricing System**: 18 tests (pricing calculations + API)
- **Partner System**: 18 tests (applications, creation, auth)
- **Admin System**: 16 tests (authentication, authorization, management)
- **Integration**: 10 tests (end-to-end workflows, security)

**Test Categories**:
- **Unit Tests**: 52 tests (individual function/component testing)
- **Integration Tests**: 10 tests (cross-system workflow testing)
- **Security Tests**: 8 tests (authorization, input validation, access control)
- **Error Handling**: 12 tests (graceful failure and recovery)

This comprehensive testing ensures that:
- Partners receive accurate pricing quotes and orders are processed correctly
- Partner applications are handled securely and efficiently  
- Admin access is properly controlled and authenticated
- All systems work together seamlessly
- Security vulnerabilities are prevented
- Errors are handled gracefully with proper cleanup 