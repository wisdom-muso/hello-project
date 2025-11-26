/**
 * Authentication Adapter
 * 
 * This adapter bridges the Next.js UI authentication with the original Hillfog 
 * session-based authentication system.
 */

export interface HillfogUser {
  id: string;
  account: string;
  empId: string;
  name: string;
  description?: string;
  jobTitle?: string;
  uploadOid?: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: HillfogUser;
  redirectUrl?: string;
}

export class AuthAdapter {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Check current session status
   */
  async checkSession(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/checkUserSession.action`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: 'Session check failed',
        };
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        return {
          success: true,
          user: this.transformUser(data.user),
        };
      }

      return {
        success: false,
        message: 'No active session',
      };
    } catch (error) {
      console.error('Session check failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Login with username and password
   */
  async login(account: string, password: string): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      formData.append('account', account);
      formData.append('password', password);

      const response = await fetch(`${this.baseUrl}/login.action`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        return {
          success: false,
          message: 'Login request failed',
        };
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          user: data.user ? this.transformUser(data.user) : undefined,
          message: data.message,
          redirectUrl: data.redirectUrl,
        };
      }

      return {
        success: false,
        message: data.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login error',
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/logout.action`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: 'Logout request failed',
        };
      }

      const data = await response.json();
      
      return {
        success: data.success !== false,
        message: data.message || 'Logged out successfully',
      };
    } catch (error) {
      console.error('Logout failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout error',
      };
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<HillfogUser | null> {
    const sessionResponse = await this.checkSession();
    return sessionResponse.success ? sessionResponse.user || null : null;
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(permission: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/checkPermission.action?permission=${permission}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.hasPermission === true;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  /**
   * Get user's menu/navigation permissions
   */
  async getUserMenu(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getUserMenu.action`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.menu || [];
    } catch (error) {
      console.error('Menu fetch failed:', error);
      return [];
    }
  }

  /**
   * Transform Hillfog user data to standardized format
   */
  private transformUser(userData: any): HillfogUser {
    return {
      id: userData.oid || userData.id,
      account: userData.account,
      empId: userData.empId,
      name: userData.name,
      description: userData.description,
      jobTitle: userData.jobTitle,
      uploadOid: userData.uploadOid,
      roles: userData.roles || [],
      permissions: userData.permissions || [],
    };
  }

  /**
   * Validate session and redirect if needed
   */
  async validateSession(): Promise<{ isValid: boolean; redirectUrl?: string }> {
    const sessionResponse = await this.checkSession();
    
    if (!sessionResponse.success) {
      return {
        isValid: false,
        redirectUrl: '/login',
      };
    }

    return {
      isValid: true,
    };
  }

  /**
   * Get CSRF token if needed
   */
  async getCsrfToken(): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/getCsrfToken.action`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.token || null;
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
      return null;
    }
  }
}

// Create singleton instance
export const authAdapter = new AuthAdapter();