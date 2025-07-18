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
        challenge,
        keyFeature,
      } = input;
      const uniqueSlug = await db.project.findUnique({
        where: { slug },
      });
      if (uniqueSlug) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Project with this slug already exists.",
        });
      }
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
            keyFeature,
            challenge: {
              createMany: {
                data: [
                  ...challenge.map((item) => ({
                    challenge: item.challenge,
                    description: item.description,
                  })),
                ],
              },
            },
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
          include: { challenge: true },
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
      const project = await db.project.findUnique({
        where: { slug: input.slug },
        include: { challenge: true },
      });
      if (!project) {
        return null;
      }
      return project;
    }),
});
