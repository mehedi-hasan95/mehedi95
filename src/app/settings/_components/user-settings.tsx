"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UserActivity } from "./user-activity";

export const UserSettings = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.auth.getUserSession.queryOptions());

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">SMS Authentication</p>
              <p className="text-sm text-muted-foreground">
                Receive codes via SMS to your phone
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Authenticator App</p>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app to generate codes
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

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

          {/* <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5" />
              <div>
                <p className="font-medium">Chrome on MacBook</p>
                <p className="text-sm text-muted-foreground">
                  Last active: 1 hour ago
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Revoke
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};
