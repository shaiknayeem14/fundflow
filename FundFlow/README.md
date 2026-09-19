# FundFlow — Fund an Idea. Change a Life.

FundFlow is a portfolio-ready, frontend-only crowdfunding platform built with HTML5, CSS3 and vanilla JavaScript. It demonstrates campaign discovery, search/filtering, creator and donor dashboards, simulated payment states, receipts, notifications, admin workflows, LocalStorage persistence, Chart.js analytics and responsive UI.

> **Demo Payment Environment:** No real money is transferred. Do not enter real card numbers, CVV values or banking credentials.

## Features
- Premium responsive landing page
- 8+ realistic campaign records
- Search, category filters and sorting
- Trending-score algorithm
- Campaign detail pages and impact calculator
- Frontend-demo authentication
- Campaign creation and verification workflow
- Donation → checkout → processing → result → receipt flow
- Payment states: INITIATED, PROCESSING, SUCCESS, FAILED, CANCELLED, PENDING, REFUNDED
- Payment history and donor dashboard
- Creator analytics with Chart.js
- Admin dashboard for campaign/user/transaction simulation
- Saved campaigns
- Notifications
- Dark mode
- Toasts, dialogs, progress animations and accessible forms
- LocalStorage-backed application state

## Technology
HTML5, CSS3, Vanilla JavaScript ES6+, LocalStorage, CSS Grid/Flexbox, Font Awesome CDN, Chart.js CDN.

## Run
1. Extract the project.
2. Open `index.html` directly in a browser, or serve the folder with a static server.
3. Demo credentials:
   - User: `demo@fundflow.app`
   - Password: `demo123`
   - Admin: `admin@fundflow.app`
   - Password: `admin123`

Authentication is intentionally simulated for portfolio demonstration only.

## Architecture

Landing → Campaign Discovery → Search/Filter → Campaign Details → Donation → Checkout → Payment Processing → Payment Status → Receipt → Donor Dashboard

Creator: Register/Login → Create Campaign → Verification → Published Campaign → Donations → Creator Dashboard → Analytics

Admin: Login → Admin Dashboard → Users / Campaigns / Transactions / Verification / Refund Simulation

## Algorithms
### Trending Score
The score combines normalized funding percentage, recent donations, supporter count and recent activity:

`score = 0.40*funding + 0.25*recentDonations + 0.20*supporters + 0.15*recentActivity`

Each component is normalized to 0–100. The UI marks campaigns above the configured threshold as Trending.

### Search
Case-insensitive matching against title, description, category and creator.

### Filtering & Sorting
Category filtering plus Trending, Newest, Most Funded, Ending Soon and Most Supporters sorting.

### Impact Calculator
Category-specific impact ratios convert a donation amount into illustrative impact units.

## LocalStorage
Centralized in `js/storage.js`. Keys include users, currentUser, campaigns, donations, transactions, notifications, savedCampaigns and theme.

## Payment lifecycle
INITIATED → PROCESSING → SUCCESS / FAILED / PENDING / CANCELLED. A successful demo payment updates campaign totals and creates a receipt. Admin can simulate a refund for a successful transaction.

## Security limitations
This is a frontend demonstration. Production implementation should use:
- Backend authentication
- Password hashing
- HTTPS
- Server-side validation
- Secure session/token management
- Payment gateway SDK
- Webhook verification
- Database transactions
- Authorization controls
- PCI-compliant payment processing

Never store real card numbers, CVV, banking passwords or other payment secrets in this demo.

## Future production architecture
Frontend → API Gateway → Auth Service → Campaign Service → Payment Service → PostgreSQL/Redis → Object Storage/CDN. Payment provider webhooks should be verified server-side and transaction state should be authoritative on the backend.

## Resume-ready description
**FundFlow — Crowdfunding Web Application:** Built a responsive crowdfunding platform using HTML5, CSS3 and vanilla JavaScript with LocalStorage persistence, campaign search/filtering, trending-score ranking, simulated payment lifecycle, donor/creator/admin dashboards, Chart.js analytics, receipts, notifications, dark mode and responsive UI.

## Security and Payment Improvements (v2)

- Passwords are stored as SHA-256 hashes in the browser instead of plain text after migration.
- Login has a five-attempt brute-force lockout window and session expiry.
- "Remember me" creates a longer demo session; normal sessions expire sooner.
- Suspended users cannot sign in.
- Checkout now requires an authenticated user.
- Payment methods have method-specific demo validation for UPI, cards, net banking, and wallets.
- Payment lifecycle is deterministic: INITIATED → PROCESSING → SUCCESS, so successful demo payments are not randomly failed.
- Transaction finalization is idempotent, preventing duplicate campaign funding when the status page is refreshed.
- Successful donations update campaign totals, supporters, donation history, notifications, and receipts.
- Admin refund simulation remains available.

### Important production note
This project is still a frontend-only portfolio demo. Browser LocalStorage authentication is not production-grade security, and the payment flow does not move real money. For production, use a backend with secure password hashing (Argon2id/bcrypt), HTTP-only secure sessions, server-side authorization, a database, and a real payment provider such as Razorpay/Stripe with server-created orders and webhook verification.
