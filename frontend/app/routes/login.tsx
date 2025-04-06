import { useState, useEffect } from "react";
import { useNavigate, useActionData } from "@remix-run/react";
import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useAuth } from "~/context/AuthContext";
import { useTheme } from "~/root";
import LoadingButton from "~/components/ui/LoadingButton";
import { LoginActionData } from "~/types/auth.types";

export const meta: MetaFunction = () => {
  return [
    { title: "Login - Crypto Dashboard" },
    { name: "description", content: "Access your cryptocurrency dashboard" },
  ];
};

// Action that runs on the server when the form is submitted
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Validate credentials (hardcoded for this example)
  if (username === "admin" && password === "admin") {
    // We can't use sessionStorage on the server, so instead
    // we return an object indicating success and let the client handle authentication
    return json({ success: true, username, password });
  }

  // If credentials are incorrect, return an error
  return json({ success: false, error: "Incorrect credentials" });
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const { isDark } = useTheme();
  const actionData = useActionData<LoginActionData>();

  // Process server action result
  useEffect(() => {
    if (actionData?.success) {
      // If the server validated the credentials, login on the client and navigate
      setIsLoading(true);
      console.log("Correct authentication on the server, executing client login...");
      
      // Execute login on the client (this will update sessionStorage)
      if (actionData.username && actionData.password) {
        login(actionData.username, actionData.password).then(success => {
          if (success) {
            console.log("Successful client login, navigating to dashboard...");
            // Show success message
            setLoginSuccess(true);
            // Redirect after a brief delay to show the message
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 1000);
          } else {
            console.error("Error executing login on client");
            setIsLoading(false);
          }
        });
      }
    } else if (actionData && !actionData.success) {
      console.log("Incorrect credentials");
      setIsLoading(false);
    }
  }, [actionData, login, navigate]);

  // Check if we're already authenticated and redirect directly without showing modal
  useEffect(() => {
    if (isLoggedIn) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Handler for direct form (fallback if Remix Form doesn't work)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Try direct login
    try {
      console.log("Attempting direct login");
      const success = await login(username, password);
      
      if (success) {
        console.log("Successful login, navigating to dashboard");
        // Show success message
        setLoginSuccess(true);
        // Redirect after a brief delay to show the message
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } else {
        console.log("Incorrect credentials");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Crypto Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Log in to access</p>
        </div>
        
        {/* Show success message if login was successful */}
        {loginSuccess ? (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            <p className="font-medium">Login successful!</p>
            <p className="text-sm">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            {actionData?.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {actionData.error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              variant="primary"
              fullWidth
              loadingText="Logging in..."
            >
              Log in
            </LoadingButton>
            
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Test credentials: admin / admin</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 