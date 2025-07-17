import { getQueryClient, trpc } from "@/trpc/server";
import { About } from "./_components/home/about";
import { FeaturedProjects } from "./_components/home/featured-projects";
import { Hero } from "./_components/home/hero";
import { Skills } from "./_components/home/skills";

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.project.getAllProjects.queryOptions({ isFeatured: true, limit: 3 })
  );
  return (
    <div className="space-y-20">
      <Hero />
      <About />
      <FeaturedProjects />
      <Skills />
    </div>
  );
}
