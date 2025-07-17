import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getQueryClient, trpc } from "@/trpc/server";
import Link from "next/link";
import { AdminProject } from "./_components/project/admin-project";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const DashboardPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.project.getAllProjects.queryOptions({}));
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="text-gradient text-3xl font-semibold">
          Your all project
        </h2>

        <Button
          variant={"link"}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
          asChild
        >
          <Link href={"/dashboard/create"}>Create New</Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <AdminProject />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default DashboardPage;
