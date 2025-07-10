import { HomeNavMenu } from "./_components/menu/nav-menu";

interface Props {
  children: React.ReactNode;
}
const HomeLayout = async ({ children }: Props) => {
  return (
    <div className="space-y-2 container mx-auto px-6 xl:px-12 3xl:max-w-screen-3xl">
      <HomeNavMenu />
      {children}
    </div>
  );
};

export default HomeLayout;
