import { Card, CardContent } from "@/components/ui/card";
import { AuthHeader } from "./auth-header";
import { AuthSocial } from "./auth-social";
import { AuthBackButton } from "./auth-back-button";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  headerTitle: string;
  headerDescription: string;
  showSocial?: boolean;
  backTitle: string;
  backLabel: string;
  backHref: string;
  className?: string;
}
export const AuthWrapper = ({
  children,
  headerTitle,
  headerDescription,
  showSocial = true,
  backHref,
  backLabel,
  backTitle,
  className,
}: Props) => {
  return (
    <Card
      className={cn(
        "relative z-10 w-full max-w-md bg-black/40 backdrop-blur border-sky-500/20 shadow-2xl",
        className
      )}
    >
      <AuthHeader description={headerDescription} title={headerTitle} />
      <CardContent className="space-y-6">
        {children}
        {showSocial && <AuthSocial />}
        <AuthBackButton href={backHref} label={backLabel} title={backTitle} />
      </CardContent>
    </Card>
  );
};
