import { projectAction } from "@/action/project/project.action";
import { createTRPCRouter } from "../init";
import { authAction } from "@/action/auth/auth.action";
import { userInfoAction } from "@/action/auth/userInfo.action";
export const appRouter = createTRPCRouter({
  auth: authAction,
  project: projectAction,
  userInfo: userInfoAction,
});
// export type definition of API
export type AppRouter = typeof appRouter;
