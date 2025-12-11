import CardWrapper from "@/components/auth/CardWrapper";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <CardWrapper
      logo={true}
      label=""
      title="Login"
      backButtonTitle=""
      backButtonHref=""
      backButtonLabel=""
      titleClass=" text-4xl text-center font-medium"
      headerTexts=""
      className=""
    >
      <LoginForm />
    </CardWrapper>
  );
};

export default LoginPage;
