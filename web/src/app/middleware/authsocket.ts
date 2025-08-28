/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { refreshToken } from "../login/auth.service";
import { usePathname } from "next/navigation";

let socket: any = null;
let lastToken: string | null = null;
let isRefreshing = false;

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Math.floor(Date.now() / 1000) - 5;
  } catch {
    // Treat invalid token as expired to force refresh/login
    return true;
  }
};

export const useAuthSocket = () => {
  const pathname = usePathname();

  const connectSocket = useCallback((token: string) => {
    if (socket?.connected) {
      if (token !== lastToken) {
        socket.emit("authenticate", { token });
        lastToken = token;
      }
      return;
    }

    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("authenticate", { token });
      lastToken = token;
    });

    socket.on("authenticated", (data: { userId: string }) => {
      console.log("Authenticated:", data.userId);
    });

    socket.on("token_expired", () => refreshAccessToken(true));
    socket.on("token_invalid", () => refreshAccessToken(true));

    socket.on(
      "token_refreshed",
      (payload: {
        tokens: { accessToken?: string; refreshToken?: string };
        user?: any;
      }) => {
        const oldRefresh = localStorage.getItem("refreshToken") || "";
        const oldUser = localStorage.getItem("userInfo") || "{}";

        const accessToken =
          payload.tokens.accessToken ||
          localStorage.getItem("accessToken") ||
          "";
        const refreshTokenNew = payload.tokens.refreshToken || oldRefresh;
        const userInfo = payload.user ? JSON.stringify(payload.user) : oldUser;

        // Cập nhật tất cả
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshTokenNew);
        localStorage.setItem("userInfo", userInfo);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        lastToken = accessToken;
      }
    );

    socket.on("refresh_failed", logout);
  }, []);

  const refreshAccessToken = useCallback(
    async (forceLogout = true) => {
      if (isRefreshing) return;
      isRefreshing = true;

      const oldRefresh = localStorage.getItem("refreshToken") || "";
      const oldUser = localStorage.getItem("userInfo") || "{}";

      if (!oldRefresh) {
        if (forceLogout) logout();
        isRefreshing = false;
        return;
      }

      try {
        const res = await refreshToken({ token: oldRefresh });

        if (res?.status === 401) {
          logout();
          return;
        }

        const tokens = res?.data?.data?.tokens || res?.data?.tokens || {};
        const user = res?.data?.data?.result || res?.data?.data.result;

        const accessToken =
          tokens.accessToken || localStorage.getItem("accessToken") || "";
        const refreshTokenNew = tokens.refreshToken || oldRefresh;
        const userInfo = user ? JSON.stringify(user) : oldUser;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshTokenNew);
        localStorage.setItem("userInfo", userInfo);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        lastToken = accessToken;
        connectSocket(accessToken);
      } catch {
        logout();
      } finally {
        isRefreshing = false;
      }
    },
    [connectSocket]
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshTk = localStorage.getItem("refreshToken");

    if (pathname === "/login" && (!accessToken || !refreshTk)) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      lastToken = null;
      isRefreshing = false;
      return;
    }

    const initAuth = async () => {
      if (accessToken && !isTokenExpired(accessToken)) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        connectSocket(accessToken);
      } else if (refreshTk) {
        await refreshAccessToken(true);
      }
    };

    initAuth();

    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });

    // Attempt refresh on 401 once, then retry original request
    let refreshInFlight: Promise<void> | null = null;
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error?.config || {};
        if (error?.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshTk = localStorage.getItem("refreshToken") || "";
          if (!refreshTk) {
            logout();
            return Promise.reject(error);
          }

          if (!refreshInFlight) {
            refreshInFlight = (async () => {
              try {
                const res = await refreshToken({ token: refreshTk });
                const tokens = res?.data?.data?.tokens || res?.data?.tokens || {};
                const user = res?.data?.data?.result || res?.data?.data?.result;
                const accessToken = tokens.accessToken || localStorage.getItem("accessToken") || "";
                const refreshTokenNew = tokens.refreshToken || refreshTk;
                const oldUser = localStorage.getItem("userInfo") || "{}";
                const userInfo = user ? JSON.stringify(user) : oldUser;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshTokenNew);
                localStorage.setItem("userInfo", userInfo);
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                lastToken = accessToken;
                connectSocket(accessToken);
              } catch (e) {
                logout();
                throw e;
              } finally {
                refreshInFlight = null;
              }
            })();
          }

          try {
            await refreshInFlight;
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
            };
            return axios(originalRequest);
          } catch (e) {
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [connectSocket, refreshAccessToken, pathname]);
};

export const logout = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  lastToken = null;
  isRefreshing = false;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userInfo");
  window.location.href = "/login";
};