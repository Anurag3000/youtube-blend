import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const tokenFromStorage = localStorage.getItem("jwt");

    console.log("URL token:", tokenFromUrl);
    console.log("Stored token:", tokenFromStorage);

    if (tokenFromUrl) {
      localStorage.setItem("jwt", tokenFromUrl);
      navigate("/dashboard", { replace: true });
      return;
    }

    if (tokenFromStorage) {
      navigate("/dashboard", { replace: true });
      return;
    }

    navigate("/", { replace: true });
  }, [navigate]);

  return <p>Logging you in...</p>;
}
