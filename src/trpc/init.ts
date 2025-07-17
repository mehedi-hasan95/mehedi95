import { getAuth } from "@/utils/getAuth";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;

const middleware = t.middleware;
const isAuth = middleware(async (opts) => {
  const session = await getAuth();
  if (!session?.session.token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }
  return opts.next({
    ctx: {
      userId: session.user.id,
    },
  });
});

const isAdmin = middleware(async (opts) => {
  const session = await getAuth();
  if (!session?.session.token && session?.user.role !== "admin") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not admin.",
    });
  }
  return opts.next({
    ctx: {
      userId: session.user.id,
      role: session.user.role,
    },
  });
});

export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const privateProcedure = baseProcedure.use(isAuth);
export const adminProcedure = baseProcedure.use(isAdmin);
