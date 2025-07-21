import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getQueryClient, trpc } from "@/trpc/server";
import Link from "next/link";
import { SkillCard } from "./_components/skill-card";

const SkillsPage = async () => {
  const queryClient = await getQueryClient();
  void queryClient.prefetchQuery(trpc.userInfo.getSkills.queryOptions());
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-400">Your Skills</h2>
        <Button variant={"link"} className="bg-blue-600" asChild>
          <Link href={"/dashboard/skills/new"}>Add Skills</Link>
        </Button>
      </div>
      <Separator />
      <SkillCard />
    </div>
  );
};

export default SkillsPage;
