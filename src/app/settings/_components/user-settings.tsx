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

export const UserSettings = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.auth.getUserSession.queryOptions());

  return (
    <div className="space-y-2">
      <TwoFaVerification />

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
