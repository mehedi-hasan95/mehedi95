import { AuthWrapper } from "../_components/auth-wrapper";
import { SignUpForm } from "../_components/sign-up-form";

const SignUp = async () => {
  return (
    <AuthWrapper
      backHref="/sign-in"
      backLabel="Sign in here"
      backTitle="Already have an account? "
      headerDescription="Sign up to continue"
      headerTitle="Welcome Back"
      showSocial={false}
    >
      <SignUpForm />
    </AuthWrapper>
  );
};

export default SignUp;
