"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { successToast, errorToast } from "../common/toast";
import { login } from "@/lib/authentication";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .min(1, "Email is required.")
    .email({
      message: "Please enter a valid email address.",
    }),
  password: z
    .string({
      required_error: "Password is required.",
    })
    .min(1, "Password is required."),
  rememberMe: z.boolean().default(false),
});

interface SignInProps {
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
  onClose?: () => void;
}

const SignIn = ({
  onSwitchToSignUp,
  onForgotPassword,
  onClose,
}: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoginError(null);

    if (!values.email.trim() || !values.password.trim()) {
      const errorMsg =
        "The email or password you entered is incorrect. Please try again.";
      setLoginError(errorMsg);
      errorToast(errorMsg);
      return;
    }

    try {
      const res = await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (res.status === "FAIL") {
        const errorMsg =
          res.message ||
          "The email or password you entered is incorrect. Please try again.";
        setLoginError(errorMsg);
        errorToast(errorMsg);
        return;
      }

      successToast("Login successful.");
      
      // Close modal if callback provided
      if (onClose) {
        onClose();
      }
      
      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const errorMsg =
        "The email or password you entered is incorrect. Please try again.";
      setLoginError(errorMsg);
      errorToast(errorMsg);
      console.error("Login error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-4">
          {loginError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {loginError}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    className="h-12 bg-gray-50 border-0 rounded-[8.77px] placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-12 bg-gray-50 border-0 rounded-[8.77px] placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                      disabled={form.formState.isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={form.formState.isSubmitting}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="size-4"
                    disabled={form.formState.isSubmitting}
                  />
                  <label
                    htmlFor="remember"
                    className="text-[12.6px] text-[#424242] cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />
            <button
              type="button"
              onClick={() => {
                if (onForgotPassword) {
                  onForgotPassword();
                } else {
                  router.push("/forgot-password");
                }
              }}
              className="text-[#26262B] cursor-pointer text-[14px] font-[700] hover:underline"
              disabled={form.formState.isSubmitting}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full mt-3.5 h-12 bg-[#EB136B] hover:bg-pink-700 text-white text-[16px] font-semibold rounded-[8.77px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center text-[#000000] p-0 mt-0 text-[14px]">
          or
        </div>

        <div className="text-center text-[14px] text-[#424242] font-[400]">
          Don&rsquo;t have an Account?{" "}
          <button
            type="button"
            onClick={() => {
              if (onSwitchToSignUp) {
                onSwitchToSignUp();
              } else {
                router.push("/sign-up");
              }
            }}
            className="text-[#26262B] cursor-pointer text-[14px] font-[700] hover:underline"
            disabled={form.formState.isSubmitting}
          >
            Sign Up
          </button>
        </div>
      </form>
    </Form>
  );
};

export default SignIn;