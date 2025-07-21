"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useMemo } from "react";

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
import { skillsSchema } from "@/schemas/auth.schema";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagsInput } from "@/components/ui/tags-input";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { LoadingButton } from "@/components/common/loading-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

  const create = useMutation(
    trpc.userInfo.createSkills.mutationOptions({
      onSuccess: () => {
        router.push("/dashboard/skills");
      },
      onError: (error) => {
        toast(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.getSkills.queryKey(),
        });
      },
    })
  );
  const update = useMutation(
    trpc.userInfo.updateSkills.mutationOptions({
      onSuccess: () => {
        router.push("/dashboard/skills");
      },
      onError: (error) => {
        toast(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.getSkills.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.userInfo.getSkillItems.queryKey(),
        });
      },
    })
  );

  // 🧠 Memoize defaultValues from server data
  const defaultValues = useMemo(() => {
    return {
      skills: data?.SkillItems?.length
        ? data.SkillItems.map((item) => ({
            title: item.title,
            skill: item.skills,
          }))
        : [{ title: "", skill: [] }],
    };
  }, [data]);

  const form = useForm<z.infer<typeof skillsSchema>>({
    resolver: zodResolver(skillsSchema),
    defaultValues,
  });

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const onSubmit = (values: z.infer<typeof skillsSchema>) => {
    if (data?.id) {
      update.mutate({ id: data.id, skillsSchema: values });
    } else {
      create.mutate(values);
    }
  };

  const allSkills = form.watch("skills");
  const hasEmptySkillsFields = allSkills.some(
    (skillItem) => !skillItem.skill.length || !skillItem.title
  );

  const addSkill = () => {
    prepend({ title: "", skill: [] });
  };

  const removeSkill = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Skills</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSkill}
                className="flex items-center gap-2 bg-transparent"
                disabled={hasEmptySkillsFields}
              >
                <Plus className="h-4 w-4" />
                Add Skills
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Skill {index + 1}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Frontend Development"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skills.${index}.skill`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>All Skill</FormLabel>
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
                </CardContent>
              </Card>
            ))}
          </div>

          {create.isPending || update.isPending ? (
            <LoadingButton />
          ) : (
            <Button type="submit" disabled={hasEmptySkillsFields}>
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
