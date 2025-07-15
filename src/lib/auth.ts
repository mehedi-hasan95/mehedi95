import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { username, admin, emailOTP, twoFactor } from "better-auth/plugins";
import { sendEmail } from "@/utils/node-mailer";
import { sendEmailForPasswordReset } from "@/utils/node-mailer-password-reset";
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: { enabled: false },
    updateAccountOnSignIn: true,
  },
  plugins: [
    username(),
    admin(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendEmail(user.email, otp);
        },
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await sendEmail(email, otp);
        } else if (type === "forget-password") {
          await sendEmailForPasswordReset(email, otp);
        }
      },
    }),
  ],
});
