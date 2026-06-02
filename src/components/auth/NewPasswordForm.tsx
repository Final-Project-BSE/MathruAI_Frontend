"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { successToast, errorToast } from "../common/toast";
import { forgotPassword } from "@/lib/authentication";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .min(1, "Email is required.")
    .email({
      message: "Please enter a valid email address.",
    }),
});

interface ForgotPasswordProps {
  onSwitchToSignIn: () => void;
  onClose?: () => void;
}

const ForgotPassword = ({ onSwitchToSignIn }: ForgotPasswordProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await forgotPassword({
        email: values.email,
      });

      if (res.status === "FAIL") {
        errorToast(
          res.message || "Failed to send reset email. Please try again."
        );
        return;
      }

      successToast("Password reset link sent to your email!");
      setIsSubmitted(true);
    } catch {
      errorToast("An error occurred. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="size-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-[18px] font-semibold text-[#26262B]">
            Check Your Email
          </h3>

          <p className="text-[14px] text-[#424242]">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-semibold">{form.getValues("email")}</span>
          </p>

          <p className="text-[12.6px] text-[#616161]">
            Please check your inbox and click the link to reset your password.
            The link will expire in 24 hours.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={onSwitchToSignIn}
            className="h-12 w-full rounded-[8.77px] bg-[#EB136B] text-[16px] font-semibold text-white hover:bg-pink-700"
          >
            Back to Sign In
          </Button>

          <div className="text-[12.6px] text-[#424242]">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="cursor-pointer font-[700] text-[#26262B] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      <div className="mb-6 space-y-2 text-center">
        <p className="text-[14px] text-[#424242]">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    type="email"
                    className="h-12 rounded-[8.77px] border-0 bg-gray-50 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 w-full cursor-pointer rounded-[8.77px] bg-[#EB136B] text-[16px] font-semibold text-white hover:bg-pink-700"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center text-[14px] font-[400] text-[#424242]">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="cursor-pointer text-[14px] font-[700] text-[#26262B] hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;