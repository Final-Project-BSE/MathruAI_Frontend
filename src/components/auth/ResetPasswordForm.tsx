"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { forgetPasswordRequest } from "@/actions/auth";
import { errorToast } from "../common/toast";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Please enter your email address.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
});

interface ResetPasswordFormProps {
  onNext?: () => void;
  setEmail: (email: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onNext,
  setEmail,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await forgetPasswordRequest(values.email);

    if (res.status === "SUCCESS") {
      setEmail(values.email);
      onNext?.();

      return;
    }

   errorToast(res.message ?? "Something went wrong")
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-full w-full"
      >
        <div className="flex flex-col gap-[15px] w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {form.formState.errors.email?.message && (
                  <div className="text-[10.5px] 3xl:text-sm h-max border-2 border-[#FF5252] bg-[#FF52521A] p-[15px] 3xl:p-5 rounded-[11.25px] 3xl:rounded-[15px] mb-[18.75px] 3xl:mb-[25px] text-[#FF5252] flex items-center">
                    <i className="danger-icon size-[18px] 3xl:size-6 mr-[7.5px] 3xl:mr-[10px] shrink-0" />
                    {form.formState.errors.email?.message}
                  </div>
                )}
                <div className="flex h-[44px] 3xl:h-[55.5px] w-full rounded-[10px] 3xl:rounded-[13.33px] px-[15px] 3xl:px-[20px] shadow-[0px_0px_7.5px_0px_#0000001A] focus-within:border group focus-within:border-[#2D3B64]">
                  <span className="flex flex-col gap-0 h-max my-auto w-full">
                    <FormLabel className="text-[9px] 3xl:text-[12px] text-[#9E9E9E] font-normal">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Registered Email"
                        {...field}
                        className="text-[10.5px] 3xl:text-sm p-0 m-0 py-0 border-none h-max text-[#616161] w-full rounded-none shadow-none"
                        type="email"
                      />
                    </FormControl>
                  </span>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full rounded-[7.5px] 3xl:rounded-[10px] font-semibold text-[13.5px] 3xl:text-[18.67px] h-[31px] 3xl:h-[41.33px] bg-gradient-to-r from-[#0545CB] to-[#3165DB] text-white hover:bg-[#E0E0E0] "
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            "Next"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
