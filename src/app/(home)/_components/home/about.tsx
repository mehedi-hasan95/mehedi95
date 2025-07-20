"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Zap, Users, Lightbulb } from "lucide-react";
import { easeOut, motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const highlights = [
  {
    icon: Code,
    title: "Clean Code",
    description:
      "Writing maintainable, scalable code with modern best practices",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Optimizing applications for speed and exceptional user experience",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working effectively with teams and stakeholders",
    color: "from-blue-400 to-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Staying current with latest technologies and methodologies",
    color: "from-blue-700 to-blue-800",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section className="container mx-auto px-4 py-20 relative" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
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
            About Me
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Passionate About Building{" "}
            <span className="text-gradient">Great Software</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-gray-300 mb-6">
              I&apos;m a fullstack developer with{" "}
              <span className="text-blue-400 font-semibold">2+ years</span> of
              experience building modern web applications. I specialize in{" "}
              <span className="text-blue-400 font-semibold">Next.js</span>,
              <span className="text-blue-400 font-semibold"> React</span>, and
              <span className="text-blue-400 font-semibold"> Node.js</span>,
              with a strong focus on creating performant, accessible, and
              user-friendly applications.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              As a recent graduate, I bring a fresh perspective and eagerness to
              learn and grow in the ever-evolving tech space. My expertise spans
              both front-end and back-end development, enabling me to create
              seamless and efficient solutions that deliver a smooth user
              experience
            </p>
            <p className="text-lg text-gray-300">
              With a strong foundation in software engineering principles, I’m
              committed to contributing to innovative projects and making a
              meaningful impact through clean, maintainable code.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {highlights.map((item, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="glass-effect border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                  <CardContent className="px-6">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`p-3 bg-gradient-to-r ${item.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <item.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold mb-2 text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
