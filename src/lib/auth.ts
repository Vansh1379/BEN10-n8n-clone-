import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "b53d5c18-6ea4-4e69-a178-8955cd39d39a",
              slug: "BEN10-Automation",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || "",
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
