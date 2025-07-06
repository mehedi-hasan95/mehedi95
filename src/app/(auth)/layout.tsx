interface Props {
  children: React.ReactNode;
}
const AuthLayout = async ({ children }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-sky-900">
      {children}
    </div>
  );
};

export default AuthLayout;
