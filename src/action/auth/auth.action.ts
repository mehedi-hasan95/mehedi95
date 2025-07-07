import { userRole } from "@/generated/prisma";
import { authClient } from "@/lib/auth-client";
import { db } from "@/lib/db";
import { registerSchema } from "@/schemas/auth.schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const authAction = createTRPCRouter({
  createUser: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      try {
        const { data, error } = await authClient.signUp.email({
          email: input.email,
          name: input.name,
          password: input.password,
          username: input.username,
        });

        return { data, error };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
          cause: error,
        });
      }
    }),
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
});
