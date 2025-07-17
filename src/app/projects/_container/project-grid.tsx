"use client";

import { ProjectCard } from "@/app/(home)/_components/home/project-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

export const ProjectGrid = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.project.getAllProjects.queryOptions({})
  );
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((item) => (
        <Link href={`/projects/${item.slug}`} key={item.id}>
          <ProjectCard project={item} showChallenge />
        </Link>
      ))}
    </div>
  );
};
