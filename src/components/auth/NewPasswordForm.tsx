"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { resetPassword } from "@/actions/auth"
import { successToast, errorToast } from "../common/toast"

const formSchema = z
  .object({
    password: z
      .string({
        required_error: "Password is required.",
      })
      .min(8, "Password must be at least 8 characters long.")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ -/:-@[-`{-~])[A-Za-z\d -/:-@[-`{-~]{8,14}$/, {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and must be 8-14 characters long.",
      }),
    confirmPassword: z.string({
      required_error: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const NewPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      errorToast("Invalid reset token")
      return
    }

    const res = await resetPassword({
      newPassword: values.password,
      token: token,
    })

    if (res.status === "SUCCESS") {
      successToast("Password reset successfully!")
      // Redirect to login or show success modal
    } else {
       errorToast(res.message ?? "Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full gap-[68px] 3xl:gap-[90px]"
      >
        <div className="flex flex-col gap-[15px] 3xl:gap-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {form.formState.errors.password?.message && (
                  <div className="text-[10.5px] 3xl:text-sm h-max border-2 border-[#FF5252] bg-[#FF52521A] p-[15px] 3xl:p-5 rounded-[11.25px] 3xl:rounded-[15px] mb-[18.75px] 3xl:mb-[25px] text-[#FF5252] flex items-center">
                    <i className="danger-icon size-[18px] 3xl:size-6 mr-[7.5px] 3xl:mr-[10px] shrink-0" />
                    {form.formState.errors.password?.message}
                  </div>
                )}
                <div className="focus:outline-transparent flex h-[54px] w-full rounded-[10px] 3xl:rounded-[13.33px] px-[15px] 3xl:px-[20px] shadow-[0px_0px_7.5px_0px_#0000001A] focus-within:border group focus-within:border-[#2D3B64]">
                  <div className="flex flex-row items-center justify-between w-full">
                    <span className="flex flex-col gap-0 h-max my-auto w-full">
                      <FormLabel className="text-[9px] 3xl:text-[12px] text-[#9E9E9E] font-normal">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******************"
                          {...field}
                          className="text-[10.5px] 3xl:text-sm p-0 m-0 py-0 border-none h-max text-[#616161] w-full rounded-none shadow-none"
                          type={showPassword ? "text" : "password"}
                        />
                      </FormControl>
                    </span>
                    <i
                      onClick={() => setShowPassword(!showPassword)}
                      className={cn(
                        "size-[15px] 3xl:size-5 text-[#B1B1B1] cursor-pointer",
                        showPassword ? "password-show" : "password-closed-icon",
                      )}
                    />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                {form.formState.errors.confirmPassword?.message && (
                  <div className="text-[10.5px] 3xl:text-sm h-max border-2 border-[#FF5252] bg-[#FF52521A] p-[15px] 3xl:p-5 rounded-[11.25px] 3xl:rounded-[15px] mb-[18.75px] 3xl:mb-[25px] text-[#FF5252] flex items-center">
                    <i className="danger-icon size-[18px] 3xl:size-6 mr-[7.5px] 3xl:mr-[10px] shrink-0" />
                    {form.formState.errors.confirmPassword?.message}
                  </div>
                )}
                <div className="focus:outline-transparent flex h-[54px] w-full rounded-[10px] 3xl:rounded-[13.33px] px-[15px] 3xl:px-[20px] shadow-[0px_0px_7.5px_0px_#0000001A] focus-within:border group focus-within:border-[#2D3B64]">
                  <div className="flex flex-row items-center justify-between w-full">
                    <span className="flex flex-col gap-0 h-max my-auto w-full">
                      <FormLabel className="text-[9px] 3xl:text-[12px] text-[#9E9E9E] font-normal">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******************"
                          {...field}
                          className="text-[10.5px] 3xl:text-sm p-0 m-0 py-0 border-none h-max text-[#616161] w-full rounded-none shadow-none"
                          type={showConfirmPassword ? "text" : "password"}
                        />
                      </FormControl>
                    </span>
                    <i
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={cn(
                        "size-[15px] 3xl:size-5 text-[#B1B1B1] cursor-pointer",
                        showConfirmPassword ? "password-show" : "password-closed-icon",
                      )}
                    />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-[7.5px] 3xl:rounded-[10px] font-semibold text-[13.5px] 3xl:text-[18.67px] h-[31px] 3xl:h-[41.33px] bg-gradient-to-r from-[#0545CB] to-[#3165DB] text-white hover:bg-[#E0E0E0]"
        >
          {form.formState.isSubmitting ? <Loader2 className="size-6 3xl:size-8 animate-spin" /> : "Set Password"}
        </Button>
      </form>
    </Form>
  )
}

export default NewPasswordForm
