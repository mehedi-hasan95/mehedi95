import Link from "next/link";

interface Props {
  title: string;
  label: string;
  href: string;
}
export const AuthBackButton = ({ href, title, label }: Props) => {
  return (
    <p className="text-sm text-center text-gray-400">
      {title}
      <Link href={href} className="text-sky-400 hover:text-sky-300 font-medium">
        {label}
      </Link>
    </p>
  );
};
