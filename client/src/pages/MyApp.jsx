import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { Theme } from "@radix-ui/themes";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function MyApp() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  console.log("MyApp.jsx loaded, version: 2025-09-10");

  const handleLogin = (username) => {
    if (!username) {
      console.error("handleLogin called with undefined username");
      return;
    }
    console.log("MyApp handleLogin called with username:", username);
    setUsername(username);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const renderId = Math.random().toString(36).substring(7);
  console.log(
    `MyApp rendering, renderId: ${renderId}, handleLogin:`,
    typeof handleLogin
  );

  return (
    <TooltipProvider>
      <Theme>
        <Routes>
          <Route
            path="/"
            element={<LoginPage onLogin={handleLogin} renderId={renderId} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard username={username} onLogout={handleLogout} />}
          />
        </Routes>
      </Theme>
    </TooltipProvider>
  );
}
