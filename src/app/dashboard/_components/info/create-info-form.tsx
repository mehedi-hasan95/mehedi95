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

import { aboutMeSchema } from "@/schemas/auth.schema";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/loading-button";
import { ImageUpload } from "@/utils/image-upload";
import { userInfoGetAllType } from "@/constant/type.trpc";
import Image from "next/image";

interface Props {
  id: string;
}
export const CreateInfoForm = ({ id }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.userInfo.singleMyInfo.queryOptions({ id })
  );
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof aboutMeSchema>>({
    resolver: zodResolver(aboutMeSchema),
    defaultValues: {
      heading: data?.heading || "",
      bio: data?.bio || "",
      email: data?.email || "",
      phone: data?.phone || "",
      location: data?.location || "",
      fiverr: data?.fiverr || undefined,
      github: data?.github || undefined,
      image: data?.image || undefined,
      linkedin: data?.linkedin || undefined,
      twitter: data?.twitter || undefined,
      upwork: data?.upwork || undefined,
      resume: data?.resume || "",
    },
  });

  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.userInfo.aboutMe.mutationOptions({
      onMutate: async (newProject) => {
        const queryKey = trpc.userInfo.myInfo.queryKey();
        await queryClient.cancelQueries({
          queryKey: queryKey,
        });
        const previousProjects = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, ...newProject }
        );
        router.push("/dashboard/info");
        toast("User create successfully");
        return { previousProjects };
      },
      onError: (error) => {
        toast(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.myInfo.queryKey(),
        });
      },
    })
  );

  const update = useMutation(
    trpc.userInfo.updateMyInfo.mutationOptions({
      onMutate: async (newData) => {
        const myInfoKey = trpc.userInfo.myInfo.queryKey();
        const singleInfoKey = trpc.userInfo.singleMyInfo.queryKey();

        // Cancel any in-flight queries for both
        await Promise.all([
          queryClient.cancelQueries({ queryKey: myInfoKey }),
          queryClient.cancelQueries({ queryKey: singleInfoKey }),
        ]);

        // Snapshot previous data
        const previousMyInfo =
          queryClient.getQueryData<userInfoGetAllType>(myInfoKey);
        const previousSingleInfo =
          queryClient.getQueryData<userInfoGetAllType[1]>(singleInfoKey);

        // Optimistically update both
        queryClient.setQueryData(
          myInfoKey,
          (old: userInfoGetAllType | undefined) =>
            old ? { ...old, ...newData } : old
        );
        queryClient.setQueryData(
          singleInfoKey,
          (old: userInfoGetAllType[1] | null | undefined) =>
            old ? { ...old, ...newData } : old
        );
        router.push(`/dashboard/info`);
        toast.success("User update successfully");
        return { previousMyInfo, previousSingleInfo };
      },

      onError: (error, _newData, context) => {
        // Rollback both queries if error
        if (context?.previousMyInfo) {
          queryClient.setQueryData(
            trpc.userInfo.myInfo.queryKey(),
            context.previousMyInfo
          );
        }
        if (context?.previousSingleInfo) {
          queryClient.setQueryData(
            trpc.userInfo.singleMyInfo.queryKey(),
            context.previousSingleInfo
          );
        }
        toast.error(error.message);
      },
      onSettled: () => {
        // Invalidate both to re-fetch fresh data
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.myInfo.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.singleMyInfo.queryKey(),
        });
      },
    })
  );

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof aboutMeSchema>) {
    if (data?.id) {
      update.mutate({ id: data.id, aboutMeSchema: values });
    } else {
      create.mutate(values);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading</FormLabel>
                <FormControl>
                  <Input placeholder="Let's work together" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write about you" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="me@me.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+0123456789" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="jessore" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume</FormLabel>
                <FormControl>
                  <Input placeholder="google drive" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fiverr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fiverr</FormLabel>
                <FormControl>
                  <Input placeholder="fiverr.com" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github</FormLabel>
                <FormControl>
                  <Input placeholder="github.com" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Linkedin</FormLabel>
                <FormControl>
                  <Input placeholder="linkedin.com" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>twitter</FormLabel>
                <FormControl>
                  <Input placeholder="twitter.com" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="upwork"
            render={({ field }) => (
              <FormItem>
                <FormLabel>upwork</FormLabel>
                <FormControl>
                  <Input placeholder="upwork.com" type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Image</FormLabel>
                <FormControl>
                  <div className="space-y-3">
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
          {create.isPending ? (
            <LoadingButton className="bg-blue-600 text-white" />
          ) : (
            <Button type="submit" className="bg-blue-600 text-white">
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
