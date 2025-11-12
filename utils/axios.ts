"use server";

import { getSession } from "@/lib/authentication";
import axios, { AxiosError, AxiosInstance } from "axios";

const createAxiosService = (): AxiosInstance => {
  const baseURL = process.env.BASE_URL ?? "http://localhost:8080";

  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  // 🔹 Request Interceptor
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
    (error) => Promise.reject(error)
  );

  // 🔹 Response Interceptor
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

      if (error.response?.status === 401) {
        console.error("Unauthorized access - token may be invalid or expired");
      }

      return Promise.reject(error.response?.data || error);
    }
  );

  return instance;
};

// Export singleton instance
const axiosInstance = createAxiosService();
export default axiosInstance;
