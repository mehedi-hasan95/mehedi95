import { db } from "@/lib/db";
import { aboutMeSchema, contactSchema } from "@/schemas/auth.schema";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const userInfoAction = createTRPCRouter({
  message: baseProcedure.input(contactSchema).mutation(async ({ input }) => {
    try {
      const data = await db.contact.create({
        data: { ...input },
      });
      return data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        cause: error,
      });
    }
  }),
  allMessage: adminProcedure.query(async ({ ctx }) => {
    if (ctx.role !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not an Admin",
      });
    }
    const user = await db.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return user;
  }),
  aboutMe: adminProcedure
    .input(aboutMeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not an Admin",
          });
        }
        const data = await db.userInfo.create({ data: { ...input } });
        return { data, message: "User Info created successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
  myInfo: baseProcedure.query(async () => {
    const data = await db.userInfo.findMany();
    return data;
  }),
  singleMyInfo: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not an Admin",
        });
      }
      const user = await db.userInfo.findUnique({ where: { id: input.id } });
      if (!user) {
        return null;
      }
      return user;
    }),
  updateMyInfo: adminProcedure
    .input(z.object({ id: z.string(), aboutMeSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not an Admin",
          });
        }
        const {
          bio,
          email,
          heading,
          location,
          phone,
          fiverr,
          github,
          image,
          linkedin,
          twitter,
          upwork,
          resume,
        } = input.aboutMeSchema;
        const data = await db.userInfo.update({
          where: { id: input.id },
          data: {
            bio,
            email,
            heading,
            location,
            phone,
            fiverr,
            github,
            image,
            linkedin,
            twitter,
            upwork,
            resume,
          },
        });
        return { data, message: "User Info update successfully" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
});
