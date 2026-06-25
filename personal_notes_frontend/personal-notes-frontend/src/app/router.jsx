import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Register from "../features/auth/register";
import Login from "../features/auth/login";
import Dashboard from "../features/notes/dashboard";
import CreateNote from "../features/notes/createNote";
import EditNote from "../features/notes/editnote";
import ViewNote from "../features/notes/viewNote";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/create"
        element={
          <ProtectedRoute>
            <CreateNote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/edit/:id"
        element={
          <ProtectedRoute>
            <EditNote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <ViewNote />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;