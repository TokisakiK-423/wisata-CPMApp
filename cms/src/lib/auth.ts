export type AuthData = {
    token: string;
    role: "admin" | "customer";
  };
  
  export const saveAuth = (data: AuthData) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
  };
  
  export const getToken = (): string | null =>
    localStorage.getItem("token");
  
  export const getRole = (): string | null =>
    localStorage.getItem("role");
  
  export const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };