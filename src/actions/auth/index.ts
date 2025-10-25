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

    console.log("Raw axios response:", JSON.stringify(response.data, null, 2));

    // extract from body
    let backendResponse = response.data;
    
    // Check if response has a body property
    if (backendResponse.body && typeof backendResponse.body === 'object') {
      backendResponse = backendResponse.body;
      console.log("Extracted from body:", backendResponse);
    }

    // Check if the response has the expected structure
    if (!backendResponse || typeof backendResponse !== 'object') {
      console.error("Invalid response structure");
      return {
        status: "FAIL",
        message: "Invalid response from server",
        data: null,
      };
    }

    // Extract the nested data
    const { status, message, data: responseData } = backendResponse;

    console.log("Parsed response:", { status, message, data: responseData });

    // Check if login was successful
    if (status !== "SUCCESS" || !responseData) {
      return {
        status: "FAIL",
        message: message || "Login failed",
        data: null,
      };
    }

    // Validate the data structure
    if (!responseData.email || !responseData.token || !responseData.roles) {
      console.error("Missing required fields in response data:", responseData);
      return {
        status: "FAIL",
        message: "Invalid response data from server",
        data: null,
      };
    }

    // Ensure roles is an array
    const roles = Array.isArray(responseData.roles) 
      ? responseData.roles 
      : [responseData.roles];

    console.log("Final extracted data:", {
      email: responseData.email,
      token: responseData.token,
      roles,
    });

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