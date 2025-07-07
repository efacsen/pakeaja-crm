// Development authentication helper
// This bypasses Supabase's email validation for local development

interface DevUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
}

const STORAGE_KEY = 'pakeaja-dev-auth';

export const devAuth = {
  // Get current user from localStorage
  getCurrentUser: (): DevUser | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Sign up new user (stored in localStorage)
  signUp: async (email: string, password: string, fullName: string = '') => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For development, accept any email/password
    const user: DevUser = {
      id: `dev-${Date.now()}`,
      email,
      fullName,
      createdAt: new Date(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { user, error: null };
  },

  // Sign in existing user
  signIn: async (email: string, _password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For development, accept any credentials
    const user: DevUser = {
      id: `dev-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      createdAt: new Date(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { user, error: null };
  },

  // Sign out
  signOut: async () => {
    localStorage.removeItem(STORAGE_KEY);
    return { error: null };
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!devAuth.getCurrentUser();
  },
};