import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { admin, emailOTP, twoFactor } from "better-auth/plugins";
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
  account: {
    accountLinking: { enabled: false },
    updateAccountOnSignIn: true,
  },
  plugins: [
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
