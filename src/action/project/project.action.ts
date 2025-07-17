import { db } from "@/lib/db";
import { createProjectSchema } from "@/schemas/auth.schema";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const projectAction = createTRPCRouter({
  createProject: adminProcedure
    .input(createProjectSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not admin.",
        });
      }
      const {
        description,
        githubLink,
        isFeatured,
        liveDemo,
        slug,
        technologyUsed,
        title,
        keyChallenge,
        featuredImage,
        gallery,
      } = input;
      try {
        const data = await db.project.create({
          data: {
            description,
            githubLink,
            isFeatured,
            liveDemo,
            slug,
            technologyUsed,
            title,
            keyChallenge,
            featuredImage,
            gallery,
          },
        });
        return data;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
  getAllProjects: baseProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        isFeatured: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const projects = await db.project.findMany({
          where:
            input.isFeatured !== undefined
              ? { isFeatured: input.isFeatured }
              : undefined,
          orderBy: {
            createdAt: "desc",
          },
          take: input.limit,
        });
        return projects;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
  getProjectBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const project = await db.project.findUnique({
          where: { slug: input.slug },
        });
        if (!project) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }
        return project;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    }),
});
