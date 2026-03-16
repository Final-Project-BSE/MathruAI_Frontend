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

interface BackendResponse {
  status?: "SUCCESS" | "FAIL";
  message?: string;
  body?: {
    status?: "SUCCESS" | "FAIL";
    message?: string;
  };
}

export const register = async (
  data: RegisterDataType
): Promise<RegisterResponseDataType> => {
  try {
    // Split full name into first and last
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") ?? "";

    // Map frontend userType to backend roles
    const roleMapping = {
      midwife: "MIDWIFE",
      reproductive_lady: "HOPE_TO_PREGNANT_MOTHER",
      pregnant_lady: "PREGNANT_MOTHER",
      postpartum_lady: "POST_PREGNANT_MOTHER",
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

    // Send request
    const { data: backendResponse }: { data: BackendResponse } = await axios.post(
      "/api/auth/signup",
      requestData
    );

    console.log("Raw registration response:", JSON.stringify(backendResponse, null, 2));

    // Parse backend response
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
    console.error("Registration error:", error);

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

  const maybe = err as { response?: { data?: { message?: string } }; message?: string };

  return (
    maybe.response?.data?.message ||
    maybe.message ||
    (() => {
      try {
        const str = JSON.stringify(err);
        return str !== "{}" ? str : fallback;
      } catch {
        return fallback;
      }
    })()
  );
}
