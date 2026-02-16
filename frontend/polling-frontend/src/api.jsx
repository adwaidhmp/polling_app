import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Attach token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Response interceptor for refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          if (res.status === 200) {
            const newAccessToken = res.data.access;
            
            // Update local storage
            localStorage.setItem("access", newAccessToken);
            
            // Update header for original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            // Update default header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, logout user
          console.error("Token refresh failed:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;