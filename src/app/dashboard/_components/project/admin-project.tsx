"use client";

import { ProjectCard } from "@/app/(home)/_components/home/project-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
export const AdminProject = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.project.getAllProjects.queryOptions({})
  );
  return (
    <motion.div
      ref={ref}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {data.map((item) => (
        <Link href={`/dashboard/${item.slug}`} key={item.id}>
          <ProjectCard project={item} isFeatured={true} showChallenge={true} />
        </Link>
      ))}
    </motion.div>
  );
};
