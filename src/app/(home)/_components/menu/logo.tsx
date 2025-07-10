import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  className?: string;
}
export const Logo = ({ className }: Props) => {
  return (
    <div className="flex items-center space-x-2">
      <Link href="/" className="flex items-center space-x-2">
        <div
          className={cn(
            "h-8 w-8 rounded-lg bg-primary flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold",
            className
          )}
        >
          <span className="text-white font-bold text-sm">L</span>
        </div>
        <span className="font-bold text-xl">Logo</span>
      </Link>
    </div>
  );
};
