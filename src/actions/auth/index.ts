"use server";

import axios from "../../../utils/axios";

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
    const response = await axios.post("/api/auth/signin", data);

    return response.data;
  } catch (error) {
    console.error("Sign in error:", error);

    const message = getErrorMessage(
      error,
      "The email or password you entered is incorrect. Please try again."
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
): Promise<{ status: "SUCCESS" | "FAIL"; message: string; data: unknown }> => {
  try {
    const res = await axios.post(
      "/api/v1/admin/user-management-members/forgot-password",
      { email }
    );

    return res.data;
  } catch (error) {
    console.error("Forgot password error:", error);
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
      "/api/v1/admin/user-management-members/reset-password",
      { password, token }
    );

    return res.data;
  } catch (error) {
    console.error("Reset password error:", error);

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

function getErrorMessage(err: unknown, fallback = "An error occurred") {
  if (!err) return fallback;

  if (typeof err === "object" && err !== null) {
    type AxiosLike = {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const maybe = err as AxiosLike;

    if (
      maybe.response?.data?.message &&
      typeof maybe.response.data.message === "string" &&
      maybe.response.data.message.length
    ) {
      return maybe.response.data.message;
    }

    if (typeof maybe.message === "string" && maybe.message.length) {
      return maybe.message;
    }
  }

  try {
    const str = JSON.stringify(err);
    if (typeof str === "string" && str !== "{}") return str;
  } catch {
    // Ignore stringify errors
  }

  return fallback;
}