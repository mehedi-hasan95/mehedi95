import { authClient } from "@/lib/auth-client";

export const useAuthSession = () => {
  const { data, isPending, error, refetch } = authClient.useSession();
  return { data, isPending, error, refetch };
};
