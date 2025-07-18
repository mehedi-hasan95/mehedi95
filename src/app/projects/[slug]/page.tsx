import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { SingleProject } from "../_container/projects/signle-project";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}
const SinglePage = async ({ params }: Props) => {
  const { slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.project.getProjectBySlug.queryOptions({ slug })
  );
  void queryClient.prefetchQuery(trpc.project.getAllProjects.queryOptions({}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <SingleProject slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default SinglePage;

// Generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await caller.project.getProjectBySlug({ slug });

  return {
    title: `${data?.title} - Mehedi Hasan Portfolio`,
  };
}

// Generate staticParams
export async function generateStaticParams() {
  const data = await caller.project.getAllProjects({});
  return data.map((item) => ({
    slug: item.slug,
  }));
}
