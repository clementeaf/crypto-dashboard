import { useState, useEffect, useCallback } from "react";
import { useNavigate, useActionData } from "@remix-run/react";
import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useAuth } from "~/context/AuthContext";
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
  const actionData = useActionData<LoginActionData>();

  // Redirect to dashboard after successful login
  const redirectToDashboard = useCallback(() => {
    setLoginSuccess(true);
    // Redirect after a brief delay to show the message
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1000);
  }, [navigate]);

  // Handle login logic
  const performLogin = useCallback(async (user: string, pass: string) => {
    setIsLoading(true);
    
    try {
      const success = await login(user, pass);
      
      if (success) {
        redirectToDashboard();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [login, redirectToDashboard]);

  // Process server action result
  useEffect(() => {
    if (actionData?.success && actionData.username && actionData.password) {
      performLogin(actionData.username, actionData.password);
    } else if (actionData && !actionData.success) {
      setIsLoading(false);
    }
  }, [actionData, performLogin]);

  // Check if we're already authenticated and redirect directly
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Handler for direct form submission (fallback if Remix Form doesn't work)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(username, password);
  }, [username, password, performLogin]);

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