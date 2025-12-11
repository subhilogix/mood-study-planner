// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignupPage from "./pages/SignupPage";

// Pages
import HomePage from "./pages/HomePage";
import PlannerPage from "./pages/PlannerPage";
import PomodoroPage from "./pages/PomodoroPage";
import JournalPage from "./pages/JournalPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/planner"
        element={
          <ProtectedRoute>
            <Layout>
              <PlannerPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pomodoro"
        element={
          <ProtectedRoute>
            <Layout>
              <PomodoroPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <Layout>
              <JournalPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* DEFAULT: redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
