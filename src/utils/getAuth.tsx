import { getSession, useSession } from "@/lib/auth-client";

export const useAuthSession = () => {
  const { data, isPending, error, refetch } = useSession();
  return { data, isPending, error, refetch };
};

export const getAuthSession = async () => {
  const { data, error } = await getSession();
  return { data, error };
};
