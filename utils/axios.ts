"use server";

import { getSession } from "@/lib/authentication";
import axios, { AxiosError } from "axios";

const axiosService = () => {
  const defaultOptions = {
    baseURL: process.env.BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(
    async (request) => {
      const session = await getSession();

      if (session?.user?.token) {
        request.headers.Authorization = `Bearer ${session.user.token}`;
      }

      if (process.env.ENABLE_AXIOS_LOGS === "true") {
        console.log(
          "Request:",
          request.method?.toUpperCase(),
          request.url,
          request.data
        );
      }

      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      if (process.env.ENABLE_AXIOS_LOGS === "true") {
        console.log("Response:", response.status, response.data);
      }
      return response;
    },
    (error: AxiosError) => {
      if (process.env.ENABLE_AXIOS_LOGS === "true") {
        console.error("Error Response:", error.response?.data);
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        // Unauthorized - could trigger logout or token refresh
        console.error("Unauthorized access - token may be invalid");
      }

      return Promise.reject(error.response?.data || error);
    }
  );

  return instance;
};

export default axiosService();

