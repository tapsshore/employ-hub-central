
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export const SidebarHeader = () => {
  return (
    <div className="flex h-16 items-center border-b px-6">
      <Link to="/dashboard" className="flex items-center gap-2 font-bold">
        <Users className="h-6 w-6" />
        <span>HR Hub Central</span>
      </Link>
    </div>
  );
};
