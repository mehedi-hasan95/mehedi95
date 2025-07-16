import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  emailOTPClient,
  twoFactorClient,
} from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [adminClient(), emailOTPClient(), twoFactorClient()],
});
export const { signIn, signUp, useSession, getSession } = createAuthClient();
