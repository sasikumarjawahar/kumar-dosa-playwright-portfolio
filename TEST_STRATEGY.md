# End-to-End Test Strategy

## System under test

Kumar's Dosa House is a responsive dosa-ordering demo hosted at https://sasiecommercetest.netlify.app/. The public workflow includes a five-item menu, quantity controls, a customer-name field, a browser-local order receipt and lookup, theme preference persistence, and a demo staff area.

## Objectives

1. Protect the primary browse-to-order journey from regressions.
2. Verify visible totals and validation states from a customer's perspective.
3. Exercise navigation and persisted browser state without coupling tests to implementation internals beyond the documented demo storage behavior.
4. Check key pages and controls at a narrow viewport.
5. Keep automated activity isolated and safe for a public demo environment.

## Scope and limits

| In scope | Not represented by this demo |
|---|---|
| Menu names, prices, images, and accessible text | Payment processing or refunds |
| Add/remove quantities, cart count, and total | Server-side order persistence or concurrency |
| Order confirmation and lookup in the same browser | Email, SMS, kitchen, or fulfillment integration |
| Theme persistence in local storage | Real staff authentication or authorization |
| Staff demo navigation and browser-local order summary | Load, penetration, or compliance certification |
| Desktop and mobile rendering smoke checks | Cross-device sharing of browser-local orders |

## Risk-based coverage

| Priority | Scenario | Expected result |
|---|---|---|
| P0 | Open the home page and render menu | Five named dosa items and their images are available |
| P0 | Add multiple items and enter a name | Cart count and INR total match selected quantities and prices |
| P0 | Submit a valid order | Confirmation, generated order ID, details, and cleared cart are shown |
| P1 | Decrease quantity at zero | Quantity never becomes negative; cart remains empty |
| P1 | Look up a valid or unknown order ID | Existing order details appear; unknown IDs show a not-found message |
| P1 | Toggle theme and reload | Selected theme remains active in that browser context |
| P1 | Use the site at a narrow viewport | Main controls remain visible without horizontal overflow |
| P2 | Enter an HTML-like customer name | Name is displayed as text, not executed markup |
| P2 | Sign in/out of the demo staff area | Demo dashboard is shown only while the browser demo session is set |

## Test suites

- `tests/menu-cart.spec.ts`: menu inventory, image availability, increment/decrement behavior, count and total calculations.
- `tests/order-flow.spec.ts`: order validation, successful submission, receipt, cart reset, lookup, and customer-name rendering.
- `tests/theme-responsive.spec.ts`: theme toggle and persistence, mobile layout smoke test.
- `tests/staff-demo.spec.ts`: invalid and valid demo credentials, dashboard access, sign-out, and unauthenticated redirect behavior.

## Test isolation and data

Playwright creates a fresh browser context per test. Each test also clears local and session storage before navigation. Orders are created only in that isolated browser context and do not reach a backend. Do not add real customer details or secrets to test data.

## Environments and execution

- Default target: deployed Netlify site (`BASE_URL` in the Playwright config).
- Preview target: override with `BASE_URL` to test an approved preview deployment.
- Pull request gate: Chromium suite, with traces and screenshots retained on failure.
- Broader release check: run the same suite against the deployment candidate before production promotion.

The test suite makes ordinary browser requests to the configured site. Do not run load, fuzz, or security scans against production as part of this portfolio project.

## Entry and exit criteria

**Entry:** target URL is reachable; test dependencies and Chromium are installed.

**Exit:** all P0 and P1 checks pass; any P2 failure is triaged; no unexplained console or failed image requests remain for the tested flows.

## Future improvements

- Add an accessibility scan with axe-core and keyboard-only checks.
- Add visual snapshots for a small, stable set of viewports.
- Add API-level coverage if the app gains a server-side order service.
- Add Firefox and WebKit CI jobs after confirming their supported behavior.
- Replace demo staff checks with real authorization tests only if a secure backend is introduced.
