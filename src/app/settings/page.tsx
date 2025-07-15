import { getQueryClient, trpc } from "@/trpc/server";
import { UserSettings } from "./_components/user-settings";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const SettingsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.auth.getUserSession.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <UserSettings />
      </Suspense>
    </HydrationBoundary>
  );
};

export default SettingsPage;
