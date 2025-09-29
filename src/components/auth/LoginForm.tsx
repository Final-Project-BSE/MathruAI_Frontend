"use client"

import { useState } from "react"
import Link from "next/link"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2Icon } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { successToast, errorToast } from "../common/toast"
import { login } from "@/lib/authentication"

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
})

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Clear any previous login errors
    setLoginError(null)

    // Check if fields are empty (additional client-side validation)
    if (!values.email.trim() || !values.password.trim()) {
      setLoginError("The email or password you entered is incorrect. Please try again.")
      errorToast("The email or password you entered is incorrect. Please try again.")
      return
    }

    try {
      const res = await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      })

      if (res.status === "FAIL") {
        // Set the specific error message for incorrect credentials
        setLoginError("The email or password you entered is incorrect. Please try again.")
        errorToast("The email or password you entered is incorrect. Please try again.")
        return
      }

      // Success case
      successToast("Login successful.")

      // Redirect to Analytics Dashboard
      router.prefetch("/dashboard")
      router.push("/dashboard")
    } catch (error) {
      // Handle any unexpected errors
      setLoginError("The email or password you entered is incorrect. Please try again.")
      errorToast("The email or password you entered is incorrect. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full gap-[68px] 3xl:gap-[90px]"
      >
        <div className="flex flex-col gap-[15px] 3xl:gap-5">
          {/* Display login error message */}
          {(loginError || form.formState.errors.email?.message || form.formState.errors.password?.message) && (
            <div className="text-[10.5px] 3xl:text-sm h-max border-2 border-[#FF5252] bg-[#FF52521A] p-[15px] 3xl:p-5 rounded-[11.25px] 3xl:rounded-[15px] mb-[18.75px] 3xl:mb-[25px] text-[#FF5252] flex items-center">
              <i className="danger-icon size-[18px] 3xl:size-6 mr-[7.5px] 3xl:mr-[10px] shrink-0" />
              {loginError || form.formState.errors.email?.message || form.formState.errors.password?.message}
            </div>
          )}

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-[44px] 3xl:h-[55.5px] w-full rounded-[10px] 3xl:rounded-[13.33px] px-[15px] 3xl:px-[20px] shadow-[0px_0px_7.5px_0px_#0000001A] focus-within:border group focus-within:border-[#2D3B64]">
                  <span className="flex flex-col gap-0 h-max my-auto w-full">
                    <FormLabel className="text-[9px] 3xl:text-[12px] text-[#9E9E9E] font-normal">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Registered Email"
                        {...field}
                        className="text-[10.5px] 3xl:text-sm p-0 placeholder:text-[10.5px] m-0 py-0 border-none h-max text-[#616161] w-full rounded-none shadow-none"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => {
                          field.onChange(e)
                          // Clear login error when user starts typing
                          if (loginError) setLoginError(null)
                        }}
                      />
                    </FormControl>
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="focus:outline-transparent flex h-[54px] w-full rounded-[10px] 3xl:rounded-[13.33px] px-[15px] 3xl:px-[20px] shadow-[0px_0px_7.5px_0px_#0000001A] focus-within:border group focus-within:border-[#2D3B64]">
                  <div className="flex flex-row items-center justify-between w-full">
                    <span className="flex flex-col gap-0 h-max my-auto w-full">
                      <FormLabel className="text-[9px] 3xl:text-[12px] text-[#9E9E9E] font-normal">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="***********"
                          {...field}
                          className="text-[10.5px] 3xl:text-sm p-0 m-0 py-0 border-none h-max text-[#616161] w-full rounded-none shadow-none"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          onChange={(e) => {
                            field.onChange(e)
                            // Clear login error when user starts typing
                            if (loginError) setLoginError(null)
                          }}
                        />
                      </FormControl>
                    </span>
                    {/* Password visibility toggle */}
                    <i
                      onClick={() => setShowPassword(!showPassword)}
                      className={cn(
                        "size-[15px] 3xl:size-5 text-[#B1B1B1] cursor-pointer",
                        showPassword ? "password-show" : "password-closed-icon",
                      )}
                      role="button"
                      tabIndex={0}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setShowPassword(!showPassword)
                        }
                      }}
                    />
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Remember Password and Forgot Password */}
          <div className="w-full flex items-center justify-between gap-5 3xl:gap-[26.67px]">
            {/* Remember Password Checkbox */}
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex flex-row items-center justify-center gap-[8.75px] 3xl:gap-[11.25px]">
                  <Checkbox
                    id="rememberMe"
                    className="size-[12.5px] 3xl:size-[16.5px] data-[state=checked]:border-none data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#0545CB] data-[state=checked]:to-[#3165DB]"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-[10.5px] 3xl:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black cursor-pointer"
                  >
                    Remember Password
                  </label>
                </div>
              )}
            />

            {/* Forgot Password Link */}
            <Link
              href="/reset-password"
              className="text-[10.5px] 3xl:text-sm text-[#3165DB] hover:underline focus:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-[7.5px] 3xl:rounded-[10px] font-semibold text-[13.5px] 3xl:text-[18.67px] h-[31px] 3xl:h-[41.33px] bg-gradient-to-r from-[#0545CB] to-[#3165DB] text-white hover:bg-[#E0E0E0] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.formState.isSubmitting ? <Loader2Icon className="size-6 3xl:size-8 animate-spin" /> : "Login"}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
