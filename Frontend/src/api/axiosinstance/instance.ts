import axios from "axios";
import store, { persistor } from "../../redux/store";
import { refreshToken } from "../user/userApi";
import { addUser, removeUser } from "../../redux/user/userSlice";

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


// ✅ Attach access token to every request
Axios.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ✅ Refresh token logic
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}


// ✅ Response interceptor
Axios.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalReq = error.config;

    // ✅ Access token expired
    if (error.response?.status === 401 && !originalReq._retry) {

      originalReq._retry = true;

      // If already refreshing, queue request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalReq.headers["Authorization"] = `Bearer ${token}`;
            resolve(Axios(originalReq));
          });
        });
      }

      isRefreshing = true;

      try {

        // call refresh endpoint
        const response = await refreshToken();

        const newAccessToken = response.accessToken;

        const currentUser = store.getState().auth;

        // update redux with new token
        store.dispatch(
          addUser({
            id: currentUser.id,
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            token: newAccessToken,
          })
        );

        // update axios default header
        Axios.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        isRefreshing = false;

        // resolve queued requests
        onRefreshed(newAccessToken);

        // retry original request
        originalReq.headers["Authorization"] =
          `Bearer ${newAccessToken}`;

        return Axios(originalReq);

      } catch (err) {

        isRefreshing = false;

        store.dispatch(removeUser());
        persistor.purge();

        window.location.href = "/login";

        return Promise.reject(err);
      }
    }


    // Forbidden
    if (error.response?.status === 403) {

      store.dispatch(removeUser());
      persistor.purge();

      window.location.href = "/login";

      return Promise.reject(error);
    }


    return Promise.reject(error);
  }
);
