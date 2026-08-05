export interface Profile {
  id: string;
  username: string;
  mobile_number: string;
  password?: string; // Stored securely for in-app retrieval & password verification
  push_enabled: boolean;
  created_at: string;
}

export interface Followup {
  id: string;
  user_id: string;
  client_name: string;
  followup_date: string; // ISO String
  notes: string;
  location: string;
  is_completed: boolean;
  created_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  task_name: string;
  is_completed: boolean;
  position_order: number;
  created_at: string;
}

export interface AuthSession {
  user: Profile;
  loggedInAt: number; // Timestamp in ms
  expiresAt: number;  // Timestamp in ms (48 hours from login)
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export type ActiveTab = 
  | 'home' 
  | 'add-client' 
  | 'client-detail' 
  | 'todo' 
  | 'settings' 
  | 'about' 
  | 'privacy' 
  | 'sql-guide'
  | 'login'
  | 'forgot-credentials';
