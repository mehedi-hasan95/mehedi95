"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { LoadingButton } from "@/components/common/loading-button";
import { ImageUpload } from "@/utils/image-upload";
import { toast } from "sonner";
import { projectGetAllType } from "@/constant/type.trpc";
import { Plus, Trash, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

interface Props {
  getSlug: string;
}
export const CreateProject = ({ getSlug }: Props) => {
  const prevTitleRef = useRef("");
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.project.getProjectBySlug.queryOptions({ slug: getSlug })
  );
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.project.createProject.mutationOptions({
      onMutate: async (newProject) => {
        const queryKey = trpc.project.getAllProjects.queryKey();
        await queryClient.cancelQueries({
          queryKey: queryKey,
        });
        const previousProjects =
          queryClient.getQueryData<projectGetAllType>(queryKey);
        queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, ...newProject }
        );
        router.push("/dashboard");
        toast("Project Created Successfully");
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

  const update = useMutation(
    trpc.project.updateProject.mutationOptions({
      onMutate: async (newData) => {
        const myInfoKey = trpc.project.getAllProjects.queryKey();
        const singleInfoKey = trpc.project.getProjectBySlug.queryKey();

        // Cancel any in-flight queries for both
        await Promise.all([
          queryClient.cancelQueries({ queryKey: myInfoKey }),
          queryClient.cancelQueries({ queryKey: singleInfoKey }),
        ]);

        // Snapshot previous data
        const previousMyInfo =
          queryClient.getQueryData<projectGetAllType>(myInfoKey);
        const previousSingleInfo =
          queryClient.getQueryData<projectGetAllType[1]>(singleInfoKey);

        // Optimistically update both
        queryClient.setQueryData(
          myInfoKey,
          (old: projectGetAllType | undefined) =>
            old ? { ...old, ...newData } : old
        );
        queryClient.setQueryData(
          singleInfoKey,
          (old: projectGetAllType[1] | null | undefined) =>
            old ? { ...old, ...newData } : old
        );
        router.push(`/dashboard`);
        toast.success("Project update successfully");
        return { previousMyInfo, previousSingleInfo };
      },

      onError: (error, _newData, context) => {
        // Rollback both queries if error
        if (context?.previousMyInfo) {
          queryClient.setQueryData(
            trpc.project.getAllProjects.queryKey(),
            context.previousMyInfo
          );
        }
        if (context?.previousSingleInfo) {
          queryClient.setQueryData(
            trpc.project.getProjectBySlug.queryKey(),
            context.previousSingleInfo
          );
        }
        toast.error(error.message);
      },
      onSettled: () => {
        // Invalidate both to re-fetch fresh data
        queryClient.invalidateQueries({
          queryKey: trpc.project.getAllProjects.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.project.getProjectBySlug.queryKey(),
        });
      },
    })
  );

  // delete project
  const deleteProject = useMutation(
    trpc.project.deleteProject.mutationOptions({
      onMutate: async (newProject) => {
        const queryKey = trpc.project.getAllProjects.queryKey();
        await queryClient.cancelQueries({
          queryKey: queryKey,
        });
        const previousProjects =
          queryClient.getQueryData<projectGetAllType>(queryKey);
        queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, ...newProject }
        );
        router.push("/dashboard");
        toast("Project delete Successfully");
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
      title: data?.title || "",
      description: data?.description || "",
      keyChallenge: data?.keyChallenge || "",
      slug: data?.slug || "",
      liveDemo: data?.liveDemo || "",
      githubLink: data?.githubLink || "",
      isFeatured: data?.isFeatured || false,
      technologyUsed: data?.technologyUsed || [],
      featuredImage: data?.featuredImage || "",
      gallery: data?.gallery || [],
      keyFeature: data?.keyFeature || [],
      challenge: data?.challenge || [
        { challenge: "", description: "", challengeTitle: "" },
      ],
      developerRole: data?.developerRole || "",
      duration: data?.duration || undefined,
      projectType: data?.projectType || "",
      subTitle: data?.subTitle || undefined,
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

  const { fields, prepend, remove } = useFieldArray({
    // Changed append to prepend
    control: form.control,
    name: "challenge",
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createProjectSchema>) {
    if (data?.id) {
      update.mutate({ id: data?.id, createProjectSchema: values });
    } else {
      create.mutate(values);
    }
  }
  // Watch all challenge fields to determine if any are empty
  const allChallenges = form.watch("challenge");
  const hasEmptyChallengeFields = allChallenges.some(
    (challengeItem) => !challengeItem.challenge || !challengeItem.description
  );

  // 4. Add new challenge (prepends to the beginning)
  const addChallenge = () => {
    prepend({ challenge: "", description: "", challengeTitle: "" });
  };

  // 5. Remove challenge
  const removeChallenge = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };
  return (
    <div>
      {data?.id && (
        <>
          <div className="flex justify-between items-center py-5">
            <h2 className="text-2xl text-blue-400">Update or delete project</h2>
            <Button
              variant={"destructive"}
              onClick={() => deleteProject.mutate({ id: data.id })}
            >
              <Trash />
              Delete
            </Button>
          </div>
          <Separator className="mb-5" />
        </>
      )}
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
            name="subTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Project subtitle" {...field} />
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
                <FormLabel>Project Description</FormLabel>
                <FormControl>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Duration</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Full-Stack" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="developerRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Developer Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Lead Designer" {...field} />
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
                  <FormLabel>Featured?</FormLabel>
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
          </div>

          <FormField
            control={form.control}
            name="technologyUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project tech</FormLabel>
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
                  <div className="space-y-2">
                    {field.value && (
                      <Image
                        src={field.value}
                        alt="Uploaded Image"
                        width={400}
                        height={400}
                        className="rounded-md h-20 w-32 aspect-video object-cover"
                      />
                    )}
                    <ImageUpload
                      endPoint="featurImage"
                      onChange={(url) => {
                        field.onChange(url);
                      }}
                    />
                  </div>
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
                  <div className="space-y-4">
                    {field.value?.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {field.value.map((url: string, index: number) => (
                          <div key={index} className="relative group">
                            <Image
                              src={url}
                              alt={`Gallery image ${index + 1}`}
                              width={200}
                              height={150}
                              className="rounded-md object-cover h-20 w-32"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = field.value.filter(
                                  (_, i) => i !== index
                                );
                                field.onChange(updated);
                              }}
                              className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <ImageUpload
                      endPoint="productImage"
                      onChange={(urls) => {
                        const currentImages = field.value || [];
                        if (Array.isArray(urls)) {
                          const merged = [...currentImages, ...urls];
                          field.onChange(merged);
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keyFeature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Features</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="e.g. add stripe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Challenges Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Project Challenges</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChallenge}
                className="flex items-center gap-2 bg-transparent"
                disabled={hasEmptyChallengeFields} // Disable if any challenge field is empty
              >
                <Plus className="h-4 w-4" />
                Add Challenge
              </Button>
            </div>

            {/* Dynamic Challenge Fields */}
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Challenge {index + 1}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChallenge(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Challenge Title */}
                  <FormField
                    control={form.control}
                    name={`challenge.${index}.challengeTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. User Authentication"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`challenge.${index}.challenge`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Face</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. What was the problem"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Challenge Description */}
                  <FormField
                    control={form.control}
                    name={`challenge.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Solve</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the challenge in detail..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          {create.isPending ? (
            <LoadingButton variant={"outline"} />
          ) : (
            <Button type="submit" variant={"outline"}>
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
