"use client";
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { contactSchema } from "@/schemas/auth.schema";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageGetAllType } from "@/constant/type.trpc";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/loading-button";

export const ContactForm = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
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
        duration: 0.5,
      },
    },
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      subject: undefined,
    },
  });

  // create message
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.userInfo.message.mutationOptions({
      onMutate: async (newProject) => {
        await queryClient.cancelQueries({
          queryKey: trpc.userInfo.allMessage.queryKey(),
        });
        const previousProjects = queryClient.getQueryData(["message"]);
        queryClient.setQueryData(["message"], (old: messageGetAllType) => [
          ...(old || []),
          newProject,
        ]);
        form.reset();
        toast("Message sent successfully");
        return { previousProjects };
      },
      onError: (error) => {
        toast(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.allMessage.queryKey(),
        });
      },
    })
  );

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof contactSchema>) {
    create.mutate(values);
  }
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <Card className="glass-effect border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white text-2xl">
            Send me a message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Mehedi Hasan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. you@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Topics</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me what you ask"
                          className="resize-none min-h-28"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              {create.isPending ? (
                <LoadingButton className="w-full bg-blue-600 hover:bg-blue-700 text-white" />
              ) : (
                <Button
                  type="submit"
                  className="flex items-center w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              )}
            </motion.form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
