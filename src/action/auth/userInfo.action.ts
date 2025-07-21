import { db } from "@/lib/db";
import {
  aboutMeSchema,
  contactSchema,
  skillsSchema,
} from "@/schemas/auth.schema";
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
  createSkills: adminProcedure
    .input(skillsSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      try {
        if (ctx.role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You're not an Admin",
          });
        }
        const data = await db.allSkill.create({
          data: {
            SkillItems: {
              create: input.skills.map((skill) => ({
                title: skill.title,
                skills: skill.skill,
              })),
            },
          },
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
  getSkills: baseProcedure.query(async () => {
    try {
      const data = await db.allSkill.findMany({
        include: { SkillItems: true },
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
  getSingeSkill: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        if (ctx.role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You're not an Admin",
          });
        }
        const data = await db.allSkill.findUnique({
          where: { id: input.id },
          select: { SkillItems: true, id: true },
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
  updateSkills: adminProcedure
    .input(z.object({ id: z.string(), skillsSchema }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You're not an Admin",
        });
      }
      try {
        const { id, skillsSchema } = input;
        const existing = await db.allSkill.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "AllSkill entry not found",
          });
        }

        // Delete all existing SkillItems
        await db.skillItems.deleteMany({
          where: { skilId: id },
        });

        const updated = await db.allSkill.update({
          where: { id: id },
          data: {
            SkillItems: {
              create: skillsSchema.skills.map((item) => ({
                title: item.title,
                skills: item.skill,
              })),
            },
          },
          include: {
            SkillItems: true,
          },
        });

        return updated;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    }),
  getSkillItems: baseProcedure.query(async () => {
    try {
      const data = await db.skillItems.findMany();
      return data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
        cause: error,
      });
    }
  }),
});
