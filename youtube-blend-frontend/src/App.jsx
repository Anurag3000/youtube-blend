import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthSuccess from "./pages/AuthSuccess";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth-success" element={<AuthSuccess />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
