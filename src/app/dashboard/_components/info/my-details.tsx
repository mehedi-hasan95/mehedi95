"use client";

import { SocialLinks } from "@/components/common/social-links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

export const MyDetails = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.userInfo.myInfo.queryOptions());

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-4 p-6">
        <Avatar className="h-24 w-24">
          <AvatarImage
            alt="User Avatar"
            src={data[0].image ? data[0].image : "/placeholder.svg"}
          />
          <AvatarFallback>MH</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <CardTitle className="text-2xl font-bold">
            <Link
              href={`/dashboard/info/${data[0].id}`}
              className="text-muted-foreground"
            >
              Mehedi Hasan
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">Heading</h3>

            {data[0].heading}
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">Bio</h3>
            <p className="text-muted-foreground">{data[0].bio}</p>
          </div>
          <Separator />
          <div className="grid gap-1">
            <h3 className="text-lg font-semibold">Social Links</h3>
            <SocialLinks data={data[0]} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
