
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";

interface NavItem {
  label: string;
  path: string;
  showTo: "all" | "none";
}

interface SidebarNavItemsProps {
  userRole: UserRole;
  onItemClick?: () => void;
}

export const SidebarNavItems = ({ userRole, onItemClick }: SidebarNavItemsProps) => {
  const location = useLocation();
  
  const isAdmin = userRole === UserRole.ADMIN;
  const isHR = userRole === UserRole.HR_MANAGER || userRole === UserRole.HR_OFFICER;
  
  const canManageEmployees = isAdmin || isHR;
  const canManageDocuments = isAdmin || isHR;
  const canManageInvitations = isAdmin || userRole === UserRole.HR_MANAGER;

  const navItems: NavItem[] = [
    { label: "Dashboard", path: "/dashboard", showTo: "all" },
    { label: "Employees", path: "/employees", showTo: canManageEmployees ? "all" : "none" },
    { label: "Documents", path: "/documents", showTo: "all" },
    { label: "Invitations", path: "/invitations", showTo: canManageInvitations ? "all" : "none" },
    { label: "Settings", path: "/settings", showTo: "all" }
  ];

  return (
    <ul className="flex flex-col gap-1 px-2">
      {navItems
        .filter((item) => item.showTo === "all")
        .map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-accent",
                location.pathname === item.path
                  ? "bg-accent font-semibold"
                  : "transparent"
              )}
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
    </ul>
  );
};
