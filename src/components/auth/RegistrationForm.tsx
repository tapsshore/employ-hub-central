import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { register } from "@/services/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserRole } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  // Form fields
  const [firstName, setFirstName] = useState("Tapiwanashe");
  const [lastName, setLastName] = useState("Shoshore");
  const [email, setEmail] = useState("tapiwanasheshoshore@gmail.com");
  const [employeeNumber, setEmployeeNumber] = useState("EMP123456");
  const [phoneNumber, setPhoneNumber] = useState("+263771792254");
  const [password, setPassword] = useState("StrongP@ss123");
  const [confirmPassword, setConfirmPassword] = useState("StrongP@ss123");
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [contractStartDate, setContractStartDate] = useState("2025-04-27");
  const [contractEndDate, setContractEndDate] = useState("2030-04-27");
  const [contractType, setContractType] = useState("Permanent");
  const [workLocation, setWorkLocation] = useState("Harare, Zimbabwe");
  const [position, setPosition] = useState("Software Engineer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setRegistrationError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setRegistrationError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        firstName,
        lastName,
        email,
        employeeNumber,
        phoneNumber,
        password,
        role,
        contractStartDate,
        contractEndDate: contractEndDate || undefined,
        contractType,
        location: workLocation,
        position
      };

      const response = await register(userData);

      toast.success("Registration successful", {
        description: "You can now log in with your credentials.",
      });

      // Redirect to login page
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError(error.message || "Registration failed. Please try again.");
      toast.error("Registration failed", {
        description: error.message || "Please check your information and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[450px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create a new account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {registrationError && (
            <Alert variant="destructive">
              <AlertDescription>{registrationError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tapiwanashe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Shoshore"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tapiwanasheshoshore@gmail.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeNumber">Employee Number</Label>
              <Input
                id="employeeNumber"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                placeholder="EMP123456"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+263771792254"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="StrongP@ss123"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="StrongP@ss123"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={role} 
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.HR_MANAGER}>HR Manager</SelectItem>
                  <SelectItem value={UserRole.HR_OFFICER}>HR Officer</SelectItem>
                  <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractType">Contract Type</Label>
              <Select 
                value={contractType} 
                onValueChange={setContractType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Permanent">Permanent</SelectItem>
                  <SelectItem value="Temporary">Temporary</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractStartDate">Contract Start Date</Label>
              <Input
                id="contractStartDate"
                type="date"
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractEndDate">Contract End Date</Label>
              <Input
                id="contractEndDate"
                type="date"
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                placeholder="Harare, Zimbabwe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Software Engineer"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-hr-primary hover:bg-hr-primary/90" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
        <div className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-hr-primary hover:underline">
              Login
            </a>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default RegistrationForm;
