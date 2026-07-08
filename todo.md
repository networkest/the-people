# the.people - Project TODO

## Design & Planning
- [x] Extract logo color palette and establish design system
- [x] Create design tokens and CSS variables
- [x] Plan responsive layout and component structure

## Database & Schema
- [x] Design and implement members table
- [x] Design and implement contributions table
- [x] Design and implement forum/threads table
- [x] Design and implement forum/messages table
- [x] Create database migrations

## Authentication & User Management
- [x] Set up user authentication flow (sign up / sign in)
- [x] Implement protected routes for authenticated users
- [ ] Create user profile management

## Payment Integration (Stripe)
- [x] Add Stripe integration to project
- [x] Implement one-time joining fee payment flow
- [x] Implement monthly subscription payment flow
- [x] Implement recurring income contribution payment flow
- [ ] Add payment confirmation and receipt handling
- [ ] Create Stripe webhook handlers for payment events

## Landing Page
- [x] Build hero section with logo and tagline
- [x] Implement concept explanation section
- [x] Create "How It Works" section with 3-step explanation
- [x] Add call-to-action buttons for signup/login
- [x] Ensure responsive design and accessibility

## Membership Registration
- [x] Create registration form with joining fee payment
- [x] Implement Stripe checkout for joining fee
- [ ] Handle successful registration and membership creation
- [ ] Send confirmation emails/notifications

## Member Dashboard
- [x] Build dashboard layout and navigation
- [ ] Implement contribution history view
- [ ] Display personal contribution stats
- [ ] Show collective pool statistics (total pooled, interest earned, member count)
- [ ] Create withdrawal/payout request interface
- [ ] Implement payout status tracking

## Income Contribution Management
- [x] Create contribution percentage setup form
- [x] Implement recurring payment configuration
- [ ] Build contribution history tracker
- [ ] Display contribution status and next payment date

## Interest Earnings & Visualization
- [ ] Create interest earnings tracker
- [ ] Build fund growth visualization with charts
- [ ] Implement real-time pool stats updates
- [ ] Create historical data views

## Forum/Chat Feature
- [x] Design forum/discussion board structure
- [x] Implement threaded discussions
- [ ] Create real-time or near-real-time chat
- [ ] Build message moderation features
- [ ] Implement user mentions and notifications
- [x] Ensure free-tier compatibility

## Testing & Quality
- [ ] Write vitest tests for payment flows
- [ ] Write vitest tests for authentication
- [ ] Write vitest tests for forum features
- [ ] Test responsive design across devices
- [ ] Perform accessibility audit

## GitHub Integration
- [ ] Initialize GitHub repository (public)
- [ ] Configure .gitignore and repository settings
- [ ] Push all project code to GitHub
- [ ] Add comprehensive README documentation

## Deployment & Final Steps
- [ ] Review all features for completeness
- [ ] Test all payment flows in production
- [ ] Verify authentication and security
- [ ] Create final checkpoint
- [ ] Deliver website to user
