import CardWrapper from "@/components/auth/CardWrapper";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <CardWrapper
      logo={true}
      label=""
      title="Admin Login"
      backButtonTitle=""
      backButtonHref=""
      backButtonLabel=""
      titleClass=" text-xl font-medium"
      headerTexts=""
      className=""
    >
      <LoginForm />
    </CardWrapper>
  );
};

export default LoginPage;
