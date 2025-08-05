import { db } from "@/lib/db";
import { createProjectSchema } from "@/schemas/auth.schema";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
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
        developerRole,
        duration,
        projectType,
        subTitle,
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
            developerRole,
            duration,
            projectType,
            subTitle,

            challenge: {
              createMany: {
                data: [
                  ...challenge.map((item) => ({
                    challenge: item.challenge,
                    description: item.description,
                    challengeTitle: item.challengeTitle,
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
  deleteProject: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You're not an admin",
        });
      }
      const data = db.project.delete({ where: { id: input.id } });
      if (!data) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Project not found",
        });
      }
      return data;
    }),
  updateProject: adminProcedure
    .input(z.object({ id: z.string(), createProjectSchema }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You're not an admin",
        });
      }
      const data = await db.project.update({
        where: { id: input.id },
        data: {
          description: input.createProjectSchema.description,
          githubLink: input.createProjectSchema.githubLink,
          isFeatured: input.createProjectSchema.isFeatured,
          liveDemo: input.createProjectSchema.liveDemo,
          slug: input.createProjectSchema.slug,
          technologyUsed: input.createProjectSchema.technologyUsed,
          title: input.createProjectSchema.title,
          keyChallenge: input.createProjectSchema.keyChallenge,
          featuredImage: input.createProjectSchema.featuredImage,
          gallery: input.createProjectSchema.gallery,
          keyFeature: input.createProjectSchema.keyFeature,
          developerRole: input.createProjectSchema.developerRole,
          duration: input.createProjectSchema.duration,
          projectType: input.createProjectSchema.projectType,
          subTitle: input.createProjectSchema.subTitle,
          challenge: {
            deleteMany: {},
            createMany: {
              data: [
                ...input.createProjectSchema.challenge.map((item) => ({
                  challenge: item.challenge,
                  description: item.description,
                  challengeTitle: item.challengeTitle,
                })),
              ],
            },
          },
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath(`/projects/${data.slug}`);
      return data;
    }),
});
