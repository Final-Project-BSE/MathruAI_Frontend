import CardWrapper from "@/components/auth/CardWrapper";
import RegisterForm from "@/components/auth/RegisterForm";


const LoginPage = () => {
  return (
    <CardWrapper
      logo={true}
      label=""
      title="Register"
      backButtonTitle=""
      backButtonHref=""
      backButtonLabel=""
      titleClass=" text-4xl font-medium text-center"
      headerTexts=""
      className=""
    >
      <RegisterForm />
    </CardWrapper>
  );
};

export default LoginPage;
