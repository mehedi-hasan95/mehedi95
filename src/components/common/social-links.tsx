"use client";

import { userInfoGetAllType } from "@/constant/type.trpc";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { TbBrandFiverr, TbBrandUpwork } from "react-icons/tb";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
interface Props {
  data: userInfoGetAllType[1];
  className?: string;
}
export const SocialLinks = ({ data, className }: Props) => {
  const socialLinks = [
    {
      icon: FaGithub,
      label: "GitHub",
      href: data?.github,
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: data?.linkedin,
    },
    {
      icon: FaXTwitter,
      label: "X",
      href: data?.twitter,
    },
    {
      icon: TbBrandFiverr,
      label: "Fiverr",
      href: data?.fiverr,
    },
    {
      icon: TbBrandUpwork,
      label: "Upwork",
      href: data?.upwork,
    },
  ];
  return (
    <div className="flex space-x-2">
      {socialLinks.map((social, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          {social.href && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "glass-effect border-blue-500/30 text-blue-400 hover:bg-blue-500/20 bg-transparent",
                className
              )}
              asChild
            >
              <Link href={social?.href || ""} target="_blank">
                <social.icon className="h-4 w-4" />
                <span className="sr-only">{social.label}</span>
              </Link>
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  );
};
