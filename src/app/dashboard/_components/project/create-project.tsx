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
import { createProjectSchema } from "@/schemas/auth.schema";
import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/tags-input";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoadingButton } from "@/components/common/loading-button";
import { ImageUpload } from "@/utils/image-upload";
import { toast } from "sonner";
import { projectGetAllType } from "@/constant/type.trpc";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
export const CreateProject = () => {
  const prevTitleRef = useRef("");
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.project.createProject.mutationOptions({
      onMutate: async (newProject) => {
        await queryClient.cancelQueries({
          queryKey: trpc.project.getAllProjects.queryKey(),
        });
        const previousProjects = queryClient.getQueryData(["projects"]);
        queryClient.setQueryData(["projects"], (old: projectGetAllType) => [
          ...(old || []),
          newProject,
        ]);
        toast("Project Created Successfully");
        router.push("/dashboard");
        return { previousProjects };
      },
      onError: (error) => {
        toast(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.project.getAllProjects.queryKey(),
        });
      },
    })
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof createProjectSchema>>({
    mode: "onChange",
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      keyChallenge: "",
      slug: "",
      liveDemo: "",
      githubLink: "",
      isFeatured: false,
      technologyUsed: [],
      featuredImage: "",
      gallery: [],
    },
  });

  //   generate slug
  const title = form.watch("title");
  const slug = form.watch("slug");

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (slugify(prevTitleRef.current) === slug) {
      const newSlug = slugify(title);
      form.setValue("slug", newSlug);
      prevTitleRef.current = title;
    }
  }, [title, slug, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createProjectSchema>) {
    create.mutate(values);
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Ecommerce website" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ecommerce-website" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  {/* <Input placeholder="e.g. Ecommerce website" {...field} /> */}
                  <Textarea
                    placeholder="e.g. Tell us about this project"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keyChallenge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key challenge</FormLabel>
                <FormControl>
                  {/* <Input placeholder="e.g. Ecommerce website" {...field} /> */}
                  <Textarea
                    placeholder="e.g. Tell us about this project"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="liveDemo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. website address"
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. ecommerce-website"
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Slug</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="technologyUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Slug</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="e.g. enter your used tech"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featuredImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    endPoint="featurImage"
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gallery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Gallery</FormLabel>
                <FormControl>
                  <ImageUpload
                    endPoint="productImage"
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {create.isPending ? (
            <LoadingButton />
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </form>
      </Form>
    </div>
  );
};
