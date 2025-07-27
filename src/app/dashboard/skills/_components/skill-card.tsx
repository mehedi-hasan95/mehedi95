"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const SkillCard = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.userInfo.getSkills.queryOptions());
  if (!data.length) {
    return <h2>No Data</h2>;
  }
  return (
    <div className="grid grid-cols-3 gap-5">
      {data?.map((item) => (
        <Link href={`/dashboard/skills/${item.id}`} key={item.id}>
          <Card>
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
              <CardDescription>Your all skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <div className="flex gap-2 flex-wrap">
                  {item.skills.map((item, idx) => (
                    <Badge
                      key={idx}
                      className="glass-effect border-blue-500/30 text-white hover:bg-blue-500/10 bg-transparent flex items-center max-w-max px-5 py-2 font-semibold capitalize"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
