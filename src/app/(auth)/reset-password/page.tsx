"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import CardWrapper from "@/components/auth/CardWrapper";
import CheckEmail from "@/components/auth/CheckEmail";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setShowCheckEmail(true);
  };

  const handleResend = async () => {
    setLoading(true);

    toast.success("Email sent successfully");

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full">
      {showCheckEmail ? (
        <i
          onClick={() => setShowCheckEmail(false)}
          className="arrow-left size-[18px] 3xl:size-[24px] text-[#616161] cursor-pointer"
        />
      ) : (
        <Link href="/sign-in">
          <i className="arrow-left size-[18px] 3xl:size-[24px] text-[#616161] cursor-pointer" />
        </Link>
      )}
      <CardWrapper
        logo={false}
        label={
          showCheckEmail
            ? `You will receive a link to ${email} and it will provide the instructions to reset the password.`
            : "Reset password by providing your registered email address."
        }
        title={showCheckEmail ? `Check Your Email` : "Reset Password"}
        backButtonTitle=""
        backButtonHref=""
        backButtonLabel=""
        titleClass=" text-xl font-medium"
        headerTexts=""
        className={showCheckEmail ? "" : ""}
      >
        {showCheckEmail ? (
          <div className="flex flex-col h-full justify-between">
            <CheckEmail />
            <Button
              disabled={loading}
              onClick={handleResend}
              className="w-full rounded-[10px] font-semibold text-lg h-[42px] text-white bg-[#0545CB] hover:bg-[#E0E0E0]"
            >
              {loading ? <Loader2 className="size-6 animate-spin" /> : "Resend"}
            </Button>
          </div>
        ) : (
          <ResetPasswordForm onNext={handleNext} setEmail={setEmail} />
        )}
      </CardWrapper>
    </div>
  );
};

export default ResetPassword;
