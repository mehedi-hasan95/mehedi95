"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { m, AnimatePresence, spring } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

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
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.userInfo.getSkills.queryOptions());

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [activeTab, setActiveTab] = useState(data[0]?.title);

  if (!data.length) {
    return <h2>No Skills are add</h2>;
  }
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
              {data.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.title}
                  className="text-xs sm:text-sm"
                >
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              {data.map((skill) => (
                <TabsContent key={skill.id} value={skill.title}>
                  {activeTab === skill.title && (
                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>{skill.title} Technologies</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <m.div
                            className="flex flex-wrap gap-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {skill.skills.map((skill) => (
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
