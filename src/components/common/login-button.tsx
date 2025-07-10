"use client";

import { useRouter } from "next/navigation";
import { ModifyDialog } from "../modified/modify-dialog";
import { SignInForm } from "@/app/(auth)/_components/signin-form";
import { Button } from "../ui/button";
import { AuthSocial } from "@/app/(auth)/_components/auth-social";

interface Props {
  mode?: "modal" | "redirect";
  title?: string;
  className?: string;
}
export const LoginButton = ({
  mode = "redirect",
  title = "Sign In",
  className,
}: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/sign-in");
  };
  if (mode === "modal") {
    return (
      <ModifyDialog trigger={<Button className={className}>{title}</Button>}>
        <div className="space-y-5">
          <SignInForm />
          <AuthSocial />
        </div>
      </ModifyDialog>
    );
  }
  return (
    <Button onClick={handleClick} className={className}>
      {title}
    </Button>
  );
};
