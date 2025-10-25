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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRouter } from "next/navigation";
import { successToast, errorToast } from "../common/toast";
import { register } from "../../actions/auth/registration";

const formSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required.",
      })
      .min(1, "Name is required.")
      .min(2, "Name must be at least 2 characters."),
    email: z
      .string({
        required_error: "Email is required.",
      })
      .min(1, "Email is required.")
      .email({
        message: "Please enter a valid email address.",
      }),
    phone: z
      .string({
        required_error: "Phone number is required.",
      })
      .min(1, "Phone number is required.")
      .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number."),
    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string({
        required_error: "Please confirm your password.",
      })
      .min(1, "Please confirm your password."),
    userType: z.enum(["midwife", "pregnant_lady"], {
      required_error: "Please select your role.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

interface SignUpProps {
  onSwitchToSignIn?: () => void;
  onClose?: () => void;
}

const SignUp = ({ onSwitchToSignIn, onClose }: SignUpProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: undefined,
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setRegisterError(null);

    try {
      console.log("Attempting registration for:", values.email);

      const res = await register({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        userType: values.userType,
      });

      console.log("Registration response:", res);

      if (res.status === "FAIL") {
        const errorMsg = res.message || "Registration failed. Please try again.";
        setRegisterError(errorMsg);
        errorToast(errorMsg);
        return;
      }

      // Success
      successToast("Registration successful! Please sign in.");
      
      // Switch to sign in or redirect
      if (onSwitchToSignIn) {
        onSwitchToSignIn();
      } else {
        router.push("/sign-in");
      }

    } catch (error) {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setRegisterError(errorMsg);
      errorToast(errorMsg);
      console.error("Registration error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-4">
          {registerError && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {registerError}
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Full Name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Email"
                    type="email"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Phone Number"
                    type="tel"
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="h-12 bg-gray-50 border-0 rounded-[8.77px] placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                      disabled={form.formState.isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      disabled={form.formState.isSubmitting}
                    >
                      {showConfirmPassword ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                    disabled={form.formState.isSubmitting}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <RadioGroupItem
                        value="midwife"
                        id="midwife"
                        className="border-gray-300"
                      />
                      <label
                        htmlFor="midwife"
                        className="text-[14px] text-[#424242] cursor-pointer"
                      >
                        Midwife
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <RadioGroupItem
                        value="pregnant_lady"
                        id="pregnant_lady"
                        className="border-gray-300"
                      />
                      <label
                        htmlFor="pregnant_lady"
                        className="text-[14px] text-[#424242] cursor-pointer"
                      >
                        Pregnant Lady
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full mt-3.5 h-12 bg-[#EB136B] hover:bg-pink-700 text-white text-[16px] font-semibold rounded-[8.77px] cursor-pointer"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </Button>

        <div className="text-center text-[#000000] p-0 mt-0 text-[14px]">
          or
        </div>

        <div className="text-center text-[14px] text-[#424242] font-[400]">
          Already have an Account?{" "}
          <button
            type="button"
            onClick={() => {
              if (onSwitchToSignIn) {
                onSwitchToSignIn();
              } else {
                router.push("/sign-in");
              }
            }}
            className="text-[#26262B] cursor-pointer text-[14px] font-[700] hover:underline"
            disabled={form.formState.isSubmitting}
          >
            Sign In
          </button>
        </div>
      </form>
    </Form>
  );
};

export default SignUp;