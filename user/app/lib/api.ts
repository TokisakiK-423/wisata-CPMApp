import { Platform } from "react-native";

const DEFAULT_API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://10.0.2.2:3000";

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

export const API_BASE_URL = normalizeBaseUrl(
  process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL,
);

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiImageUrl = (path?: string | null) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return apiUrl(path);
};
