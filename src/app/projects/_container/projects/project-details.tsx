"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projectGetAllType } from "@/constant/type.trpc";
import { easeOut, useInView, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ExternalLink,
  Folder,
  Github,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { ProjectCarousel } from "./project-carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  project: projectGetAllType[1];
}
export const ProjectDetails = ({ project }: Props) => {
  const heroRef = useRef(null);
  const detailsRef = useRef(null);
  const challengesRef = useRef(null);
  const featuresRef = useRef(null);

  const heroInView = useInView(heroRef, { once: false, margin: "-100px" });
  const detailsInView = useInView(detailsRef, {
    once: false,
    margin: "-100px",
  });
  const challengesInView = useInView(challengesRef, {
    once: false,
    margin: "-100px",
  });
  const featuresInView = useInView(featuresRef, {
    once: false,
    margin: "-100px",
  });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12" ref={heroRef}>
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          {/* Back Button */}
          <motion.div variants={itemVariants} className="mb-8">
            <Button
              variant="outline"
              className="glass-effect border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              asChild
            >
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </motion.div>

          {/* Project Header */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="mb-4 glass-effect border-blue-500/30 text-blue-400"
              >
                Full Stack
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">{project.title}</span>
              </h1>
              <p className="text-xl text-blue-400 mb-6">{project.subTitle}</p>
              <p className="text-lg text-gray-300 mb-8 line-clamp-4">
                {project.description}
              </p>

              {/* Project Meta */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">3 Months</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Lead Developer</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Folder className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Full-Stack</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white blue-glow"
                    asChild
                  >
                    <Link href={project.liveDemo} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
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
                    asChild
                  >
                    <Link href={project.githubLink} target="_blank">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Project Carousel */}
            <motion.div variants={itemVariants}>
              <ProjectCarousel images={project.gallery} title={project.title} />
            </motion.div>
          </div>
        </motion.div>
      </section>
      <section className="container mx-auto px-4 py-16" ref={detailsRef}>
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={detailsInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Project <span className="text-gradient">Overview</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Description */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-blue-500/20 h-full">
                <CardHeader>
                  <CardTitle className="text-white">
                    About This Project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Technologies */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-blue-500/20 h-full">
                <CardHeader>
                  <CardTitle className="text-white">
                    Technologies Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologyUsed.map((tech, index) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={
                          detailsInView
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0 }
                        }
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                      >
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                        >
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>
      <section className="container mx-auto px-4 py-16" ref={challengesRef}>
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={challengesInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Challenges & <span className="text-gradient">Solutions</span>
            </h2>
            <p className="text-xl text-gray-300">
              Key technical challenges and how I solved them
            </p>
          </motion.div>
          <div className="space-y-8">
            {project.challenge.map((challenge) => (
              <motion.div key={challenge.id} variants={itemVariants}>
                <Card className="glass-effect border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-blue-400">
                          {challenge.challenge}
                        </h3>
                        <p className="text-gray-300 mb-4">
                          {challenge.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-4 text-green-400">
                          Solution
                        </h4>
                        <p className="text-gray-300">{challenge.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      {/* Features */}
      <section className="container mx-auto px-4 py-16" ref={featuresRef}>
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Key <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-gray-300">
              What makes this project special
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-effect border-blue-500/20">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {project.keyFeature.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        featuresInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};
