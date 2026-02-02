import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("jwt");
  const loggedIn = isLoggedIn();

  console.log("ProtectedRoute check:");
  console.log("JWT in storage:", token);
  console.log("isLoggedIn():", loggedIn);
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
