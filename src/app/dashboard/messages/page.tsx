import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { AllMessage } from "./all-message";

const MessagePage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.userInfo.allMessage.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <AllMessage />
      </Suspense>
    </HydrationBoundary>
  );
};

export default MessagePage;
