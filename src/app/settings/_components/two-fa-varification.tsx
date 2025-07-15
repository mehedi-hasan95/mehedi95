"use client";
import { LoadingButton } from "@/components/common/loading-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const TwoFaVerification = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.auth.getUserSession.queryOptions());
  const [is2FAEnabled, setIs2FAEnabled] = useState(data?.twoFactorEnabled);
  const [pendingToggle, setPendingToggle] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSwitchChange = (checked: boolean) => {
    if (checked !== is2FAEnabled) {
      setPendingToggle(true);
      setPassword("");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      if (is2FAEnabled) {
        await authClient.twoFactor.disable(
          {
            password,
          },
          {
            onRequest: () => {
              setIsVerifying(true);
            },
            onError: (e) => {
              toast.error(e.error.message);
              setIs2FAEnabled(true);
              setIsVerifying(false);
            },
            onSuccess: () => {
              setIs2FAEnabled(false);
              toast("Two-factor authentication has been disabled.");
              setIsVerifying(false);
            },
          }
        );
      } else {
        await authClient.twoFactor.enable(
          { password },
          {
            onRequest: () => {
              setIsVerifying(true);
            },
            onError: (e) => {
              toast.error(e.error.message);
              setIs2FAEnabled(false);
              setIsVerifying(false);
            },
            onSuccess: () => {
              setIs2FAEnabled(true);
              toast("Two-factor authentication has been enabled successfully!");
              setIsVerifying(false);
            },
          }
        );
      }

      setPendingToggle(false);
      setPassword("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(e.message || "An error occurred while updating 2FA.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    setPendingToggle(false);
    setPassword("");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by enabling two-factor
          authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable 2FA</Label>
            <p className="text-sm text-muted-foreground">
              {is2FAEnabled
                ? "Two-factor authentication is currently enabled"
                : "Two-factor authentication is currently disabled"}
            </p>
          </div>
          <Switch
            checked={pendingToggle ? !is2FAEnabled : is2FAEnabled}
            onCheckedChange={handleSwitchChange}
            disabled={isVerifying}
          />
        </div>

        {pendingToggle && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Confirm your password to {is2FAEnabled ? "disable" : "enable"}{" "}
                2FA
              </Label>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  {isVerifying ? (
                    <LoadingButton
                      title="Verifying..."
                      className="flex-1"
                      variant={"outline"}
                    />
                  ) : (
                    <Button
                      type="submit"
                      disabled={isVerifying || !password}
                      variant={"outline"}
                      className="flex-1"
                    >
                      Confirm
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-amber-900 hover:bg-amber-950"
                    onClick={handleCancel}
                    disabled={isVerifying}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {is2FAEnabled === true && !pendingToggle && (
          <div className="p-4 border rounded-lg bg-green-950/20 dark:bg-green-950/20">
            <div className="flex items-center gap-2 text-green-400 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">2FA is active</span>
            </div>
            <p className="text-sm text-green-500 dark:text-green-500 mt-1">
              Your account is protected with two-factor authentication.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
