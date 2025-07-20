import { getQueryClient, trpc } from "@/trpc/server";
import { CreateInfoForm } from "../../_components/info/create-info-form";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
const UserInfoCreate = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.userInfo.singleMyInfo.queryOptions({ id })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <CreateInfoForm id={id} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default UserInfoCreate;
