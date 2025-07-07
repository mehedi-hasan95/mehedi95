import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return session;
};
