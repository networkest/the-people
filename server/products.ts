/**
 * Stripe Products Configuration
 * Define all products and prices for the collective funding platform
 */

export const STRIPE_PRODUCTS = {
  JOINING_FEE: {
    name: "Collective Membership - Joining Fee",
    description: "One-time fee to join the the.people collective",
    amount: 5000, // $50.00 in cents
    currency: "usd",
    type: "one_time",
  },
  MONTHLY_SUBSCRIPTION: {
    name: "Monthly Membership Subscription",
    description: "Monthly subscription for ongoing platform access",
    amount: 2000, // $20.00 in cents
    currency: "usd",
    type: "recurring",
    interval: "month",
  },
  RECURRING_CONTRIBUTION: {
    name: "Recurring Income Contribution",
    description: "Automated recurring contribution based on percentage of income",
    currency: "usd",
    type: "recurring",
    interval: "month",
  },
};

export type StripeProductType = keyof typeof STRIPE_PRODUCTS;
