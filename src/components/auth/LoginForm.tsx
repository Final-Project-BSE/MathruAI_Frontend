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
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
  onClose: () => void;
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
      setLoginError(
        "The email or password you entered is incorrect. Please try again."
      );
      errorToast(
        "The email or password you entered is incorrect. Please try again."
      );
      return;
    }

    try {
      const res = await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (res.status === "FAIL") {
        setLoginError(
          "The email or password you entered is incorrect. Please try again."
        );
        errorToast(
          "The email or password you entered is incorrect. Please try again."
        );
        return;
      }

      successToast("Login successful.");
      router.prefetch("/dashboard");
      router.push("/dashboard");
    } catch (error) {
      setLoginError(
        "The email or password you entered is incorrect. Please try again."
      );
      errorToast(
        "The email or password you entered is incorrect. Please try again."
      );
    }
  };

  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
        <div className="space-y-4">
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                  />
                  <label
                    htmlFor="remember"
                    className="text-[12.6px] text-[#424242]"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-[#26262B] cursor-pointer text-[14px] font-[700] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full mt-3.5 h-12 bg-[#EB136B] hover:bg-pink-700 text-white text-[16px] font-semibold rounded-[8.77px] cursor-pointer"
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
            onClick={() => router.push("/sign-up")}
            className="text-[#26262B] cursor-pointer text-[14px] font-[700] hover:underline"
          >
            Sign Up
          </button>
        </div>
      </form>
    </Form>
  );
};

export default SignIn;
