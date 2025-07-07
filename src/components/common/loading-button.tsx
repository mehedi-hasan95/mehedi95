import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  title?: string;
  className?: string;
}
export const LoadingButton = ({ title = "Please wait", className }: Props) => {
  return (
    <Button size="sm" disabled className={className}>
      <Loader2 className="animate-spin" />
      {title}
    </Button>
  );
};
