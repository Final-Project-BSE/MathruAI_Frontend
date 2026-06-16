'use client'
import CardWrapper from "@/components/auth/CardWrapper";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import PasswordSuccessModal from "@/components/auth/PasswordSuccessModal";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

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
        <NewPasswordForm
          onSwitchToSignIn={() => router.push("/sign-in")}
          onClose={() => router.push("/sign-in")}
        />
      </CardWrapper>

      <PasswordSuccessModal />
    </>
  );
};

export default LoginPage;
