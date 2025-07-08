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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { LoadingButton } from "@/components/common/loading-button";

const formSchema = z.object({
  email: z.string().email(),
});

interface Props {
  sendOtpEmail: (email: string) => Promise<void>;
  loading: boolean;
  buttonLabel?: string;
  theEmail?: string;
}
export const ResetEmailForm = ({
  sendOtpEmail,
  loading,
  buttonLabel = "Send verify code",
  theEmail,
}: Props) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: theEmail || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    sendOtpEmail(values.email);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    readOnly
                    placeholder="you@example.com"
                    type="email"
                    {...field}
                    className="pl-10 bg-black/30 border-sky-500/30 text-white placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400/40"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {loading ? (
          <LoadingButton className="w-full" />
        ) : (
          <Button type="submit" className="w-full" variant={"outline"}>
            {buttonLabel}
          </Button>
        )}
      </form>
    </Form>
  );
};
