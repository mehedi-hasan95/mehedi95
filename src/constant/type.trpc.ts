import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type projectGetAllType =
  inferRouterOutputs<AppRouter>["project"]["getAllProjects"];
export type messageGetAllType =
  inferRouterOutputs<AppRouter>["userInfo"]["allMessage"];

export type userInfoGetAllType =
  inferRouterOutputs<AppRouter>["userInfo"]["myInfo"];
export type userSkillsType =
  inferRouterOutputs<AppRouter>["userInfo"]["getSkills"];
