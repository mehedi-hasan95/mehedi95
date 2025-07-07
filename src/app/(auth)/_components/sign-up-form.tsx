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
import { registerSchema } from "@/schemas/auth.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoadingButton } from "@/components/common/loading-button";
import { toast } from "sonner";
import { VerifyOtp } from "./verify-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
export const SignUpForm = () => {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOTP] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: "user",
      password: "",
      confirmPassword: "",
    },
  });

  const trpc = useTRPC();
  const updateRole = useMutation(trpc.auth.updateRole.mutationOptions());

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const { data } = await authClient.signUp.email(
      {
        email: values.email,
        name: values.name,
        password: values.password,
        username: values.username,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onError: (error) => {
          toast(error.error.message);
          setLoading(false);
        },
        onSuccess: () => {
          setLoading(false);
        },
      }
    );
    if (data) {
      setStep("verify");
      toast("Verification email sent to your email");
      await authClient.emailOtp.sendVerificationOtp({
        email: data.user.email,
        type: "email-verification",
        fetchOptions: {
          onError: (e) => {
            toast(e.error.message);
          },
        },
      });
      setEmail(data.user.email);
      updateRole.mutate({ id: data.user.id, role: values.role });
    }
  }

  const handleVerifyOtp = async () => {
    const { data, error } = await authClient.emailOtp.verifyEmail({
      email: email,
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
    <div>
      {step === "register" ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mehedi"
                      {...field}
                      className="placeholder:text-muted-foreground text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Your Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mehedi"
                      {...field}
                      className="placeholder:text-muted-foreground text-gray-100"
                    />
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
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      {...field}
                      className="placeholder:text-muted-foreground text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Select your role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="text-white w-full">
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select your role"
                          className="text-white"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-white bg-black hover:!bg-black">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input
                      placeholder="******"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="placeholder:text-muted-foreground text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="placeholder:text-muted-foreground text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 items-center">
              <Checkbox
                id="show-password"
                checked={showPassword}
                onCheckedChange={(checked) => setShowPassword(!!checked)}
              />
              <label
                htmlFor="show-password"
                className="text-white cursor-pointer"
              >
                Show Password
              </label>
            </div>
            {loading ? (
              <LoadingButton
                title="Creating Account..."
                className="w-full bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-700/80 hover:to-sky-600/70 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl"
              />
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-700/80 hover:to-sky-600/70 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl"
                type="submit"
              >
                Register
              </Button>
            )}
          </form>
        </Form>
      ) : (
        <VerifyOtp
          onOTP={otp}
          setOTP={setOTP}
          validTill={300}
          onSubmit={handleVerifyOtp}
          loading={loading}
        />
      )}
    </div>
  );
};
