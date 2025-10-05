interface User {
  username: string;
  try_ons: number;
  user_id: number;
}

interface AuthResponse {
  token: string;
  try_ons: number;
  username: string;
}

const API_BASE_URL = "https://try-on-local.docwyn.com"; // Fixed API URL to include "local" subdomain

export class AuthService {
  private static getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  private static setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  }

  private static removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
  }

  static async signup(
    username: string,
    password: string
  ): Promise<AuthResponse> {
    console.log("[v0] Making signup request to:", `${API_BASE_URL}/signup`);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      body: formData,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    console.log("[v0] Signup response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("[v0] Signup error response:", errorText);

      try {
        const error = JSON.parse(errorText);
        throw new Error(error.detail || "Signup failed");
      } catch {
        throw new Error("Signup failed - server error");
      }
    }

    const data = await response.json();
    console.log("[v0] Signup success, setting token");
    this.setToken(data.token);
    return data;
  }

  static async login(
    username: string,
    password: string
  ): Promise<AuthResponse> {
    console.log("[v0] Attempting login for:", username);

    console.log(
      "[v0] Making login request to:",
      `${API_BASE_URL}/authenticate`
    );
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/authenticate`, {
      method: "POST",
      body: formData,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    console.log("[v0] Login response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.log("[v0] Login error response:", errorText);

      try {
        const error = JSON.parse(errorText);
        throw new Error(error.detail || "Login failed");
      } catch {
        throw new Error("Login failed - server error");
      }
    }

    const data = await response.json();
    console.log("[v0] Login response:", data);
    console.log("[v0] Login success, setting token");
    this.setToken(data.token);
    return data;
  }

  static async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      console.log("[v0] No token found");
      return null;
    }

    try {
      console.log("[v0] Getting current user from:", `${API_BASE_URL}/me`);
      console.log("[v0] Using token:", token);

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      console.log("[v0] Get user response status:", response.status);
      console.log(
        "[v0] Get user response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log("[v0] Get user error response:", errorText);
        this.removeToken();
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.log(
          "[v0] Response is not JSON, got:",
          responseText.substring(0, 200)
        );
        this.removeToken();
        return null;
      }

      const userData = await response.json();
      console.log("[v0] Current user data:", userData);
      return userData;
    } catch (error) {
      console.log("[v0] Get user error:", error);
      this.removeToken();
      return null;
    }
  }

  static logout(): void {
    this.removeToken();
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
