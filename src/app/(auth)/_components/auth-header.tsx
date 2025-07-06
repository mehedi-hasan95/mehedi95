import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  description: string;
}
export const AuthHeader = ({ title, description }: Props) => {
  return (
    <CardHeader className="space-y-1 text-center">
      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
        {title}
      </CardTitle>
      <CardDescription className="text-gray-300">{description}</CardDescription>
    </CardHeader>
  );
};
