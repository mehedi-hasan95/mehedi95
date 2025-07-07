import { createTRPCRouter } from "../init";
import { authAction } from "@/action/auth/auth.action";
export const appRouter = createTRPCRouter({
  auth: authAction,
});
// export type definition of API
export type AppRouter = typeof appRouter;
