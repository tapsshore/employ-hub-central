
import { UserRole } from "@/lib/types";

interface SidebarFooterProps {
  userRole: UserRole;
}

export const SidebarFooter = ({ userRole }: SidebarFooterProps) => {
  return (
    <div className="border-t p-4">
      <div className="text-sm text-muted-foreground">
        Logged in as: <span className="font-semibold">{userRole}</span>
      </div>
    </div>
  );
};
