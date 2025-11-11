import CardWrapper from "@/components/auth/CardWrapper";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import PasswordSuccessModal from "@/components/auth/PasswordSuccessModal";

const LoginPage = () => {
  return (
    <>
      <CardWrapper
        logo={false}
        label=""
        title="Forgot Password"
      backButtonTitle=""
      backButtonHref=""
      backButtonLabel=""
      titleClass=" text-4xl text-center font-medium"
      headerTexts=""
      className=""
      >
        <NewPasswordForm />
      </CardWrapper>

      <PasswordSuccessModal />
    </>
  );
};

export default LoginPage;
