import axios from "axios";
import { notifyUnauthorized } from "./notify";

const BASE_URL = "http://localhost:8080";

const apiClient = axios.create({
    baseURL: BASE_URL,
});

// Attach the JWT to every outgoing request, if we have one
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ems_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token is missing/invalid/expired - the session itself isn't valid anymore.
            localStorage.removeItem("ems_token");
            localStorage.removeItem("ems_username");
            localStorage.removeItem("ems_role");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        } else if (status === 403) {
            // Session is valid, the user just isn't allowed to do this (e.g. a
            // read-only USER hitting a write endpoint). Show the popup instead
            // of logging them out - they're still legitimately signed in.
            notifyUnauthorized(error.response?.data?.error);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
