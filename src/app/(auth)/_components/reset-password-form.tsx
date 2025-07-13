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

const formSchema = z.object({
  email: z.string({ message: "Email is required" }),
});
import { useState } from "react";
import { AuthWrapper } from "./auth-wrapper";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/loading-button";
import { ResetPasswordOTP } from "./reset-password-otp";

export const ResetPasswordForm = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [getEmail, setGetEmail] = useState("");
  // verification otp sent form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const wathcEmail = form.watch("email");
  // Sent the verification otp.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "forget-password",
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onError: (e) => {
          toast(e.error.message);
          setLoading(false);
        },
        onSuccess: () => {
          setStep("otp");
          setGetEmail(values.email);
          toast("Reset OTP sent to your email");
          setLoading(false);
        },
      },
    });
  }
  return (
    <AuthWrapper
      headerTitle="Reset Password"
      headerDescription={`Enter your ${step === "email" ? "email" : "otp"}`}
      backTitle="Back to "
      backLabel="Login"
      backHref="/sign-in"
      showSocial={false}
    >
      {step === "email" ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              <LoadingButton />
            ) : (
              <Button
                type="submit"
                className="bg-blue-800 text-white hover:bg-blue-900"
                disabled={!wathcEmail}
              >
                Send OTP
              </Button>
            )}
          </form>
        </Form>
      ) : (
        <ResetPasswordOTP email={getEmail} />
      )}
    </AuthWrapper>
  );
};
