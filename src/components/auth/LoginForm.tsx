
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login } from "@/services/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    console.log("Attempting login with:", { email });

    try {
      const response = await login({ email, password });
      console.log("Login successful:", response);

      // Store authentication data in localStorage
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userEmail", email);
      // Extract role from JWT token
      try {
        const tokenPayload = JSON.parse(atob(response.accessToken.split('.')[1]));
        localStorage.setItem("userRole", tokenPayload.role);
      } catch (e) {
        console.error("Error parsing token:", e);
        localStorage.setItem("userRole", "");
      }

      toast.success("Login successful", {
        description: "Welcome back!",
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password. Please try again.");
      toast.error("Login failed", {
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#forgot-password"
                className="text-xs text-hr-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Password reset", {
                    description: "This feature is not implemented yet.",
                  });
                }}
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-hr-primary hover:bg-hr-primary/90" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
        <div className="p-4 text-center text-sm">
          <p className="text-muted-foreground">
            Demo accounts:
          </p>
          <div className="text-xs mt-1 space-y-1 text-muted-foreground">
            <p>Admin: admin@example.com</p>
            <p>HR: hr@example.com</p>
            <p>Employee: employee@example.com</p>
            <p>Password for all: "password"</p>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default LoginForm;
