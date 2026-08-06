/**
 * Follow Up - iOS-inspired Progressive Web App (PWA)
 * Developer: Polivector
 * Copyright: 2026 Mayank Patidar
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Followup, Todo, Profile, AuthSession } from './types';
import {
  getStoredSession,
  clearSession,
  getFollowups,
  addFollowup,
  toggleFollowupCompletion,
  deleteFollowup,
  getTodos,
  addTodo,
  toggleTodoCompletion,
  deleteTodo,
  updateTodoOrder,
  updateProfilePush,
  updatePassword,
  resetProfileData,
  deleteAccount
} from './lib/storage';
import { registerServiceWorker, checkAndNotifyUpcomingFollowups } from './lib/notifications';

import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { AddClientView } from './components/AddClientView';
import { ClientDetailView } from './components/ClientDetailView';
import { TodoView } from './components/TodoView';
import { SettingsView } from './components/SettingsView';
import { AboutView } from './components/AboutView';
import { PrivacyView } from './components/PrivacyView';
import { AuthModal } from './components/AuthModal';
import { LoginView } from './components/LoginView';

export default function App() {
  // Check localStorage on mount for active 48-hour persistent session
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedClient, setSelectedClient] = useState<Followup | null>(null);

  // Data states
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'forgot-credentials'>('login');

  // Register PWA service worker on mount
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Fresh fetch of user's data from Supabase whenever session updates
  const loadFreshData = useCallback(async (userId: string, pushEnabled: boolean) => {
    setLoadingData(true);
    try {
      const [fData, tData] = await Promise.all([
        getFollowups(userId),
        getTodos(userId)
      ]);
      setFollowups(fData);
      setTodos(tData);

      // Check upcoming reminders for notifications
      checkAndNotifyUpcomingFollowups(fData, pushEnabled);
    } catch (e) {
      console.error('Error fetching live Supabase data:', e);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadFreshData(session.user.id, session.user.push_enabled);
    } else {
      setFollowups([]);
      setTodos([]);
    }
  }, [session, loadFreshData]);

  const user = session?.user || null;

  // Login / Session Handler
  const handleAuthSuccess = (updatedUser?: Profile) => {
    const currentSession = getStoredSession();
    setSession(currentSession);
    setActiveTab('home');
    if (currentSession?.user) {
      loadFreshData(currentSession.user.id, currentSession.user.push_enabled);
    }
  };

  // Handlers
  const handleAddClient = async (data: Omit<Followup, 'id' | 'created_at' | 'is_completed'>) => {
    if (!user) return;
    await addFollowup({ ...data, user_id: user.id });
    const updated = await getFollowups(user.id);
    setFollowups(updated);
    setActiveTab('home');
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await toggleFollowupCompletion(id, currentStatus);
    if (user) {
      const updated = await getFollowups(user.id);
      setFollowups(updated);
    }
  };

  const handleDeleteClient = async (id: string) => {
    await deleteFollowup(id);
    if (user) {
      const updated = await getFollowups(user.id);
      setFollowups(updated);
    }
    setSelectedClient(null);
    setActiveTab('home');
  };

  const handleRefreshClientList = async () => {
    if (user) {
      const updated = await getFollowups(user.id);
      setFollowups(updated);
    }
  };

  // Todo Handlers
  const handleAddTodo = async (taskName: string) => {
    if (!user) return;
    await addTodo(user.id, taskName);
    const updated = await getTodos(user.id);
    setTodos(updated);
  };

  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    await toggleTodoCompletion(id, currentStatus);
    if (user) {
      const updated = await getTodos(user.id);
      setTodos(updated);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    if (user) {
      const updated = await getTodos(user.id);
      setTodos(updated);
    }
  };

  const handleReorderTodos = async (newTodos: Todo[]) => {
    setTodos(newTodos);
    await updateTodoOrder(newTodos);
  };

  // Account & Settings Handlers
  const handleUpdatePush = async (enabled: boolean) => {
    if (!user) return;
    await updateProfilePush(user.id, enabled);
    setSession(getStoredSession());
  };

  const handleUpdatePassword = async (newPass: string) => {
    if (!user) return;
    await updatePassword(user.id, newPass);
    setSession(getStoredSession());
  };

  const handleResetProfile = () => {
    if (!user) return;
    resetProfileData(user.id);
    setFollowups([]);
    setTodos([]);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    await deleteAccount(user.id);
    setSession(null);
    setFollowups([]);
    setTodos([]);
    setActiveTab('home');
  };

  const handleLogout = async () => {
    await clearSession();
    setSession(null);
    setFollowups([]);
    setTodos([]);
    setActiveTab('home');
  };

  // Tab routing
  const renderTabContent = () => {
    if (activeTab === 'login') {
      return (
        <AuthModal
          initialView="login"
          onSuccess={handleAuthSuccess}
          onCancel={() => setActiveTab('home')}
        />
      );
    }

    if (activeTab === 'forgot-credentials') {
      return (
        <AuthModal
          initialView="forgot-credentials"
          onSuccess={handleAuthSuccess}
          onCancel={() => setActiveTab('home')}
        />
      );
    }

    switch (activeTab) {
      case 'add-client':
        return (
          <AddClientView
            userId={user?.id || ''}
            onAddClient={handleAddClient}
            onCancel={() => setActiveTab('home')}
          />
        );

      case 'client-detail':
        if (!selectedClient) {
          return (
            <HomeView
              followups={followups}
              loading={loadingData}
              onSelectClient={(client) => {
                setSelectedClient(client);
                setActiveTab('client-detail');
              }}
              onAddClientClick={() => setActiveTab('add-client')}
              onToggleComplete={handleToggleComplete}
            />
          );
        }
        return (
          <ClientDetailView
            client={selectedClient}
            onToggleComplete={(id, status) => handleToggleComplete(id, status)}
            onDeleteClient={handleDeleteClient}
            onBack={() => {
              setSelectedClient(null);
              handleRefreshClientList();
              setActiveTab('home');
            }}
          />
        );

      case 'todo':
        return (
          <TodoView
            todos={todos}
            loading={loadingData}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onReorderTodos={handleReorderTodos}
          />
        );

      case 'settings':
        return (
          <SettingsView
            user={user}
            onUpdatePush={handleUpdatePush}
            onUpdatePassword={handleUpdatePassword}
            onResetProfile={handleResetProfile}
            onDeleteAccount={handleDeleteAccount}
            onOpenLogin={() => {
              setAuthModalInitialView('login');
              setShowAuthModal(true);
            }}
          />
        );

      case 'about':
        return <AboutView />;

      case 'privacy':
        return <PrivacyView />;

      case 'home':
      default:
        return (
          <HomeView
            followups={followups}
            loading={loadingData}
            onSelectClient={(client) => {
              setSelectedClient(client);
              setActiveTab('client-detail');
            }}
            onAddClientClick={() => setActiveTab('add-client')}
            onToggleComplete={handleToggleComplete}
          />
        );
    }
  };

  // If no active 48-hour session in localStorage, show Login Screen directly
  if (!session) {
    return (
      <div className="min-h-dvh bg-[#F2F2F7] text-slate-900 flex flex-col antialiased max-w-[500px] mx-auto border-x border-slate-200 relative shadow-2xl overflow-hidden">
        <LoginView onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#0A0A0C] text-white flex flex-col antialiased selection:bg-[#007AFF]/30 selection:text-white max-w-[500px] mx-auto border-x border-[#2C2C2E] relative shadow-2xl">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 w-full">
        {renderTabContent()}
      </main>

      {/* In-App Auth Modal */}
      {showAuthModal && (
        <AuthModal
          initialView={authModalInitialView}
          onSuccess={(u) => {
            handleAuthSuccess(u);
            setShowAuthModal(false);
          }}
          onCancel={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
