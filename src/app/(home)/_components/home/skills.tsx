"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { m, AnimatePresence, spring } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";

const skillCategories = {
  frontend: {
    title: "Frontend",
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Framer Motion",
      "React Query",
      "Zustand",
      "HTML5",
      "CSS3",
    ],
  },
  backend: {
    title: "Backend",
    skills: [
      "Node.js",
      "Express.js",
      "Next.js API Routes",
      "Prisma",
      "tRPC",
      "REST APIs",
      "GraphQL",
      "WebSockets",
      "Serverless Functions",
    ],
  },
  database: {
    title: "Database",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Supabase",
      "Firebase",
      "Redis",
      "Prisma ORM",
      "Mongoose",
      "SQL",
      "Database Design",
    ],
  },
  devops: {
    title: "DevOps & Tools",
    skills: [
      "Vercel",
      "Docker",
      "GitHub Actions",
      "AWS",
      "Git",
      "Jest",
      "Playwright",
      "ESLint",
      "Prettier",
      "Webpack",
    ],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: spring,
      stiffness: 500,
      damping: 25,
    },
  },
};

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("frontend");

  return (
    <section className="container mx-auto px-4 py-20" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <m.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4">
            Technical Skills
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Technologies I Work With
          </h2>
          <p className="text-xl text-muted-foreground">
            A comprehensive toolkit for building modern web applications
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(skillCategories).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="text-xs sm:text-sm"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              {Object.entries(skillCategories).map(([key, category]) => (
                <TabsContent key={key} value={key}>
                  {activeTab === key && (
                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>{category.title} Technologies</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <m.div
                            className="flex flex-wrap gap-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {category.skills.map((skill) => (
                              <m.div
                                key={skill}
                                variants={badgeVariants}
                                whileHover={{
                                  scale: 1.1,
                                  rotate: Math.random() * 10 - 5,
                                  transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 10,
                                  },
                                }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="text-sm py-1 px-3 cursor-pointer"
                                >
                                  {skill}
                                </Badge>
                              </m.div>
                            ))}
                          </m.div>
                        </CardContent>
                      </Card>
                    </m.div>
                  )}
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </m.div>
      </div>
    </section>
  );
}
