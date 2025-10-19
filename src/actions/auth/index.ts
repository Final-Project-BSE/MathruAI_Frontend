"use server";

import type { CommonResponseDataType } from "@/types/common";
import axios from "@/utils/axios";
import { redirect } from "next/navigation";

type SignInDataType = {
  email: string;
  password: string;
};

type SignInResponseDataType = {
  status: "SUCCESS" | "FAIL";
  message: string;
  data: {
    _id: string;
    createdAt: string;
    firstName: string;
    lastName: string;
    email: string;
    privileges: string[];
    isActive: boolean;
    idToken: string;
    refreshToken: string;
  } | null;
};

export const signIn = async (
  data: SignInDataType
): Promise<SignInResponseDataType> => {
  try {
    const response = await axios.post(
      "/api/v1/admin/user-management-members/login",
      data
    );

    return response.data;
  } catch (error) {
    console.log(error);

    const message = getErrorMessage(
      error,
      "Something went wrong. Please try again later."
    );

    return {
      status: "FAIL",
      message,
      data: null,
    };
  }
};

export const forgetPasswordRequest = async (
  email: string
): Promise<CommonResponseDataType> => {
  try {
    const res = await axios.post(
      "/api/v1/admin/user-management-members/forgot-password",
      {
        email,
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    const message = getErrorMessage(
      error,
      "Something went wrong. Please try again later."
    );

    return {
      status: "FAIL",
      message,
      data: null,
    };
  }
};

export const setNewPassword = async (token: string, password: string) => {
  try {
    const res = await axios.post(
      `/api/v1/admin/user-management-members/reset-password`,
      {
        password,
        token,
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return redirect("/not-authorized");
    }
    const message = getErrorMessage(
      error,
      "Something went wrong. Please try again later."
    );

    return {
      status: "FAIL",
      message,
      data: null,
    };
  }
};

// Helper to safely extract an error message from unknown errors without using `any`.
function getErrorMessage(err: unknown, fallback = "An error occurred") {
  if (!err) return fallback;

  // If it's an Axios-like error with a response message
  if (typeof err === "object" && err !== null) {
    type AxiosLike = {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const maybe = err as AxiosLike;

    if (
      maybe.response &&
      maybe.response.data &&
      typeof maybe.response.data.message === "string" &&
      maybe.response.data.message.length
    )
      return maybe.response.data.message;

    if (typeof maybe.message === "string" && maybe.message.length)
      return maybe.message;
  }

  try {
    // Try stringifying unknown error
    const str = JSON.stringify(err);
    if (typeof str === "string" && str !== "{}") return str;
  } catch (e) {
    void e;
  }

  return fallback;
}
