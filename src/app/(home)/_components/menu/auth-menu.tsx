import { LoginButton } from "@/components/common/login-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const AuthMenu = () => {
  return (
    <div className="flex gap-2 items-center">
      <LoginButton
        title="Sign In"
        mode="modal"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl"
      />
      <Link href={"/sign-up"}>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl">
          Register
        </Button>
      </Link>
    </div>
  );
};
