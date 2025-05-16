import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

export function ResetPasswordForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('token');
    
    if (resetToken) {
      setToken(resetToken);
    } else {
      setTokenError(true);
    }
  }, [location]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return (
      hasUpperCase && 
      hasLowerCase && 
      hasNumber && 
      hasSpecialChar && 
      isLongEnough
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid or missing reset token',
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Password',
        description: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword({ token, newPassword });
      toast({
        title: 'Success',
        description: 'Your password has been reset successfully',
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reset password. The token may be invalid or expired.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Invalid Reset Link</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              The password reset link is invalid or has expired. Please request a new password reset link.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate('/forgot-password')}
          >
            Request New Reset Link
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
