import Cookies from "js-cookie";

type TokenRole = "customer" | "vendor" | "admin";

const tokenKeysByRole: Record<TokenRole, string> = {
  customer: "customerToken",
  vendor: "vendorToken",
  admin: "adminToken",
};

const allStorageKeys = ["token", "customerToken", "vendorToken", "adminToken"];

export const getToken = (role?: TokenRole): string | null => {
  if (typeof window === "undefined") return null;

  if (role) {
    return (
      Cookies.get(tokenKeysByRole[role]) ||
      Cookies.get("token") ||
      localStorage.getItem(tokenKeysByRole[role]) ||
      localStorage.getItem("token")
    );
  }

  return (
    Cookies.get("token") ||
    Cookies.get("customerToken") ||
    Cookies.get("vendorToken") ||
    Cookies.get("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("customerToken") ||
    localStorage.getItem("vendorToken") ||
    localStorage.getItem("adminToken")
  );
};

export const setToken = (token: string, role?: TokenRole) => {
  if (typeof window === "undefined" || !token) {
    console.warn("setToken called in server context or with empty token value");
    return;
  }

  Cookies.set("token", token);
  localStorage.setItem("token", token);

  if (role) {
    const roleKey = tokenKeysByRole[role];
    Cookies.set(roleKey, token);
    localStorage.setItem(roleKey, token);
  }
};

export const clearToken = () => {
  if (typeof window === "undefined") return;

  allStorageKeys.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("userRole");

  allStorageKeys.forEach((key) => Cookies.remove(key));
  Cookies.remove("userRole");
};
