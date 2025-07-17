"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProjectCard } from "./project-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export function FeaturedProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.project.getAllProjects.queryOptions({ isFeatured: true, limit: 3 })
  );
  return (
    <section className="container mx-auto px-4 py-20 relative" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-blue-800/10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-4 glass-effect border-blue-500/30 text-blue-400"
          >
            Featured Work
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Recent <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my fullstack
            development skills
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {data.map((item) => (
            <Link href={`/projects/${item.slug}`} key={item.id}>
              <ProjectCard project={item} />
            </Link>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className="glass-effect border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              <Link href="/projects">View All Projects</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
