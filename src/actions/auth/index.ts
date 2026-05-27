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
    email: string;
    roles: string[];
    token: string;
  } | null;
};

export const signIn = async (
  data: SignInDataType
): Promise<SignInResponseDataType> => {
  try {
    const response = await axios.post("/api/auth/signin", data);

    let backendResponse = response.data;

    if (backendResponse.body && typeof backendResponse.body === "object") {
      backendResponse = backendResponse.body;
    }

    if (!backendResponse || typeof backendResponse !== "object") {
      return {
        status: "FAIL",
        message: "Invalid response from server",
        data: null,
      };
    }

    const { status, message, data: responseData } = backendResponse as {
      status?: "SUCCESS" | "FAIL";
      message?: string;
      data?: {
        email?: string;
        token?: string;
        roles?: string[] | string;
      };
    };

    if (status !== "SUCCESS" || !responseData) {
      return {
        status: "FAIL",
        message: message || "Login failed",
        data: null,
      };
    }

    if (!responseData.email || !responseData.token || !responseData.roles) {
      return {
        status: "FAIL",
        message: "Invalid response data from server",
        data: null,
      };
    }

    const roles = Array.isArray(responseData.roles)
      ? responseData.roles
      : [responseData.roles];

    return {
      status: "SUCCESS",
      message: message || "Login successful",
      data: {
        email: responseData.email,
        token: responseData.token,
        roles,
      },
    };
  } catch (error) {
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
  if (!err || typeof err !== "object") return fallback;

  const maybe = err as {
    response?: { data?: { message?: string; error?: string } | string };
    message?: string;
  };

  const responseData = maybe.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "message" in responseData &&
    typeof responseData.message === "string" &&
    responseData.message.length
  ) {
    return responseData.message;
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "error" in responseData &&
    typeof responseData.error === "string" &&
    responseData.error.length
  ) {
    return responseData.error;
  }

  if (typeof maybe.message === "string" && maybe.message.length) {
    return maybe.message;
  }

  try {
    const str = JSON.stringify(err);
    if (typeof str === "string" && str !== "{}") return str;
  } catch {
    // ignore stringify errors
  }

  return fallback;
}