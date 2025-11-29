import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export interface User {
  id: number;
  email: string;
  username: string;
  profile_name?: string;
  profile_image_url?: string;
  achievements?: Record<string, any>;
  tier?: string;
  titles?: string[];
  cupcake_points?: number;
  level?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

class AuthService {
  private tokenKey = 'auth_token';

  async register(email: string, username: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      username,
      password,
    });

    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getCurrentUser(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  }

  async updateProfile(data: { profile_name?: string; profile_image_url?: string }): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    await axios.put(`${API_URL}/auth/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new AuthService();
