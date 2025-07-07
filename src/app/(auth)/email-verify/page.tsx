"use client";

import { authClient } from "@/lib/auth-client";
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
import { toast } from "sonner";
import { AuthWrapper } from "../_components/auth-wrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { useState } from "react";
import { VerifyOtp } from "../_components/verify-otp";
import { LoadingButton } from "@/components/common/loading-button";

const formSchema = z.object({
  email: z.string().email(),
});
const EmailVerify = () => {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOTP] = useState<string>("");
  const [oteEmail, setOtpEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const getEmail = searchParams.get("email");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: getEmail || undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "email-verification",
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onError: (e) => {
          toast(e.error.message);
          setLoading(false);
        },
        onSuccess: async () => {
          setStep("verify");
          setLoading(false);
          setOtpEmail(getEmail as string);
        },
      },
    });
  }

  const handleVerifyOtp = async () => {
    const { data, error } = await authClient.emailOtp.verifyEmail({
      email: oteEmail,
      otp: otp,
    });
    if (data?.status === true) {
      toast("User verified successfully");
      router.push("/sign-in");
    } else {
      toast.error(error?.message);
    }
  };
  return (
    <>
      {step === "register" ? (
        <AuthWrapper
          headerTitle="Verify your email"
          headerDescription="Verify now"
          backHref="/login"
          backLabel="Login"
          backTitle="Back to login "
          showSocial={false}
        >
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
                  Send verify code
                </Button>
              )}
            </form>
          </Form>
        </AuthWrapper>
      ) : (
        <VerifyOtp
          loading={loading}
          onOTP={otp}
          setOTP={setOTP}
          onSubmit={handleVerifyOtp}
        />
      )}
    </>
  );
};

export default EmailVerify;
