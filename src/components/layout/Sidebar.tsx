
import { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavItems } from "./sidebar/SidebarNavItems";
import { SidebarFooter } from "./sidebar/SidebarFooter";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  // In a real implementation, this would come from an auth context or store
  const userRole = localStorage.getItem("userRole") as UserRole || UserRole.EMPLOYEE;
  
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-background border-r transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <SidebarHeader />
      <nav className="flex-1 py-4">
        <SidebarNavItems 
          userRole={userRole}
          onItemClick={() => {
            if (window.innerWidth < 768) {
              closeSidebar();
            }
          }}
        />
      </nav>
      <SidebarFooter userRole={userRole} />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 md:hidden"
        onClick={closeSidebar}
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Sidebar;
