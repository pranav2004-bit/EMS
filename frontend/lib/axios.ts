import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true, // send HTTP-only cookies
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                const path = window.location.pathname;
                if (path.startsWith("/hr")) window.location.href = "/hr/login";
                else if (path.startsWith("/admin")) window.location.href = "/admin/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
