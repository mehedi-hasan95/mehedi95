import { getQueryClient, trpc } from "@/trpc/server";
import { Hero } from "./_components/home/hero";
import { About } from "./_components/home/about";
import { FeaturedProjects } from "./_components/home/featured-projects";
import { Skills } from "./_components/home/skills";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.project.getAllProjects.queryOptions({ isFeatured: true, limit: 3 })
  );
  void queryClient.prefetchQuery(trpc.userInfo.myInfo.queryOptions());
  void queryClient.prefetchQuery(trpc.userInfo.getSkills.queryOptions());
  return (
    <div className="space-y-20">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <Hero />
        </Suspense>
      </HydrationBoundary>
      <About />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <FeaturedProjects />
        </Suspense>
      </HydrationBoundary>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <Skills />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
