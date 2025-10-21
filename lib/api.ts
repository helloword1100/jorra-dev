import { AuthService } from "./auth";

const API_BASE_URL = "https://try-on-local.docwyn.com";
const NHB_BASE_URL = "https://nhb-dev-wtushxuzaa-lm.a.run.app/api/v1/";

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Request timed out. Please check your connection and try again."
      );
    }
    throw error;
  }
}

export interface Hairstyle {
  id: number;
  name: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string;
  uploaded_by: string;
  created_at: string;
}

export interface HairstylesResponse {
  hairstyles: Hairstyle[];
  total: number;
  offset: number;
  limit: number;
}

export interface Generation {
  id: number;
  result_url: string;
  hairstyle?: {
    id: number;
    name: string;
    image_url: string;
  };
  created_at: string;
}

export interface GenerationsResponse {
  generations: Generation[];
  total: number;
}

export interface Share {
  id: number;
  generation_id: number;
  platform: string;
  share_url: string;
  share_token: string;
  created_at: string;
  result_url?: string;
}

export interface SharesResponse {
  shares: Share[];
  total: number;
}

export interface TryOnRequest {
  id: number;
  user_id: number;
  username?: string;
  requested_amount: number;
  reason: string;
  status: "pending" | "approved" | "denied";
  created_at: string;
  reviewed_by?: number;
  reviewed_at?: string;
}

export interface TryOnRequestsResponse {
  requests: TryOnRequest[];
  total: number;
}

export class HairstyleService {
  static async getNHBHairstyles() {
    const url = `${NHB_BASE_URL}hairstyles/hair/public`;
    try {
      const response = await fetchWithTimeout(
        url,
        { method: "GET", redirect: "follow" },
        10000
      );
      if (!response.ok) {
        throw new Error(`NHB API error: ${response.status}`);
      }

      const raw = await response.json();

      // NHB returns { status, message, data: [ ... ] }
      const items = Array.isArray(raw?.data) ? raw.data : raw?.hairstyles ?? [];

      console.log("items hh", items);

      const hairstyles = (items || []).map((h: any, idx: number) => {
        return {
          id: h?.id,
          name: h.name ?? "",
          description: h.description ?? "",
          category: h.category ?? "",
          tags: Array.isArray(h.tags) ? h.tags : [],
          image_url:
            (h.thumbnail && (h.thumbnail.url || h.thumbnail.path)) ||
            h.image_url ||
            "",
          uploaded_by: h.uploadedBy || h.uploaded_by || "",
          created_at: h.createdAt || h.created_at || new Date().toISOString(),
        };
      });

      const transformed: HairstylesResponse = {
        hairstyles,
        total: hairstyles.length,
        offset: 0,
        limit: hairstyles.length,
      };

      return transformed;
    } catch (error) {
      console.log("[v0] getNHBHairstyles failed:", error);
      return {
        hairstyles: [],
        total: 0,
        offset: 0,
        limit: 0,
      };
    }
  }

  static async getHairstyles(params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<HairstylesResponse> {
    const searchParams = new URLSearchParams();

    if (params?.category) searchParams.append("category", params.category);
    if (params?.search) searchParams.append("search", params.search);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    try {
      console.log(
        "[v0] Fetching hairstyles from:",
        `${API_BASE_URL}/hairstyles?${searchParams}`
      );
      const response = await fetch(
        `${API_BASE_URL}/hairstyles?${searchParams}`,
        {
          headers: {
            ...AuthService.getAuthHeaders(),
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("[v0] Hairstyles API response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch hairstyles: ${response.status}`);
      }

      const data = await response.json();
      console.log("[v0] Hairstyles API success:", data);

      const transformedData = {
        ...data,
        hairstyles: data.hairstyles.map((hairstyle: Hairstyle) => ({
          ...hairstyle,
          image_url: hairstyle.image_url.startsWith("http")
            ? hairstyle.image_url
            : `${API_BASE_URL}${hairstyle.image_url}`,
        })),
      };

      return transformedData;
    } catch (error) {
      console.log("[v0] API failed, using fallback hairstyles data:", error);
      return {
        hairstyles: [
          {
            id: 1,
            name: "Classic Bob",
            description: "A timeless bob cut that works for any occasion",
            category: "Short",
            tags: ["classic", "professional", "easy-care"],
            image_url: "/classic-bob-hairstyle.jpg",
            uploaded_by: "admin",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Beach Waves",
            description: "Effortless wavy hair perfect for summer",
            category: "Medium",
            tags: ["casual", "wavy", "beachy"],
            image_url: "/beach-waves-hairstyle.jpg",
            uploaded_by: "admin",
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Long Layers",
            description: "Flowing layers that add movement and volume",
            category: "Long",
            tags: ["layered", "volume", "flowing"],
            image_url: "/long-layered-hairstyle.jpg",
            uploaded_by: "admin",
            created_at: new Date().toISOString(),
          },
        ],
        total: 3,
        offset: params?.offset || 0,
        limit: params?.limit || 10,
      };
    }
  }

  static async getCategories(): Promise<{
    categories: Array<{ id: number; name: string; description?: string }>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          ...AuthService.getAuthHeaders(),
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("[v0] API failed, using fallback categories:", error);
      return {
        categories: [
          { id: 1, name: "Short", description: "Short hairstyles" },
          { id: 2, name: "Medium", description: "Medium length hairstyles" },
          { id: 3, name: "Long", description: "Long hairstyles" },
          { id: 4, name: "Curly", description: "Curly hairstyles" },
          { id: 5, name: "Straight", description: "Straight hairstyles" },
          { id: 6, name: "Wavy", description: "Wavy hairstyles" },
        ],
      };
    }
  }

  static async getHairstyle(id: number): Promise<Hairstyle> {
    const response = await fetch(`${API_BASE_URL}/hairstyles/${id}`, {
      headers: AuthService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch hairstyle");
    }

    return response.json();
  }

  static async addHairstyle(data: {
    name: string;
    description?: string;
    category_id?: number;
    tags: string[];
    image: File;
  }): Promise<Hairstyle> {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.category_id)
      formData.append("category_id", data.category_id.toString());
    formData.append("tags", JSON.stringify(data.tags));
    formData.append("image", data.image);

    const response = await fetch(`${API_BASE_URL}/hairstyles/add`, {
      method: "POST",
      headers: {
        ...AuthService.getAuthHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to add hairstyle");
    }

    return response.json();
  }

  static async deleteHairstyle(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/hairstyles/${id}`, {
      method: "DELETE",
      headers: AuthService.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete hairstyle");
    }
  }
}

export class TryOnService {
  static async applyHairstyleById(
    hairstyleId: number,
    selfieFile: File
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append("selfie", selfieFile);

    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/apply-hairstyle/${hairstyleId}`,
        {
          method: "POST",
          headers: AuthService.getAuthHeaders(),
          body: formData,
        },
        120000 // 2 minute timeout for generation
      );

      if (!response.ok) {
        let errorMessage = "Failed to generate hairstyle";
        try {
          const error = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          // If response is not JSON, use default message
        }

        if (response.status === 504 || response.status === 408) {
          throw new Error(
            "The server took too long to respond. Please try again."
          );
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again in a moment.");
        } else if (response.status === 429) {
          throw new Error(
            "Too many requests. Please wait a moment and try again."
          );
        }

        throw new Error(errorMessage);
      }

      return response.blob();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }

  static async applyHairstyleWithUpload(
    selfieFile: File,
    hairstyleFile: File
  ): Promise<Blob> {
    const formData = new FormData();
    formData.append("selfie", selfieFile);
    formData.append("hairstyle", hairstyleFile);

    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/apply-hairstyle/`,
        {
          method: "POST",
          headers: AuthService.getAuthHeaders(),
          body: formData,
        },
        120000 // 2 minute timeout for generation
      );

      if (!response.ok) {
        let errorMessage = "Failed to generate hairstyle";
        try {
          const error = await response.json();
          errorMessage = error.detail || errorMessage;
        } catch {
          // Use default message
        }
        throw new Error(errorMessage);
      }

      return response.blob();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }

  static async getMyGenerations(params?: {
    limit?: number;
    offset?: number;
  }): Promise<GenerationsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    try {
      const response = await fetch(
        `${API_BASE_URL}/my-generations?${searchParams}`,
        {
          headers: AuthService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch generations");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("[v0] API failed, using fallback generations data:", error);
      return {
        generations: [
          {
            id: 1,
            result_url: "/hairstyle-generation-result.jpg",
            hairstyle: {
              id: 1,
              name: "Classic Bob",
              image_url: "/classic-bob-hairstyle.jpg",
            },
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: 2,
            result_url: "/beach-waves-generation-result.jpg",
            hairstyle: {
              id: 2,
              name: "Beach Waves",
              image_url: "/beach-waves-hairstyle.jpg",
            },
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
        ],
        total: 2,
      };
    }
  }

  static async generateVideo(generationId: number): Promise<Blob> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/generate-video/${generationId}`,
        {
          method: "POST",
          headers: AuthService.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to generate video");
      }

      return response.blob();
    } catch (error) {
      console.log("[v0] Video generation API failed:", error);
      throw new Error("Video generation is currently unavailable");
    }
  }

  static async claimSocialMediaBonus(
    postUrl: string
  ): Promise<{ success: boolean; credits_added: number }> {
    try {
      const formData = new FormData();
      formData.append("post_url", postUrl);

      const response = await fetch(`${API_BASE_URL}/claim-social-bonus`, {
        method: "POST",
        headers: AuthService.getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to claim social media bonus");
      }

      return response.json();
    } catch (error) {
      console.log("[v0] Social media bonus API failed:", error);
      throw new Error("Social media bonus claim failed");
    }
  }

  static async resetTryOns(): Promise<{ message: string; try_ons: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-tryons`, {
        method: "POST",
        headers: {
          ...AuthService.getAuthHeaders(),
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to reset try-ons");
      }

      return response.json();
    } catch (error) {
      console.log("[v0] Reset try-ons API failed:", error);
      throw new Error("Failed to reset try-ons");
    }
  }

  static async shareGeneration(
    generationId: number,
    platform: string
  ): Promise<{
    message: string;
    share_url: string;
    share_token: string;
  }> {
    const formData = new FormData();
    formData.append("platform", platform);

    const response = await fetch(
      `${API_BASE_URL}/share-generation/${generationId}`,
      {
        method: "POST",
        headers: AuthService.getAuthHeaders(),
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to share generation");
    }

    return response.json();
  }

  static async getSharedGeneration(shareToken: string): Promise<{
    image_url: string;
    platform: string;
    shared_at: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/shared/${shareToken}`);

    if (!response.ok) {
      throw new Error("Shared generation not found");
    }

    return response.json();
  }

  static async getMyShares(params?: {
    limit?: number;
    offset?: number;
  }): Promise<SharesResponse> {
    const searchParams = new URLSearchParams();

    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/my-shares?${searchParams}`, {
      headers: AuthService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch shares");
    }

    return response.json();
  }

  static async requestTryOnIncrease(
    requestedAmount: number,
    reason: string
  ): Promise<{
    message: string;
    request_id: number;
  }> {
    const formData = new FormData();
    formData.append("requested_amount", requestedAmount.toString());
    formData.append("reason", reason);

    const response = await fetch(`${API_BASE_URL}/request-tryon-increase`, {
      method: "POST",
      headers: AuthService.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to submit request");
    }

    return response.json();
  }
}

export class AdminService {
  static async getTryOnRequests(params?: {
    status?: "pending" | "approved" | "denied";
    limit?: number;
    offset?: number;
  }): Promise<TryOnRequestsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.append("status", params.status);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const response = await fetch(
      `${API_BASE_URL}/admin/tryon-requests?${searchParams}`,
      {
        headers: AuthService.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch requests");
    }

    return response.json();
  }

  static async approveTryOnRequest(requestId: number): Promise<{
    message: string;
    new_try_ons: number;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/admin/approve-tryon-request/${requestId}`,
      {
        method: "PUT",
        headers: AuthService.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to approve request");
    }

    return response.json();
  }

  static async denyTryOnRequest(requestId: number): Promise<{
    message: string;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/admin/deny-tryon-request/${requestId}`,
      {
        method: "PUT",
        headers: AuthService.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to deny request");
    }

    return response.json();
  }
}

export class CategoryService {
  static async getCategories(): Promise<{
    categories: Array<{ id: number; name: string; description?: string }>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          ...AuthService.getAuthHeaders(),
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("[v0] Categories API failed, using fallback:", error);
      return {
        categories: [
          { id: 1, name: "Short", description: "Short hairstyles" },
          { id: 2, name: "Medium", description: "Medium length hairstyles" },
          { id: 3, name: "Long", description: "Long hairstyles" },
          { id: 4, name: "Curly", description: "Curly hairstyles" },
          { id: 5, name: "Straight", description: "Straight hairstyles" },
          { id: 6, name: "Wavy", description: "Wavy hairstyles" },
        ],
      };
    }
  }

  static async createCategory(
    name: string,
    description?: string
  ): Promise<{ id: number; name: string; description?: string }> {
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);

    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: AuthService.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create category");
    }

    return response.json();
  }
}
