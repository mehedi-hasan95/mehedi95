"use client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  title?: string;
  className?: string;
}
export const SignOut = ({ className, title = "Sign Out" }: Props) => {
  const router = useRouter();
  const onSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };
  return (
    <span className={cn(className)} onClick={onSignout}>
      {title}
    </span>
  );
};
