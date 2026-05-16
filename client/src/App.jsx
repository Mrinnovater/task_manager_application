import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";

import DashboardPage from "./pages/Dashboard/DashboardPage";

import ProjectsPage from "./pages/Projects/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetails/ProjectDetailsPage";

import TasksPage from "./pages/Tasks/TasksPage";
import TaskDetailsPage from "./pages/TaskDetails/TaskDetailsPage";

import NotificationsPage from "./pages/Notifications/NotificationsPage";

import SettingsPage from "./pages/Settings/SettingsPage";

import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPassword/ResetPasswordPage";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

import KanbanPage from "./pages/Kanban/KanbanPage";
import ChatPage from "./pages/Chat/ChatPage";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <KanbanPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/analytics"
  element={<AnalyticsPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;