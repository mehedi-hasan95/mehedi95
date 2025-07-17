import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectGetAllType } from "@/constant/type.trpc";
import { useInsideLink } from "@/hooks/use-slug";
import { cn } from "@/lib/utils";
import { easeOut, motion, useInView } from "framer-motion";
import { ExternalLink, Github, User2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};
interface Props {
  project: projectGetAllType[1];
  showChallenge?: boolean;
  isFeatured?: boolean;
}
export const ProjectCard = ({
  project,
  showChallenge = false,
  isFeatured = false,
}: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  return (
    <motion.div variants={cardVariants} ref={ref}>
      <Card className="glass-effect border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group overflow-hidden pt-0">
        <motion.div
          className="relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={project.featuredImage || "/placeholder.svg"}
            alt={project.title}
            width={500}
            height={300}
            className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
          {/* Blue glow overlay */}
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
        <CardHeader>
          <CardTitle className="text-xl text-white">{project.title}</CardTitle>
          <p className="text-gray-300 line-clamp-3">{project.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologyUsed.map((tech, techIndex) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
                }
                transition={{ delay: 0.5 + techIndex * 0.1 }}
              >
                <div className="space-y-4">
                  {showChallenge && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        Key Challenges:
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.keyChallenge}
                      </p>
                    </div>
                  )}
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30"
                  >
                    {tech}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
          {isFeatured && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-2"
            >
              <div
                className={cn(
                  "glass-effect border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent flex items-center max-w-max px-5 py-2",
                  project.isFeatured === true &&
                    "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none"
                )}
              >
                <User2 className="mr-2 h-4 w-4" />
                {project.isFeatured === true
                  ? "Featured Project"
                  : "Not Featured"}
              </div>
            </motion.div>
          )}
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                onClick={useInsideLink(project.liveDemo)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                className="glass-effect border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent flex items-center"
                onClick={useInsideLink(project.githubLink)}
              >
                <Github className="mr-2 h-4 w-4" />
                Code
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
