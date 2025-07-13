import { userRole } from "@/generated/prisma";
import { db } from "@/lib/db";
import { baseProcedure, createTRPCRouter, privateProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const authAction = createTRPCRouter({
  updateRole: baseProcedure
    .input(z.object({ id: z.string(), role: z.nativeEnum(userRole) }))
    .mutation(async ({ input }) => {
      try {
        const user = await db.user.update({
          where: { id: input.id },
          data: { role: input.role },
        });
        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
          cause: error,
        });
      }
    }),
  getUserSession: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, sessions: true },
    });
    return user;
  }),
  removeSession: privateProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await db.session.delete({
          where: { token: input.token, userId: ctx.userId },
        });
        return user;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorize user",
          cause: error,
        });
      }
    }),
});
