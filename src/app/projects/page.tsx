import { Badge } from "@/components/ui/badge";
import { getQueryClient, trpc } from "@/trpc/server";
import { ProjectGrid } from "./_container/project-grid";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const Projects = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.project.getAllProjects.queryOptions({}));
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <Badge variant="outline" className="mb-4">
          My Work
        </Badge>
        <h1 className="text-4xl font-bold mb-4">Featured Projects</h1>
        <p className="text-xl text-muted-foreground">
          A collection of projects showcasing my fullstack development skills
        </p>
      </div>
      <div className="max-w-6xl mx-auto">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<p>Loading...</p>}>
            <ProjectGrid />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default Projects;
