"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useAuthSession } from "@/utils/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Laptop, Smartphone, TabletSmartphone } from "lucide-react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";

interface Props {
  deviceInUse: string | null;
  id: string;
}

export const UserActivity = ({ deviceInUse, id }: Props) => {
  const { data } = useAuthSession();
  const { browser, device, os } = UAParser(deviceInUse!);
  const result = id === data?.session.token;
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const removeSession = useMutation(
    trpc.auth.removeSession.mutationOptions({
      onMutate: async (session) => {
        await queryClient.cancelQueries(
          trpc.auth.getUserSession.queryOptions()
        );
        const previousSession = queryClient.getQueryData(
          trpc.auth.getUserSession.queryKey()
        );
        queryClient.setQueryData(trpc.auth.getUserSession.queryKey(), (old) => {
          if (!old) return old;
          return {
            ...old,
            sessions: old.sessions.filter((s) => s.token !== session.token),
          };
        });
        toast("Session removed successfully");
        return previousSession;
      },
      onError: (e) => {
        toast(e.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    })
  );
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        {device.type === "mobile" ? (
          <Smartphone className="h-5 w-5" />
        ) : device.type === "tablet" ? (
          <TabletSmartphone className="size-5" />
        ) : (
          <Laptop className="size-5" />
        )}
        <div>
          <p className="font-medium">
            1 Session on{" "}
            <span className="capitalize">
              {device.type || "desktop"} ({os.name} {os.version})
            </span>
          </p>
          <p className="text-sm text-muted-foreground">{browser.name}</p>
        </div>
      </div>
      {result ? (
        <Badge variant="secondary" className="bg-blue-500 rounded-full">
          Current
        </Badge>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeSession.mutate({ token: id })}
        >
          Revoke
        </Button>
      )}
    </div>
  );
};
