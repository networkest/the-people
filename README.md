# the.people - Collective Funding Platform

**by the people, with the people and for the people**

A modern web platform where community members pool a percentage of their income into a shared high-interest account and everyone lives off the accumulated interest.

> "we just join our funds together until...there's enough to pay for everyone's meal!"

## 🎯 Platform Overview

the.people is a collective funding platform that enables communities to:

- **Pool Resources**: Members contribute a percentage of their income to a shared account
- **Earn Together**: The collective pool grows through high-interest investments
- **Live Collectively**: All members benefit from the accumulated interest
- **Discuss & Decide**: Community forum for transparent decision-making

## ✨ Features

### Landing Page
- Hero section with community-focused messaging
- "How It Works" explanation (3-step model)
- Feature highlights and benefits
- Call-to-action for membership

### User Authentication
- OAuth-based sign-in/sign-up via Manus
- Protected member-only areas
- User profile management

### Membership & Payments
- **One-time Joining Fee**: $50 (Stripe)
- **Monthly Subscription**: $20/month (Stripe)
- **Recurring Income Contribution**: Customizable percentage-based (Stripe)
- Secure payment processing with Stripe
- Payment history tracking

### Member Dashboard
- Contribution history
- Collective pool statistics
- Personal contribution stats
- Interest earnings tracking
- Withdrawal/payout interface

### Community Forum
- Threaded discussions
- Real-time message posting
- Forum statistics (threads, messages, members)
- Topic-based organization
- Member participation tracking

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Wouter** for routing
- **tRPC** for type-safe API calls
- **Shadcn/ui** for components
- **Framer Motion** for animations

### Backend
- **Express.js** for server
- **tRPC** for API procedures
- **Stripe** for payment processing
- **MySQL/TiDB** for database
- **Drizzle ORM** for database management

### Database Schema
- **users**: Core authentication & membership
- **members**: Membership details & contribution settings
- **contributions**: Payment transaction history
- **forumThreads**: Discussion topics
- **forumMessages**: Thread messages

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm (package manager)
- MySQL/TiDB database
- Stripe account (for payment processing)

### Installation

```bash
# Clone the repository
git clone https://github.com/networkest/the-people.git
cd the-people

# Install dependencies
pnpm install

# Set up environment variables
# Create a .env file with:
# DATABASE_URL=your_database_url
# STRIPE_SECRET_KEY=your_stripe_secret
# VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
# VITE_APP_ID=your_manus_app_id
# VITE_OAUTH_PORTAL_URL=your_oauth_url

# Run database migrations
pnpm drizzle-kit generate
# Then apply migrations via database UI

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📋 Project Structure

```
the-people/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and helpers
│   │   ├── contexts/      # React contexts
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express server
│   ├── routers.ts         # tRPC procedure definitions
│   ├── payment.ts         # Stripe payment flows
│   ├── forum.ts           # Forum procedures
│   ├── db.ts              # Database helpers
│   └── _core/             # Core server infrastructure
├── drizzle/               # Database schema & migrations
│   └── schema.ts          # Table definitions
├── shared/                # Shared types and constants
└── package.json
```

## 🔐 Security Considerations

- All sensitive data (API keys, tokens) stored in environment variables
- Stripe handles all payment processing (PCI compliant)
- OAuth-based authentication (no password storage)
- Protected routes for authenticated members only
- Database encryption for sensitive fields
- HTTPS enforcement in production

## 💳 Payment Processing

### Stripe Integration

The platform uses Stripe for all payment processing:

1. **Joining Fee**: One-time $50 payment
2. **Monthly Subscription**: Recurring $20/month
3. **Income Contribution**: Customizable recurring payment

#### Testing Payments

Use the Stripe test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

## 📊 Database Schema

### Users Table
- `id`: Primary key
- `openId`: OAuth identifier
- `name`, `email`: User info
- `isMember`: Membership status
- `membershipStatus`: pending/active/inactive
- `stripeCustomerId`: Stripe customer ID
- `joinedAt`: Membership date

### Members Table
- `userId`: Foreign key to users
- `contributionPercentage`: User's contribution %
- `monthlySubscriptionStatus`: Subscription status
- `recurringContributionStatus`: Recurring payment status
- `totalContributed`: Cumulative contributions

### Contributions Table
- `memberId`, `userId`: Foreign keys
- `amount`: Payment amount
- `type`: joining_fee/monthly_subscription/recurring_income
- `status`: pending/completed/failed/refunded
- `stripePaymentIntentId`: Stripe reference

### Forum Tables
- **forumThreads**: Thread topics
- **forumMessages**: Individual messages in threads

## 🧪 Testing

```bash
# Run TypeScript checks
pnpm check

# Run tests
pnpm test

# Format code
pnpm format
```

## 📈 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Real-time interest calculation
- [ ] Withdrawal request system
- [ ] Member voting/governance
- [ ] Mobile app
- [ ] API documentation
- [ ] Advanced forum features (moderation, search)
- [ ] Email notifications
- [ ] Audit logging

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the forum for community discussions

## 🎨 Design System

The platform uses a community-focused color palette derived from the logo:
- **Primary Blue**: #4A90E2 (trust, community)
- **Green**: #2ECC71 (growth, prosperity)
- **Red**: #FF6B6B (energy, passion)
- **Yellow**: #FFD93D (opportunity, wealth)
- **Dark Slate**: #2C3E50 (text, UI elements)

## 🌍 Deployment

### Manus Platform
The application is built on Manus and automatically deploys to:
- **Preview**: https://3000-[subdomain].sg1.manus.computer
- **Production**: Custom domain via Manus dashboard

### Environment Setup
1. Configure Stripe keys in Settings → Payment
2. Set up database connection
3. Configure OAuth credentials
4. Deploy via Manus dashboard

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [tRPC Documentation](https://trpc.io)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)

---

**by the people, with the people and for the people** ✨
