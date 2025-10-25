"use server";

import axios from "../../../utils/axios";

type RegisterDataType = {
  name: string;
  email: string;
  phone: string;
  dateofbirth: string;
  password: string;
  userType: "midwife" | "reproductive_lady" | "pregnant_lady" | "postpartum_lady";
};

type RegisterResponseDataType = {
  status: "SUCCESS" | "FAIL";
  message: string;
  data: null;
};

export const register = async (
  data: RegisterDataType
): Promise<RegisterResponseDataType> => {
  try {
    // Split name into firstName and lastName
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Map frontend userType to backend roles
    const roleMapping = {
      midwife: "MIDWIFE",
      reproductive_lady: "HOPE_TO_PREGNANT_MOTHER",
      pregnant_lady: "PREGNANT_MOTHER",
      postpartum_lady: "POST_PREGNANT_MOTHER"
    };

    const requestData = {
      firstName,
      lastName,
      email: data.email,
      phoneNumber: data.phone,
      dateOfBirth: data.dateofbirth,
      password: data.password,
      roles: [roleMapping[data.userType]],
    };

    console.log("Sending registration request:", requestData);

    const response = await axios.post("/api/auth/signup", requestData);

    console.log("Raw registration response:", JSON.stringify(response.data, null, 2));

    let backendResponse = response.data;

    // Check if response has a body property
    if (backendResponse.body && typeof backendResponse.body === "object") {
      backendResponse = backendResponse.body;
    }

    // Validate response structure
    if (!backendResponse || typeof backendResponse !== "object") {
      console.error("Invalid response structure");
      return {
        status: "FAIL",
        message: "Invalid response from server",
        data: null,
      };
    }

    const { status, message } = backendResponse;

    console.log("Parsed registration response:", { status, message });

    if (status !== "SUCCESS") {
      return {
        status: "FAIL",
        message: message || "Registration failed",
        data: null,
      };
    }

    return {
      status: "SUCCESS",
      message: message || "Registration successful",
      data: null,
    };
  } catch (error) {
    console.error("Registration error:", error);

    const message = getErrorMessage(
      error,
      "Registration failed. Please try again."
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