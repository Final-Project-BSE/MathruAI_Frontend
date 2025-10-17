"use server";

import { getSession } from "@/lib/authentication";
import axios, { AxiosError } from "axios";

const axiosService = () => {
  const defaultOptions = {
    baseURL: process.env.BASE_URL,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();

    if (session) {
      request.headers.Authorization = `Bearer ${session.user.token}`;
    }

    // request.headers.Authorization = `Bearer ${process.env.TOKEN}`;

    if (process.env.ENABLE_AXIOS_LOGS === "true") {
      console.log(
        "Request:",
        request.method?.toUpperCase(),
        request.url,
        request.data
      );
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log((error as AxiosError).response?.data);

      return Promise.reject(error.response?.data);
    }
  );

  return instance;
};

export default axiosService();
