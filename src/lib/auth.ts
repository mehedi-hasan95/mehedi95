import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { username, admin, emailOTP } from "better-auth/plugins";
import { sendEmail } from "@/utils/node-mailer";
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    requireEmailVerification: true,
  },
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID as string,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //   },
  // },
  plugins: [
    username(),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendEmail(email, otp);
        }
      },
    }),
  ],
});
