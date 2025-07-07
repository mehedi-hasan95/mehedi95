"use client";

import { useRouter } from "next/navigation";
import { ModifyDialog } from "../modified/modify-dialog";
import { SignInForm } from "@/app/(auth)/_components/signin-form";
import { Button } from "../ui/button";

interface Props {
  mode: "modal" | "redirect";
  title?: string;
  className?: string;
}
export const LoginButton = ({ mode, title = "Sign In", className }: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/sign-in");
  };
  if (mode === "modal") {
    return (
      <ModifyDialog trigger={<Button className={className}>{title}</Button>}>
        <SignInForm />
      </ModifyDialog>
    );
  }
  return (
    <Button onClick={handleClick} className={className}>
      {title}
    </Button>
  );
};
