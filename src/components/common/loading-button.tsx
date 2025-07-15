import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  title?: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}
export const LoadingButton = ({
  title = "Please wait",
  variant = "default",
  className,
}: Props) => {
  return (
    <Button size="sm" disabled className={className} variant={variant}>
      <Loader2 className="animate-spin" />
      {title}
    </Button>
  );
};
