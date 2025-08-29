import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { Theme } from "@radix-ui/themes";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";

export default function MyApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <TooltipProvider>
      <Theme>
        {isAuthenticated ? <Dashboard /> : <LoginPage onLogin={handleLogin} />}
      </Theme>
    </TooltipProvider>
  );
}
