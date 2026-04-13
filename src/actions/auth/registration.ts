"use server";

import axios from "../../../utils/axios";

type RegisterDataType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationalIdNumber: string;
  address: string;
  password: string;
  roles: string[];
};

type RegisterResponseDataType = {
  status: "SUCCESS" | "FAIL";
  message: string;
  data: null;
};

interface BackendResponse {
  status?: "SUCCESS" | "FAIL";
  message?: string;
  data?: unknown;
  body?: {
    status?: "SUCCESS" | "FAIL";
    message?: string;
    data?: unknown;
  };
}

export const register = async (
  data: RegisterDataType
): Promise<RegisterResponseDataType> => {
  try {
    const requestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      nationalIdNumber: data.nationalIdNumber,
      address: data.address,
      password: data.password,
      roles: data.roles,
    };

    const { data: backendResponse }: { data: BackendResponse } = await axios.post(
      "/api/auth/signup",
      requestData
    );

    const parsedResponse = backendResponse.body || backendResponse;

    if (!parsedResponse || parsedResponse.status !== "SUCCESS") {
      return {
        status: "FAIL",
        message: parsedResponse?.message || "Registration failed",
        data: null,
      };
    }

    return {
      status: "SUCCESS",
      message: parsedResponse.message || "Registration successful",
      data: null,
    };
  } catch (error) {
    const message = getErrorMessage(error, "Registration failed. Please try again.");

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
    return str !== "{}" ? str : fallback;
  } catch {
    return fallback;
  }
}