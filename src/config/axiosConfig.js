import axios from "axios";
import { store } from "../redux/store";
import { getItemFromStore } from "../utils";
import { toastify } from "../components/toast";
import { logoutThunkMiddleware } from "../redux/features/user";

const getToken = () => {
  return getItemFromStore("konceptLawToken");
};

const setCustomizedHeaders = (contentType = "application/json") => {
  const token = getToken();
  return {
    "Content-Type": contentType,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const createAxiosInstance = (config = {}) => {
  const {
    base = import.meta.env.VITE_SERVER_URL,
    initialLoader = false,
    showAlert = true,
  } = config;

  const axiosInstance = axios.create({
    baseURL: base,
    headers: setCustomizedHeaders(),
    credentials: "include",
    ...config,
  });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (requestConfig) => {
      const contentType =
        requestConfig.headers["Content-Type"] || "application/json";
      requestConfig.headers = setCustomizedHeaders(contentType);
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  let hasForbiddenErrorOccurred = false;
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      console.error(error);

      if (error.response?.status === 403 && !hasForbiddenErrorOccurred) {
        hasForbiddenErrorOccurred = true;
        toastify({ msg: "Token Expired, Login Now!", type: "error" });
        localStorage.clear();
        store.dispatch(logoutThunkMiddleware());
      } else if (hasForbiddenErrorOccurred) {
        return new Promise(() => {}); // This creates a promise that neither resolves nor rejects, effectively halting further processing.
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;
