import { Button } from "@/components/ui/button";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";
import { MyDetails } from "../_components/info/my-details";

const UserInfo = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.userInfo.myInfo.queryOptions());
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-gradient text-3xl font-semibold">Your Info</h2>

        <Button
          variant={"link"}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
          asChild
        >
          <Link href={"/dashboard/info/create"}>Create User</Link>
        </Button>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <MyDetails />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default UserInfo;
