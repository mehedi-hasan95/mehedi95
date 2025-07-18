"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { ProjectDetails } from "./project-details";

interface Props {
  slug: string;
}

export const SingleProject = ({ slug }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.project.getProjectBySlug.queryOptions({ slug })
  );
  if (!data) {
    return notFound();
  }
  return <ProjectDetails project={data} />;
};
