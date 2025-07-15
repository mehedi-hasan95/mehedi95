"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UserActivity } from "./user-activity";
import { TwoFaVerification } from "./two-fa-varification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const UserSettings = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.auth.getUserSession.queryOptions());

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 ring-2 ring-emerald-500">
              <AvatarImage src={data?.image} alt={data?.name} />
              <AvatarFallback className="bg-emerald-600 text-white text-xl">
                {data?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <CardTitle className="text-2xl text-white">
                {data?.name}
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                {data?.email}
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="border-amber-500 text-amber-400 capitalize"
                >
                  {data?.role}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      {data?.accounts[0].providerId === "credential" && <TwoFaVerification />}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active sessions across devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.sessions.map((item) => (
            <UserActivity
              key={item.id}
              deviceInUse={item.userAgent}
              id={item.token}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
