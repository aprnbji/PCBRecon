const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Project {
  id: number;
  name: string;
  image_path: string;
  image_base64: string;
  analysis: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  project_id: number;
  sender: string;
  message: string;
  created_at: string;
}

export interface ProjectWithMessages extends Project {
  chat_messages: ChatMessage[];
}

export interface CreateProjectData {
  name: string;
  image_path: string;
  image_base64: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(id: number): Promise<ProjectWithMessages> {
    return this.request<ProjectWithMessages>(`/projects/${id}`);
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number): Promise<{ status: string }> {
    return this.request<{ status: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat
  async getChatMessages(projectId: number): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/projects/${projectId}/chat`);
  }

  async sendChatMessage(projectId: number, message: string): Promise<ChatMessage> {
    return this.request<ChatMessage>(`/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Health checks
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }

  async readinessCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/ready');
  }
}

export const api = new ApiClient(API_BASE_URL);