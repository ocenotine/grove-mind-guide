
export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  account_type?: 'student' | 'admin' | 'teacher' | 'institution';
  institution_id?: string;
  institution_name?: string;
  domain?: string;
  document_count?: number;
  flashcard_count?: number;
  streak_count?: number;
  study_hours?: number;
  last_active?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface UserStats {
  documentCount: number;
  flashcardCount: number;
  streakCount: number;
  studyHours: number;
}
