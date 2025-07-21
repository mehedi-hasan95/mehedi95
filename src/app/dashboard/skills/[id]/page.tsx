import { getQueryClient, trpc } from "@/trpc/server";
import { SkillsForm } from "../_components/skills-form";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
const SkillsIdPage = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.userInfo.getSingeSkill.queryOptions({ id })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <SkillsForm id={id} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default SkillsIdPage;
