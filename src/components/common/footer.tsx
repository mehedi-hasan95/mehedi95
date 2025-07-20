"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SocialLinks } from "./social-links";
export const Footer = () => {
  const date = new Date().getFullYear();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.userInfo.myInfo.queryOptions());
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {date} Mehedi Hasan. All rights reserved.
            </p>
          </div>
          {data && <SocialLinks data={data[0]} />}
        </div>
      </div>
    </footer>
  );
};
