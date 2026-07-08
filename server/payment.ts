import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import Stripe from "stripe";
import { STRIPE_PRODUCTS } from "./products";
import { createContribution, getMemberByUserId, updateMember, updateUserMembershipStatus } from "./db";
import { TRPCError } from "@trpc/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
// Using default API version

export const paymentRouter = router({
  // Create checkout session for joining fee
  createJoiningFeeCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const user = ctx.user;
      
      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.name || undefined,
          metadata: {
            userId: user.id.toString(),
          },
        });
        stripeCustomerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: STRIPE_PRODUCTS.JOINING_FEE.currency,
              product_data: {
                name: STRIPE_PRODUCTS.JOINING_FEE.name,
                description: STRIPE_PRODUCTS.JOINING_FEE.description,
              },
              unit_amount: STRIPE_PRODUCTS.JOINING_FEE.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${ctx.req.headers.origin}/dashboard?payment=success`,
        cancel_url: `${ctx.req.headers.origin}/dashboard?payment=canceled`,
        client_reference_id: user.id.toString(),
        metadata: {
          userId: user.id.toString(),
          paymentType: "joining_fee",
          customerEmail: user.email || "",
          customerName: user.name || "",
        },
      });

      return {
        checkoutUrl: session.url,
      };
    } catch (error) {
      console.error("[Payment] Failed to create joining fee checkout:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }
  }),

  // Create checkout session for monthly subscription
  createMonthlySubscriptionCheckout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const user = ctx.user;

      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.name || undefined,
          metadata: {
            userId: user.id.toString(),
          },
        });
        stripeCustomerId = customer.id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.currency,
              product_data: {
                name: STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.name,
                description: STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.description,
              },
              unit_amount: STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION.amount,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${ctx.req.headers.origin}/dashboard?subscription=success`,
        cancel_url: `${ctx.req.headers.origin}/dashboard?subscription=canceled`,
        client_reference_id: user.id.toString(),
        metadata: {
          userId: user.id.toString(),
          paymentType: "monthly_subscription",
          customerEmail: user.email || "",
          customerName: user.name || "",
        },
      });

      return {
        checkoutUrl: session.url,
      };
    } catch (error) {
      console.error("[Payment] Failed to create subscription checkout:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create subscription session",
      });
    }
  }),

  // Create checkout for recurring income contribution
  createRecurringContributionCheckout: protectedProcedure
    .input(z.object({
      percentage: z.number().min(0.1).max(100),
      estimatedMonthlyAmount: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = ctx.user;

        let stripeCustomerId = user.stripeCustomerId;
        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.email || undefined,
            name: user.name || undefined,
            metadata: {
              userId: user.id.toString(),
            },
          });
          stripeCustomerId = customer.id;
        }

        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: STRIPE_PRODUCTS.RECURRING_CONTRIBUTION.currency,
                product_data: {
                  name: `${input.percentage}% Income Contribution`,
                  description: `Recurring monthly contribution at ${input.percentage}% of income`,
                },
                unit_amount: Math.round(input.estimatedMonthlyAmount * 100),
                recurring: {
                  interval: "month",
                },
              },
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${ctx.req.headers.origin}/dashboard?contribution=success`,
          cancel_url: `${ctx.req.headers.origin}/dashboard?contribution=canceled`,
          client_reference_id: user.id.toString(),
          metadata: {
            userId: user.id.toString(),
            paymentType: "recurring_contribution",
            contributionPercentage: input.percentage.toString(),
            estimatedMonthlyAmount: input.estimatedMonthlyAmount.toString(),
            customerEmail: user.email || "",
            customerName: user.name || "",
          },
        });

        return {
          checkoutUrl: session.url,
        };
      } catch (error) {
        console.error("[Payment] Failed to create contribution checkout:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create contribution session",
        });
      }
    }),

  // Get payment history
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = ctx.user;
      if (!user.stripeCustomerId) {
        return [];
      }

      const charges = await stripe.charges.list({
        customer: user.stripeCustomerId,
        limit: 50,
      });

      return charges.data.map((charge: any) => ({
        id: charge.id,
        amount: (charge.amount / 100).toFixed(2),
        currency: charge.currency.toUpperCase(),
        status: charge.status,
        description: charge.description,
        created: new Date(charge.created * 1000),
      }));
    } catch (error) {
      console.error("[Payment] Failed to get payment history:", error);
      return [];
    }
  }),
});
