"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { easeOut, motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SocialLinks } from "@/components/common/social-links";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.userInfo.myInfo.queryOptions());
  return (
    <section
      className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden"
      ref={ref}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-800/20 blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-float" />

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="mb-4 glass-effect border-blue-500/30 text-blue-400"
              >
                Available for new opportunities
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              variants={itemVariants}
            >
              <span className="text-gradient">Fullstack</span>
              <br />
              <span className="text-white">Developer</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              I build modern web applications with{" "}
              <span className="text-blue-400 font-semibold">Next.js</span>,{" "}
              <span className="text-blue-400 font-semibold">React</span>, and
              cutting-edge technologies. Passionate about performance,
              accessibility, and exceptional user experiences.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white blue-glow"
                >
                  <Link href="/projects" className="flex items-center">
                    View My Work <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-effect border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                >
                  <Link
                    href={data[0]?.resume || ""}
                    target="_blank"
                    className="flex items-center"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Resume
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <SocialLinks data={data[0]} />
          </div>

          {/* Right Column - Profile Image */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Glowing Ring Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-xl opacity-30 animate-pulse-slow" />
              <div className="absolute inset-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur-lg opacity-40" />

              {/* Profile Image Container */}
              <motion.div
                className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-blue-500/30 glass-effect"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Replace this with your actual image */}
                <Image
                  src={
                    data[0]?.image || "/placeholder.svg?height=400&width=400"
                  }
                  alt="John Doe - Fullstack Developer"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />

                {/* Overlay gradient for better text readability if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full blur-sm opacity-60"
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-6 h-6 bg-blue-400 rounded-full blur-sm opacity-40"
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
