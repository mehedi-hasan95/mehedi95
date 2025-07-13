"use client";
import { loginSchema } from "@/schemas/auth.schema";
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
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { LoadingButton } from "@/components/common/loading-button";
import { toast } from "sonner";
import { authClient, signIn } from "@/lib/auth-client";
import { ResetEmailForm } from "./resetEmailForm";
import { VerifyOtp } from "./verify-otp";
export const SignInForm = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState<"login" | "otp" | "verify">("login");
  const [otp, setOTP] = useState<string>("");
  const [getEmail, setGetEmail] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast("Login success");
          setGetEmail(values.email);
          setLoading(false);
          window.location.reload();
        },
        onError: (e) => {
          toast(e.error.message);
          if (e.error.status === 403) {
            setGetEmail(values.email);
            setStep("otp");
          }
          setLoading(false);
        },
      }
    );
  }
  const sendOTP = async (email: string) => {
    await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: "email-verification",
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
        },
        onError: (e) => {
          toast(e.error.message);
          setLoading(false);
        },
        onSuccess: () => {
          setStep("verify");
          toast("Verification email sent to your email");
          setLoading(false);
        },
      },
    });
  };
  const handleVerifyOtp = async () => {
    const { data, error } = await authClient.emailOtp.verifyEmail(
      {
        email: getEmail,
        otp: otp,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onError: () => {
          setLoading(false);
        },
        onSuccess: () => {
          setLoading(false);
        },
      }
    );
    if (data?.status === true) {
      toast("User verified successfully");
      setStep("login");
    } else {
      toast.error(error?.message);
    }
  };
  return (
    <>
      {step === "login" ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="****"
                        type={showPw ? "text" : "password"}
                        {...field}
                        className="pl-10 pr-10 bg-black/30 border-sky-500/30 text-white placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? (
                          <EyeOff className="h-4 w-4 cursor-pointer" />
                        ) : (
                          <Eye className="h-4 w-4 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-black/30 border-sky-500/30 text-sky-400 focus:ring-sky-400/40"
                />
                <span>Remember me</span>
              </label>
              <Link
                className="text-sky-400 hover:text-sky-300"
                href="/reset-password"
              >
                Forgot password?
              </Link>
            </div>
            {isLoading ? (
              <LoadingButton className="w-full bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-700/80 hover:to-sky-600/70 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl" />
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-700/80 hover:to-sky-600/70 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl"
                type="submit"
              >
                Login
              </Button>
            )}
          </form>
        </Form>
      ) : step === "otp" ? (
        <ResetEmailForm
          loading={isLoading}
          sendOtpEmail={sendOTP}
          theEmail={getEmail}
        />
      ) : (
        <VerifyOtp
          loading={isLoading}
          onOTP={otp}
          setOTP={setOTP}
          onSubmit={handleVerifyOtp}
        />
      )}
    </>
  );
};
