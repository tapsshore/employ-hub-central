
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const location = useLocation();
  
  // In a real implementation, this would come from an auth context or store
  const userRole = localStorage.getItem("userRole") as UserRole || UserRole.EMPLOYEE;
  
  const isAdmin = userRole === UserRole.ADMIN;
  const isHR = userRole === UserRole.HR_MANAGER || userRole === UserRole.HR_OFFICER;
  
  const canManageEmployees = isAdmin || isHR;
  const canManageDocuments = isAdmin || isHR;
  const canManageInvitations = isAdmin || userRole === UserRole.HR_MANAGER;

  const navItems = [
    { label: "Dashboard", path: "/dashboard", showTo: "all" },
    { label: "Employees", path: "/employees", showTo: canManageEmployees ? "all" : "none" },
    { label: "Documents", path: "/documents", showTo: "all" },
    { label: "Invitations", path: "/invitations", showTo: canManageInvitations ? "all" : "none" },
    { label: "Settings", path: "/settings", showTo: "all" }
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-hr-primary text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>HR Hub Central</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="flex flex-col gap-1 px-2">
          {navItems
            .filter((item) => item.showTo === "all")
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-white/10",
                    location.pathname === item.path
                      ? "bg-white/20 font-semibold"
                      : "transparent"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      closeSidebar();
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="text-sm text-white/60">
          Logged in as: <span className="font-semibold">{userRole}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 md:hidden"
        onClick={closeSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </Button>
    </div>
  );
};

export default Sidebar;
