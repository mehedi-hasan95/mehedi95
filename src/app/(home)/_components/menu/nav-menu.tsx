"use client";

import { useEffect, useState } from "react";
import { AuthMenu } from "./auth-menu";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/utils/useAuth";
import { AfterAuthButton } from "@/components/common/after-auth-button";

export const HomeNavMenu = () => {
  const { data } = useAuthSession();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return (
    <nav
      className={cn(
        "fixed top-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out container mx-auto px-6 lg:px-12",
        isScrollingDown ? "w-[90%]" : "w-full"
      )}
    >
      <div
        className={cn(
          "border rounded-2xl backdrop-blur supports-[backdrop-filter]:bg-slate-500/10 "
        )}
      >
        <div className="px-6">
          <div className="flex items-center justify-between h-20">
            <Logo />
            {data?.session.token ? (
              <AfterAuthButton image={data?.user?.image as string} />
            ) : (
              <AuthMenu />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
