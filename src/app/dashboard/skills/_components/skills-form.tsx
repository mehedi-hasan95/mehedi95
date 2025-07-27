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
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { skillsSchema } from "@/schemas/auth.schema";
import { TagsInput } from "@/components/ui/tags-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/common/loading-button";
import { userSkillsType } from "@/constant/type.trpc";

interface Props {
  id: string;
}
export const SkillsForm = ({ id }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(
    trpc.userInfo.getSingeSkill.queryOptions({ id })
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof skillsSchema>>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      title: data?.title || "",
      skill: data?.skills || [],
    },
  });

  // Create Skills
  const create = useMutation(
    trpc.userInfo.createSkills.mutationOptions({
      onMutate: async (newSkills) => {
        const queryKey = trpc.userInfo.getSkills.queryKey();
        await queryClient.cancelQueries({
          queryKey: queryKey,
        });
        const previousSkills = queryClient.getQueryData(queryKey);
        queryClient.setQueryData(
          queryKey,
          (old) => old && { ...old, ...newSkills }
        );
        router.push("/dashboard/skills");
        toast("Skills sent successfully");
        return { previousSkills };
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.getSkills.queryKey(),
        });
      },
    })
  );

  // update skills
  const update = useMutation(
    trpc.userInfo.updateSkills.mutationOptions({
      onMutate: async (newData) => {
        const myInfoKey = trpc.userInfo.getSkills.queryKey();
        const singleInfoKey = trpc.userInfo.getSingeSkill.queryKey();

        // Cancel any in-flight queries for both
        await Promise.all([
          queryClient.cancelQueries({ queryKey: myInfoKey }),
          queryClient.cancelQueries({ queryKey: singleInfoKey }),
        ]);

        // Snapshot previous data
        const previousSkills =
          queryClient.getQueryData<userSkillsType>(myInfoKey);
        const previousSingleSkill =
          queryClient.getQueryData<userSkillsType[1]>(singleInfoKey);

        // Optimistically update both
        queryClient.setQueryData(myInfoKey, (old: userSkillsType | undefined) =>
          old ? { ...old, ...newData } : old
        );
        queryClient.setQueryData(
          singleInfoKey,
          (old: userSkillsType[1] | null | undefined) =>
            old ? { ...old, ...newData } : old
        );
        router.push(`/dashboard/skills`);
        toast.success("Skills update successfully");
        return { previousSkills, previousSingleSkill };
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.getSkills.queryKey(),
        });
      },
    })
  );
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof skillsSchema>) {
    if (data?.id) {
      update.mutate({ id: data.id, skillsSchema: values });
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Name</FormLabel>
                <FormControl>
                  <Input placeholder="Frontend" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Features</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="e.g. add Next.Js"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {create.isPending || update.isPending ? (
            <LoadingButton
              variant={"outline"}
              className="bg-blue-600 hover:bg-blue-700"
            />
          ) : (
            <Button
              type="submit"
              variant={"outline"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
