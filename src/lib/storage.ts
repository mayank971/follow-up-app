import { Profile, Followup, Todo, AuthSession } from '../types';
import { supabase } from './supabase';

// 48 hours in milliseconds
const SESSION_DURATION_MS = 48 * 60 * 60 * 1000;

// In-memory session tracking (Strictly no localStorage or IndexedDB)
let activeSession: AuthSession | null = null;

// Default demo user & initial seed data if table is empty for demo login
const DEFAULT_DEMO_USER: Profile = {
  id: 'demo-user-123',
  username: 'polivector',
  mobile_number: '9171266305',
  password: 'followup2026',
  push_enabled: true,
  created_at: new Date().toISOString()
};

const SAMPLE_FOLLOWUPS: Followup[] = [
  {
    id: 'f-1',
    user_id: 'demo-user-123',
    client_name: 'Alexander Wright (Senior Tech Lead @ Nova Software Corp)',
    followup_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Review enterprise SLA contract and final architectural proposal.',
    location: 'Coffee House, Downtown San Francisco',
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'f-2',
    user_id: 'demo-user-123',
    client_name: 'Sophia Martinez (Creative Director)',
    followup_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Discuss brand identity refresh and iOS design system guidelines.',
    location: 'Google Meet',
    is_completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'f-3',
    user_id: 'demo-user-123',
    client_name: 'Marcus Brody & Associates',
    followup_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Q3 financial audit check-in and investment roadmap approval.',
    location: '100 Financial Center Suite 400',
    is_completed: false,
    created_at: new Date().toISOString()
  }
];

const SAMPLE_TODOS: Todo[] = [
  {
    id: 't-1',
    user_id: 'demo-user-123',
    task_name: 'Prepare Q3 Follow-up Slide Deck',
    is_completed: false,
    position_order: 1,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 't-2',
    user_id: 'demo-user-123',
    task_name: 'Send agreement contracts to Alexander Wright',
    is_completed: true,
    position_order: 2,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 't-3',
    user_id: 'demo-user-123',
    task_name: 'Schedule Zoom link for Sophia Martinez meeting',
    is_completed: false,
    position_order: 3,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// ==========================================
// IN-MEMORY SESSION MANAGEMENT (48h Rule)
// ==========================================

export function getStoredSession(): AuthSession | null {
  if (!activeSession) return null;
  const now = Date.now();
  if (now > activeSession.expiresAt || (now - activeSession.loggedInAt) > SESSION_DURATION_MS) {
    activeSession = null;
    return null;
  }
  return activeSession;
}

export function saveSession(user: Profile): AuthSession {
  const now = Date.now();
  const session: AuthSession = {
    user,
    loggedInAt: now,
    expiresAt: now + SESSION_DURATION_MS
  };
  activeSession = session;
  return session;
}

export function clearSession(): void {
  activeSession = null;
}

// ==========================================
// SUPABASE AUTH & USER PROFILE OPERATIONS
// ==========================================

export async function loginUser(username: string, password: string): Promise<{ success: boolean; user?: Profile; error?: string }> {
  const cleanUsername = username.trim().toLowerCase();

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', cleanUsername)
      .maybeSingle();

    if (error) {
      console.warn('Supabase profile select error:', error.message);
    }

    if (data && data.password === password) {
      saveSession(data);
      return { success: true, user: data };
    }

    // Special handling for demo login if user table hasn't been seeded yet
    if (cleanUsername === 'polivector' && password === 'followup2026') {
      try {
        const { data: createdUser } = await supabase
          .from('profiles')
          .insert([DEFAULT_DEMO_USER])
          .select()
          .single();

        const user = createdUser || DEFAULT_DEMO_USER;
        // Seed initial sample followups & todos for demo account if empty
        await seedDemoData(user.id);
        saveSession(user);
        return { success: true, user };
      } catch (e) {
        saveSession(DEFAULT_DEMO_USER);
        return { success: true, user: DEFAULT_DEMO_USER };
      }
    }

    return { success: false, error: 'Invalid username or password.' };
  } catch (err: any) {
    console.error('Database connection error during login:', err);
    return { success: false, error: 'Could not connect to database server.' };
  }
}

export async function registerUser(username: string, mobileNumber: string, password: string): Promise<{ success: boolean; user?: Profile; error?: string }> {
  const cleanUsername = username.trim().toLowerCase();
  const cleanMobile = mobileNumber.trim();

  if (!cleanUsername || !cleanMobile || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  try {
    // Check if username already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', cleanUsername)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Username is already taken.' };
    }

    const newProfile: Profile = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'usr_' + Date.now(),
      username: cleanUsername,
      mobile_number: cleanMobile,
      password: password,
      push_enabled: false,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.error('Failed to register user in Supabase:', error);
      return { success: false, error: error.message };
    }

    const registeredUser = data || newProfile;
    saveSession(registeredUser);
    return { success: true, user: registeredUser };
  } catch (err: any) {
    console.error('Registration error:', err);
    return { success: false, error: err?.message || 'Database registration failure.' };
  }
}

export async function retrieveCredentials(username: string, mobileNumber: string): Promise<{ success: boolean; password?: string; error?: string }> {
  const cleanUsername = username.trim().toLowerCase();
  const cleanMobile = mobileNumber.trim();

  if (!cleanUsername || !cleanMobile) {
    return { success: false, error: 'Please enter both Username and Mobile Number.' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('password')
      .ilike('username', cleanUsername)
      .eq('mobile_number', cleanMobile)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (data && data.password) {
      return { success: true, password: data.password };
    }

    return { success: false, error: 'No matching account found with these credentials.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Database connection error.' };
  }
}

export async function updatePassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ password: newPassword })
      .eq('id', userId);

    if (!error) {
      if (activeSession && activeSession.user.id === userId) {
        activeSession.user.password = newPassword;
      }
      return true;
    }
  } catch (e) {
    console.error('Update password error:', e);
  }
  return false;
}

export async function updateProfilePush(userId: string, pushEnabled: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ push_enabled: pushEnabled })
      .eq('id', userId);

    if (!error) {
      if (activeSession && activeSession.user.id === userId) {
        activeSession.user.push_enabled = pushEnabled;
      }
      return true;
    }
  } catch (e) {
    console.error('Update push preference error:', e);
  }
  return false;
}

export async function deleteAccount(userId: string): Promise<boolean> {
  try {
    await supabase.from('followups').delete().eq('user_id', userId);
    await supabase.from('todos').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);
    clearSession();
    return true;
  } catch (e) {
    console.error('Delete account error:', e);
    return false;
  }
}

export async function resetProfileData(userId: string): Promise<void> {
  try {
    await supabase.from('followups').delete().eq('user_id', userId);
    await supabase.from('todos').delete().eq('user_id', userId);
  } catch (e) {
    console.error('Reset profile data error:', e);
  }
}

// Helper to seed initial sample records for demo user in Supabase
async function seedDemoData(userId: string) {
  try {
    const { data: existingFollowups } = await supabase.from('followups').select('id').eq('user_id', userId);
    if (!existingFollowups || existingFollowups.length === 0) {
      await supabase.from('followups').insert(SAMPLE_FOLLOWUPS);
    }

    const { data: existingTodos } = await supabase.from('todos').select('id').eq('user_id', userId);
    if (!existingTodos || existingTodos.length === 0) {
      await supabase.from('todos').insert(SAMPLE_TODOS);
    }
  } catch (e) {
    console.warn('Seed demo data skipped/handled:', e);
  }
}

// ==========================================
// FOLLOWUPS CRUD OPERATIONS (Direct Supabase)
// ==========================================

export async function getFollowups(userId: string): Promise<Followup[]> {
  try {
    const { data, error } = await supabase
      .from('followups')
      .select('*')
      .eq('user_id', userId)
      .order('followup_date', { ascending: true });

    if (error) {
      console.error('Fetch followups error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Error in getFollowups:', e);
    return [];
  }
}

export async function addFollowup(followup: Omit<Followup, 'id' | 'created_at' | 'is_completed'>): Promise<Followup | null> {
  const newFollowup: Followup = {
    ...followup,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'f_' + Date.now(),
    is_completed: false,
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('followups')
      .insert([newFollowup])
      .select()
      .single();

    if (error) {
      console.error('Add followup error:', error.message);
      return newFollowup;
    }
    return data || newFollowup;
  } catch (e) {
    console.error('Error adding followup:', e);
    return newFollowup;
  }
}

export async function toggleFollowupCompletion(id: string, currentCompleted: boolean): Promise<boolean> {
  const newCompleted = !currentCompleted;
  try {
    const { error } = await supabase
      .from('followups')
      .update({ is_completed: newCompleted })
      .eq('id', id);

    if (error) {
      console.error('Toggle followup completion error:', error.message);
    }
  } catch (e) {
    console.error('Error toggling followup completion:', e);
  }
  return newCompleted;
}

export async function deleteFollowup(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('followups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete followup error:', error.message);
    }
  } catch (e) {
    console.error('Error deleting followup:', e);
  }
  return true;
}

// ==========================================
// TODOS CRUD OPERATIONS (Direct Supabase)
// ==========================================

export async function getTodos(userId: string): Promise<Todo[]> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('position_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch todos error:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Error in getTodos:', e);
    return [];
  }
}

export async function addTodo(userId: string, taskName: string): Promise<Todo | null> {
  try {
    const { data: existing } = await supabase
      .from('todos')
      .select('position_order')
      .eq('user_id', userId)
      .order('position_order', { ascending: false })
      .limit(1);

    const nextOrder = existing && existing.length > 0 ? (existing[0].position_order || 0) + 1 : 1;

    const newTodo: Todo = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 't_' + Date.now(),
      user_id: userId,
      task_name: taskName,
      is_completed: false,
      position_order: nextOrder,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('todos')
      .insert([newTodo])
      .select()
      .single();

    if (error) {
      console.error('Add todo error:', error.message);
      return newTodo;
    }
    return data || newTodo;
  } catch (e) {
    console.error('Error adding todo:', e);
    return null;
  }
}

export async function toggleTodoCompletion(id: string, currentCompleted: boolean): Promise<boolean> {
  const newCompleted = !currentCompleted;
  try {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: newCompleted })
      .eq('id', id);

    if (error) {
      console.error('Toggle todo error:', error.message);
    }
  } catch (e) {
    console.error('Error toggling todo completion:', e);
  }
  return newCompleted;
}

export async function deleteTodo(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete todo error:', error.message);
    }
  } catch (e) {
    console.error('Error deleting todo:', e);
  }
  return true;
}

export async function updateTodoOrder(todos: Todo[]): Promise<void> {
  try {
    for (let i = 0; i < todos.length; i++) {
      const t = todos[i];
      const newOrder = i + 1;
      await supabase
        .from('todos')
        .update({ position_order: newOrder })
        .eq('id', t.id);
    }
  } catch (e) {
    console.error('Error updating todo order:', e);
  }
}
