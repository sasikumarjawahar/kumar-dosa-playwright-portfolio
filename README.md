# Kumar's Dosa House: Playwright E2E Portfolio

A standalone end-to-end testing project for the live Kumar's Dosa House ordering demo:

**Target:** https://sasiecommercetest.netlify.app/

The suite covers menu rendering, cart calculations, order placement and lookup, simulated payment outcomes, theme persistence, responsive layout, and the demo staff flow. It uses Playwright's user-facing locators and isolated browser contexts so each test starts with clean browser storage.

## Run locally

Requirements: Node.js 20+ and npm.

```powershell
npm install
npx playwright install chromium
npm test
```

Run a focused suite or open the HTML report:

```powershell
npx playwright test tests/menu-cart.spec.ts
npx playwright show-report
```

The target defaults to the deployed site. To test a different environment:

```powershell
$env:BASE_URL = 'https://your-preview-url.example'
npm test
```

## Coverage

- Menu content, accessible image text, and image loading
- Quantity controls, empty-cart state, item count, and rupee totals
- Valid and invalid order lookup, plus order confirmation and cart reset
- Approved, declined, and timed-out demo payment outcomes
- User-provided name rendering in order details
- Light/dark theme toggle and persistence
- Mobile viewport overflow and core controls
- Staff demo sign-in, session-gated dashboard navigation, and sign-out

See [TEST_STRATEGY.md](TEST_STRATEGY.md) for scope, risks, priorities, and the test matrix.

## Important scope note

This website is a front-end demo. Orders and staff state are stored in browser storage; there is no payment processor or server-side order API. The checkout outcome selector is also a local simulation: it never collects card details or charges money. The staff sign-in is explicitly not real authentication. These tests verify the demonstrated UI flows only and are not a security certification or production transaction test.
