/**
 * Follow Up - iOS-inspired Progressive Web App (PWA)
 * Developer: Polivector
 * Copyright: 2026 Mayank Patidar
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Followup, Todo, Profile } from './types';
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
  const [session, setSession] = useState(() => getStoredSession());
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

  // Fetch follow-ups & todos whenever user changes
  useEffect(() => {
    async function loadData() {
      if (!session?.user) return;
      setLoadingData(true);
      try {
        const fData = await getFollowups(session.user.id);
        setFollowups(fData);

        const tData = await getTodos(session.user.id);
        setTodos(tData);

        // Check upcoming reminders for notifications
        checkAndNotifyUpcomingFollowups(fData, session.user.push_enabled);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, [session]);

  const user = session?.user || null;

  // Handlers
  const handleAddClient = async (data: Omit<Followup, 'id' | 'created_at' | 'is_completed'>) => {
    const activeUserId = user?.id || 'demo-user-123';
    await addFollowup({ ...data, user_id: activeUserId });
    const updated = await getFollowups(activeUserId);
    setFollowups(updated);
    setActiveTab('home');
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await toggleFollowupCompletion(id, currentStatus);
    const activeUserId = user?.id || 'demo-user-123';
    const updated = await getFollowups(activeUserId);
    setFollowups(updated);
  };

  const handleDeleteClient = async (id: string) => {
    await deleteFollowup(id);
    const activeUserId = user?.id || 'demo-user-123';
    const updated = await getFollowups(activeUserId);
    setFollowups(updated);
    setSelectedClient(null);
    setActiveTab('home');
  };

  // Todo Handlers
  const handleAddTodo = async (taskName: string) => {
    const activeUserId = user?.id || 'demo-user-123';
    await addTodo(activeUserId, taskName);
    const updated = await getTodos(activeUserId);
    setTodos(updated);
  };

  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    await toggleTodoCompletion(id, currentStatus);
    const activeUserId = user?.id || 'demo-user-123';
    const updated = await getTodos(activeUserId);
    setTodos(updated);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    const activeUserId = user?.id || 'demo-user-123';
    const updated = await getTodos(activeUserId);
    setTodos(updated);
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

  const handleLogout = () => {
    clearSession();
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
          onSuccess={(u) => {
            setSession(getStoredSession());
            setActiveTab('home');
          }}
          onCancel={() => setActiveTab('home')}
        />
      );
    }

    if (activeTab === 'forgot-credentials') {
      return (
        <AuthModal
          initialView="forgot-credentials"
          onSuccess={(u) => {
            setSession(getStoredSession());
            setActiveTab('home');
          }}
          onCancel={() => setActiveTab('home')}
        />
      );
    }

    switch (activeTab) {
      case 'add-client':
        return (
          <AddClientView
            userId={user?.id || 'demo-user-123'}
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

  if (!session) {
    return (
      <div className="min-h-dvh bg-[#F2F2F7] text-slate-900 flex flex-col antialiased max-w-[500px] mx-auto border-x border-slate-200 relative shadow-2xl overflow-hidden">
        <LoginView
          onSuccess={(newUser) => {
            setSession(getStoredSession());
            setActiveTab('home');
          }}
        />
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
            setSession(getStoredSession());
            setShowAuthModal(false);
          }}
          onCancel={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
