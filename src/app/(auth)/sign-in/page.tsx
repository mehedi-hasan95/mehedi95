import { AuthWrapper } from "../_components/auth-wrapper";
import { SignInForm } from "../_components/signin-form";

const SignIn = async () => {
  return (
    <AuthWrapper
      backHref="/sign-up"
      backLabel="Sign up here"
      backTitle="Don't have an account? "
      headerDescription="Sign up to continue"
      headerTitle="Welcome Back"
      showSocial
    >
      <SignInForm />
    </AuthWrapper>
  );
};

export default SignIn;
