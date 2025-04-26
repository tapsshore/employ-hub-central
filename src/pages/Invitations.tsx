
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/types";
import { toast } from "sonner";

// Mock invitation data
const mockInvitations = [
  {
    id: "inv1",
    email: "john.smith@example.com",
    role: UserRole.EMPLOYEE,
    createdBy: "Admin User",
    createdAt: new Date("2025-04-20"),
    expiresAt: new Date("2025-04-22"),
    status: "Pending",
  },
  {
    id: "inv2",
    email: "sarah.johnson@example.com",
    role: UserRole.HR_OFFICER,
    createdBy: "HR Manager",
    createdAt: new Date("2025-04-19"),
    expiresAt: new Date("2025-04-21"),
    status: "Pending",
  },
];

const Invitations = () => {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [isLoading, setIsLoading] = useState(false);

  const handleResendInvitation = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInvitations(
        invitations.map((inv) =>
          inv.id === id
            ? {
                ...inv,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 48 hours
              }
            : inv
        )
      );
      
      toast.success("Invitation resent", {
        description: "The invitation has been resent successfully.",
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelInvitation = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setInvitations(invitations.filter((inv) => inv.id !== id));
      
      toast.success("Invitation cancelled", {
        description: "The invitation has been cancelled successfully.",
      });
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
          <p className="text-muted-foreground">
            Manage user invitations and role assignments.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Manage Invitations</CardTitle>
              <CardDescription>
                Send and track invitations for new users
              </CardDescription>
            </div>
            <Button className="bg-hr-primary hover:bg-hr-primary/90">
              New Invitation
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No active invitations
                    </TableCell>
                  </TableRow>
                ) : (
                  invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell>{invitation.role}</TableCell>
                      <TableCell>{invitation.createdBy}</TableCell>
                      <TableCell>
                        {invitation.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invitation.expiresAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          {invitation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvitation(invitation.id)}
                            disabled={isLoading}
                          >
                            Resend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                            disabled={isLoading}
                            className="text-red-500 border-red-200 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Invitations;
