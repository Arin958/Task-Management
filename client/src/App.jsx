import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Task from "./pages/Task";
import TaskDetails from "./pages/TaskDetails";
import User from "./pages/User";

import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/ProtectedRoute/PrivateRoute";
import InvitationPage from "./pages/InvitationRegister";
import CreatingTaskPage from "./pages/CreatingTaskPage";
import ProfileDetail from "./pages/ProfileDetail";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <main>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:status?"
            element={
              <PrivateRoute>
                <Task />
              </PrivateRoute>
            }
          />

          <Route
            path="/team"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route
            path="/creating-task-page"
            element={
              <PrivateRoute>
                <CreatingTaskPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <ProfileDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/task/:taskId"
            element={
              <PrivateRoute>
                <TaskDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/invite/:token" element={<InvitationPage />} />
      </Routes>

      <Toaster />
    </main>
  );
}

export default App;
