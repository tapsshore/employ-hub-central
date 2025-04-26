
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSaveAccountSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Settings saved", {
        description: "Your account settings have been updated successfully.",
      });
      setLoading(false);
    }, 1000);
  };
  
  const handleSaveNotificationSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Settings saved", {
        description: "Your notification preferences have been updated.",
      });
      setLoading(false);
    }, 1000);
  };
  
  const handleSaveSecuritySettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Password changed", {
        description: "Your password has been updated successfully.",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel>First Name</FormLabel>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Last Name</FormLabel>
                    <Input defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <Input defaultValue="john.doe@example.com" type="email" />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Phone Number</FormLabel>
                  <Input defaultValue="+1234567890" />
                </div>
                
                <Button 
                  onClick={handleSaveAccountSettings}
                  className="bg-hr-primary hover:bg-hr-primary/90"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Document Updates</FormLabel>
                      <FormDescription>
                        Receive notifications when documents are uploaded or updated.
                      </FormDescription>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Employee Updates</FormLabel>
                      <FormDescription>
                        Receive notifications about employee information changes.
                      </FormDescription>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>System Notifications</FormLabel>
                      <FormDescription>
                        Important updates about system maintenance and changes.
                      </FormDescription>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveNotificationSettings}
                  className="bg-hr-primary hover:bg-hr-primary/90"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to maintain account security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>Current Password</FormLabel>
                  <Input type="password" />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>New Password</FormLabel>
                  <Input type="password" />
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input type="password" />
                </div>
                
                <Button 
                  onClick={handleSaveSecuritySettings}
                  className="bg-hr-primary hover:bg-hr-primary/90"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Enable 2FA</div>
                    <div className="text-sm text-muted-foreground">
                      Protect your account with two-factor authentication.
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
