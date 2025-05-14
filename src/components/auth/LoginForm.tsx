
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login, verify2fa } from "@/services/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // 2FA states
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [tempToken, setTempToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    // If we're in 2FA verification mode, handle that instead
    if (isTwoFactorRequired) {
      await handleTwoFactorVerification();
      return;
    }

    console.log("Attempting login with:", { email });

    try {
      const response = await login({ email, password });
      console.log("Login response:", response);

      // Check if 2FA is required
      if (response.isTwoFactorEnabled) {
        setIsTwoFactorRequired(true);
        setTempToken(response.tempToken || "");
        setIsLoading(false);
        toast.info("Two-factor authentication required", {
          description: "Please enter the verification code from your authenticator app.",
        });
        return;
      }

      // No 2FA required, proceed with normal login
      handleSuccessfulLogin(response);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password. Please try again.");
      toast.error("Login failed", {
        description: "Invalid email or password. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleTwoFactorVerification = async () => {
    try {
      if (!twoFactorCode) {
        setLoginError("Verification code is required.");
        setIsLoading(false);
        return;
      }

      const response = await verify2fa(twoFactorCode, tempToken);
      handleSuccessfulLogin(response);
    } catch (error) {
      console.error("2FA verification error:", error);
      setLoginError("Invalid verification code. Please try again.");
      toast.error("Verification failed", {
        description: "Invalid verification code. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = (response: any) => {
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

    // Reset 2FA states
    setIsTwoFactorRequired(false);
    setTwoFactorCode("");
    setTempToken("");
    setIsLoading(false);

    // Redirect to dashboard
    navigate("/dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isTwoFactorRequired ? "Two-Factor Authentication" : "Login"}
        </CardTitle>
        <CardDescription>
          {isTwoFactorRequired 
            ? "Enter the verification code from your authenticator app" 
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {isTwoFactorRequired ? (
            // 2FA Verification Form
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-hr-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Verification Code</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  placeholder="123456"
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Open your authenticator app to view your verification code
              </p>
            </div>
          ) : (
            // Regular Login Form
            <>
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
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-hr-primary hover:bg-hr-primary/90" disabled={isLoading}>
            {isLoading 
              ? (isTwoFactorRequired ? "Verifying..." : "Logging in...") 
              : (isTwoFactorRequired ? "Verify" : "Login")}
          </Button>
        </CardFooter>
        {!isTwoFactorRequired && (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-hr-primary hover:underline">
                Register
              </a>
            </p>
          </div>
        )}
      </form>
    </Card>
  );
};

export default LoginForm;
