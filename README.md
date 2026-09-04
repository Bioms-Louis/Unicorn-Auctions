# 🏛️ Live Auctioneering Platform

An **hybrid live auction platform built for the Nigerian market**, enabling users to discover auctions, register for events, participate in real-time bidding, track their bids, and manage won lots.

The platform is designed around a **server-authoritative bidding engine**, secure database architecture, realtime bid synchronization, role-based administration, and a headless CMS for editorial content.

> **Built for Nigeria. Priced in Nigerian Naira (₦). Designed for real-time auctions.**

---

## ✨ Features

### 🏷️ Auctions

* Create and manage auction events
* Schedule upcoming auctions
* Live auction states
* Completed auction history
* Auction registration
* Auction countdowns
* Auction lifecycle management
* Configurable auction rules
* Reserve prices
* Bid increments

### ⚡ Live Bidding

* Real-time bid updates
* Server-authoritative bid validation
* Atomic bid processing
* Concurrent bid protection
* Immutable bid history
* Automatic minimum bid calculation
* Anti-sniping protection
* Live auction countdown
* Automatic winner determination

### 👤 User Accounts

* Secure authentication
* User profiles
* Auction registrations
* Active bids
* Bid history
* Won lots
* Watchlists
* Notifications
* Account settings

### 🛠️ Administration

* Admin dashboard
* Auction management
* Lot management
* User management
* Registration approvals
* Bid monitoring
* Winner management
* Settlement management
* Audit logs
* Platform settings

### 📝 Content Management

Powered by **Sanity CMS** for editorial content:

* Homepage sections
* Marketing content
* FAQs
* Blog posts
* Auction guides
* Informational pages
* SEO metadata
* Navigation
* Footer content

Transactional auction data remains in Supabase.

### 📩 Website Forms

**Web3Forms** is used for non-transactional website forms including:

* Contact forms
* General enquiries
* Newsletter subscriptions
* Consignment enquiries
* Partnership enquiries

Web3Forms is **not** used for authentication, bidding, payments, or transactional operations.

---

# 🇳🇬 Nigerian Market

This platform is designed specifically for the Nigerian market.

## Default Configuration

| Setting          | Value          |
| ---------------- | -------------- |
| Country          | Nigeria        |
| Currency         | NGN            |
| Currency Symbol  | ₦              |
| Locale           | `en-NG`        |
| Timezone         | `Africa/Lagos` |
| Display Timezone | WAT            |
| Language         | English        |

All auction-related monetary values are denominated in **Nigerian Naira (NGN)**.

Examples:

```text
₦50,000
₦250,000
₦1,500,000
₦10,000,000
```

The application currently does not support multi-currency transactions or currency conversion.

The architecture is designed so multi-currency support can be introduced in the future.

---

# 🏗️ Architecture

The platform separates transactional application data from editorial content.

```text
                    ┌─────────────────────┐
                    │      Next.js        │
                    │   App Router + TS   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌──────────────┐
      │  Supabase   │   │   Sanity    │   │ Web3Forms    │
      │             │   │    CMS      │   │              │
      │ PostgreSQL  │   │             │   │ Website      │
      │ Auth        │   │ Editorial   │   │ Forms        │
      │ Realtime    │   │ Content     │   │              │
      │ Storage     │   │ SEO         │   │              │
      │ RLS         │   │             │   │              │
      └─────────────┘   └─────────────┘   └──────────────┘
```

---

# 🧰 Tech Stack

## Frontend

* [Next.js](https://nextjs.org/)
* TypeScript
* React
* Tailwind CSS
* shadcn/ui

## Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Realtime
* Supabase Storage
* PostgreSQL Functions / RPC
* Row Level Security

## CMS

* Sanity CMS

## Forms

* Web3Forms

## Validation

* Zod
* React Hook Form where appropriate

## Testing

The project is designed to support unit, integration, and end-to-end testing, with particular emphasis on the bidding engine and concurrent bid processing.

---

# 🔐 Security Model

Security is a core part of the architecture.

The platform uses:

* Supabase Row Level Security
* Server-side authorization
* Role-based access control
* Secure authentication
* Server-side input validation
* Zod schemas
* Protected admin routes
* Secure environment variables
* Audit logging
* Rate limiting where appropriate

### Important

The browser is **never trusted** to determine auction state or bid validity.

The following values are controlled by the server/database:

* Current bid
* Minimum next bid
* Auction status
* Lot status
* Auction end time
* Winner
* Bid validity

---

# ⚡ Bidding Architecture

The bidding system is the most critical part of the platform.

A simplified bid request looks like this:

```text
User
  │
  ▼
Next.js Server Action / API
  │
  ▼
Authenticate User
  │
  ▼
Check Account Status
  │
  ▼
Check Auction Registration
  │
  ▼
Check Auction & Lot Status
  │
  ▼
Get Authoritative Server Time
  │
  ▼
Validate Bid
  │
  ▼
Atomic Database Transaction
  │
  ├── Insert Bid
  ├── Update Current Bid
  ├── Apply Anti-Sniping
  └── Create Notifications
  │
  ▼
Commit
  │
  ▼
Supabase Realtime
  │
  ▼
Connected Clients
```

## Concurrent Bids

The system must protect against race conditions when multiple users submit bids simultaneously.

For example:

```text
Current bid:       ₦100,000
Bid increment:     ₦5,000

User A → ₦105,000
User B → ₦105,000
```

The database transaction determines which bid is accepted.

The application must never rely on:

```text
Read current bid
        ↓
Calculate next bid
        ↓
Write bid
```

as separate uncontrolled operations.

Instead, bid validation and state updates must occur atomically.

---

# ⏱️ Anti-Sniping

The platform supports configurable anti-sniping protection.

Default configuration:

```text
Trigger window:    2 minutes
Extension:         2 minutes
```

If a qualifying bid is submitted within the final two minutes of a lot, the lot's ending time is extended by two minutes.

Example:

```text
Original ending:
8:00 PM

Bid submitted:
7:59 PM

New ending:
8:02 PM
```

The same rule can apply repeatedly while qualifying bids continue arriving during the final extension period.

These values are configurable rather than hardcoded throughout the application.

---

# 🗃️ Core Data Model

The platform uses Supabase PostgreSQL for transactional data.

Core entities include:

```text
profiles
roles
auction_events
auction_lots
lot_images
bids
auction_registrations
watchlists
notifications
winners
orders
audit_logs
```

### Auction Lifecycle

```text
DRAFT
   ↓
SCHEDULED
   ↓
LIVE
   ↓
ENDED
   ↓
SETTLEMENT
   ↓
COMPLETED
```

Possible cancellation:

```text
DRAFT / SCHEDULED / LIVE
        ↓
    CANCELLED
```

### Lot Lifecycle

```text
DRAFT
   ↓
SCHEDULED
   ↓
LIVE
   ↓
SOLD
```

or:

```text
LIVE
 ↓
UNSOLD
```

Other states include:

```text
WITHDRAWN
SETTLED
```

---

# 📁 Project Structure

The project follows a modular Next.js architecture.

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── dashboard/
│   ├── admin/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── auctions/
│   ├── lots/
│   ├── bidding/
│   ├── forms/
│   ├── dashboard/
│   └── admin/
│
├── lib/
│   ├── supabase/
│   ├── sanity/
│   ├── web3forms/
│   ├── auth/
│   ├── bidding/
│   ├── currency/
│   ├── validation/
│   ├── notifications/
│   └── utils/
│
├── hooks/
├── types/
├── constants/
└── config/
```

The exact structure may evolve as the application grows.

---

# 💰 Currency Handling

Currency configuration is centralized.

```ts
export const DEFAULT_CURRENCY = "NGN";
export const DEFAULT_CURRENCY_SYMBOL = "₦";
export const DEFAULT_LOCALE = "en-NG";
export const DEFAULT_TIMEZONE = "Africa/Lagos";
```

Currency formatting should use the centralized formatting utility rather than manually constructing currency strings throughout the application.

Example:

```ts
formatCurrency(50000)
```

Result:

```text
₦50,000
```

Monetary calculations must avoid unsafe JavaScript floating-point arithmetic.

---

# 🕐 Time Handling

All timestamps are stored in UTC.

```text
Database
    ↓
UTC
    ↓
Application
    ↓
Africa/Lagos
    ↓
WAT
```

The client device clock is never treated as authoritative for auction timing.

For example:

```text
02 September 2026, 7:30 PM WAT
```

The live auction engine uses server/database time when determining whether bids can be accepted.

---

# 🖥️ Main Routes

## Public

```text
/
 /auctions
 /auctions/[slug]
 /auctions/[slug]/lot/[lotSlug]
 /live
 /about
 /how-it-works
 /faq
 /contact
 /blog
 /blog/[slug]
```

## Authentication

```text
/login
/register
/forgot-password
/reset-password
```

## User Dashboard

```text
/dashboard
/dashboard/bids
/dashboard/won
/dashboard/watchlist
/dashboard/registrations
/dashboard/notifications
/dashboard/profile
/dashboard/settings
```

## Administration

```text
/admin
/admin/auctions
/admin/auctions/new
/admin/auctions/[id]
/admin/lots
/admin/users
/admin/registrations
/admin/bids
/admin/winners
/admin/settlements
/admin/notifications
/admin/audit-logs
/admin/settings
```

---

# 👤 User Experience

Users can:

1. Create an account
2. Browse auctions
3. View auction details
4. Explore individual lots
5. Register for auctions
6. Get approved where required
7. Join live auctions
8. Place bids
9. Receive realtime updates
10. Track active bids
11. Watch lots
12. Receive notifications
13. View won lots
14. Complete future settlement/payment workflows

---

# 🛠️ Admin Experience

Administrators can manage the entire auction lifecycle.

### Auction Management

* Create auctions
* Edit auctions
* Schedule auctions
* Publish auctions
* Start auctions
* End auctions
* Cancel auctions
* View auction statistics

### Lot Management

* Create lots
* Edit lots
* Upload images
* Set starting prices
* Set reserve prices
* Configure bid increments
* Schedule lots
* Withdraw lots
* Monitor bids
* View winners

### User Management

* Search users
* View user profiles
* Suspend users
* Unsuspend users
* Manage roles

### Registration Management

* View registrations
* Approve registrations
* Reject registrations

### Auction Monitoring

* Monitor live bids
* Monitor auction activity
* View bid history
* Investigate suspicious activity
* Review audit logs

---

# 📝 CMS

Sanity manages editorial content independently from the transactional database.

Potential Sanity schemas include:

```text
siteSettings
homepage
heroSection
faq
blogPost
page
seo
navigation
footer
auctionGuide
```

This allows the content team to update website content without modifying application code.

---

# 📩 Forms

Web3Forms is used for public, non-transactional forms.

Examples:

```text
Contact
Newsletter
Consignment Enquiry
Partnership Enquiry
General Enquiry
```

Transactional operations such as bidding and auction registration are handled by the application and Supabase.

---

# 💳 Payments

Payment processing is **not currently implemented**.

The architecture is prepared for future integration with Nigerian payment providers such as:

* Paystack
* Flutterwave

Future settlement flow:

```text
Auction Ends
      ↓
Winner Determined
      ↓
Settlement Created
      ↓
Payment
      ↓
Payment Confirmation
      ↓
Settlement Completed
```

No payment success is simulated in the current application.

---

# ⛓️ Blockchain / Web3

Despite the use of **Web3Forms**, this application does **not** currently use blockchain technology.

There is no:

* Cryptocurrency bidding
* Wallet connection
* NFT functionality
* Smart contract
* Blockchain settlement

The platform is a conventional online auction platform.

---

# 🧪 Testing

Critical auction functionality should be covered by automated tests.

Important test scenarios include:

### Bidding

* Valid bid
* Invalid bid
* Bid below minimum
* Bid on ended auction
* Bid on inactive lot
* Unregistered bidder
* Suspended bidder
* Concurrent bids
* Anti-sniping
* Auction ending
* Winner determination
* Reserve price

### Authentication

* Login
* Logout
* Protected routes
* Unauthorized access
* Role restrictions

### Authorization

* Users cannot access admin resources
* Users cannot modify other users
* Users cannot modify bids
* Users cannot change auction state

### Currency

* NGN formatting
* Minimum bid calculation
* Bid increment calculation
* Monetary precision

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js LTS
* npm, pnpm, or yarn
* Git
* A Supabase project
* A Sanity project
* A Web3Forms account

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

---

## 2. Install Dependencies

Using npm:

```bash
npm install
```

or pnpm:

```bash
pnpm install
```

---

## 3. Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Configure the required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_VERSION=
SANITY_API_TOKEN=

NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=
```

### Important

Never commit `.env.local` or production secrets to Git.

---

# 🗄️ Supabase Setup

Create a Supabase project and configure:

* PostgreSQL
* Authentication
* Storage
* Realtime

Run the database migrations using the project's configured migration workflow.

Make sure RLS is enabled on all appropriate tables.

---

# 📝 Sanity Setup

Create a Sanity project and configure the required environment variables.

Start the Sanity development environment according to the project's CMS configuration.

Deploy the Sanity Studio when the content model is ready.

---

# 📬 Web3Forms Setup

Create a Web3Forms access key and add it to:

```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=
```

Only use Web3Forms for non-transactional website forms.

---

# ▶️ Development

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

# 🔍 Code Quality

Before submitting changes, run the project's configured checks:

```bash
npm run lint
npm run typecheck
npm run test
```

If a command is not configured yet, it should be added as part of the development setup.

---

# 🔒 Security Principles

The project follows several important security principles:

### Never trust the client

The client cannot determine:

* Whether an auction is live
* Whether a lot is live
* Whether a user can bid
* What the current bid is
* What the minimum bid should be
* Whether an auction has ended
* Who won

### Never expose privileged credentials

Supabase service-role credentials must only exist in trusted server environments.

### Never modify historical bids

Accepted bids form an immutable transaction history.

### Always enforce authorization server-side

Frontend visibility controls are not security controls.

### Keep RLS enabled

Database-level access policies provide an additional layer of protection.

---

# 📈 Future Roadmap

Potential future capabilities include:

* [ ] Paystack integration
* [ ] Flutterwave integration
* [ ] Online settlement
* [ ] Delivery/logistics integration
* [ ] Email notifications
* [ ] SMS notifications
* [ ] Push notifications
* [ ] Seller/consignor accounts
* [ ] Multi-auction-house support
* [ ] Advanced analytics
* [ ] Fraud detection
* [ ] Automated invoicing
* [ ] Multi-currency support
* [ ] Mobile application
* [ ] Public API
* [ ] Advanced reporting

These features are intentionally outside the initial scope.

---

# 🤝 Contributing

Contributions are welcome.

Before submitting a pull request:

1. Create a feature branch.
2. Make focused changes.
3. Follow the existing architecture.
4. Add tests for important functionality.
5. Run linting and type checks.
6. Ensure no secrets are committed.
7. Provide a clear pull request description.

Example:

```bash
git checkout -b feat/live-bidding
```

Commit changes using clear conventional-style messages:

```text
feat: implement realtime bidding
fix: prevent duplicate bid submissions
test: add concurrent bidding tests
docs: update auction architecture
```

---

# 📜 License

This project is currently proprietary unless otherwise specified by the repository owner.

All rights reserved.

---

# 🏛️ Project Philosophy

This platform is built around a simple principle:

> **The UI reflects the auction state. It does not control the auction state.**

For a live auction platform, correctness is more important than appearance.

The system must prioritize:

1. **Bid integrity**
2. **Database consistency**
3. **Security**
4. **Realtime reliability**
5. **Accurate auction timing**
6. **User trust**
7. **Performance**
8. **Excellent user experience**

A beautiful auction interface is useful.

A trustworthy auction engine is essential.

---

## Built for Nigeria 🇳🇬

**Live Auctioneering Platform**

Real-time auctions.
Secure bidding.
Nigerian Naira.
Built for scale.
