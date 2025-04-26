
import { Input } from "@/components/ui/input";

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const EmployeeSearch = ({ searchTerm, onSearchChange }: EmployeeSearchProps) => {
  return (
    <div className="mt-4">
      <Input
        placeholder="Search employees..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};

export default EmployeeSearch;
