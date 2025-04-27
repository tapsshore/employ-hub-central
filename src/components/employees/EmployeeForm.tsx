
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractType } from "@/lib/types";

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  position: string;
  location: string;
  contractType: ContractType;
  contractStartDate: string;
  contractEndDate: string;
}

interface EmployeeFormProps {
  formData: EmployeeFormData;
  onChange: (name: string, value: string) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function EmployeeForm({
  formData,
  onChange,
  onSelectChange,
}: EmployeeFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeNumber">Employee Number</Label>
          <Input
            id="employeeNumber"
            name="employeeNumber"
            value={formData.employeeNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contractType">Contract Type</Label>
        <Select
          value={formData.contractType}
          onValueChange={(value) =>
            onSelectChange("contractType", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select contract type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ContractType.PERMANENT}>
              Permanent
            </SelectItem>
            <SelectItem value={ContractType.TEMPORARY}>
              Temporary
            </SelectItem>
            <SelectItem value={ContractType.CONTRACT}>
              Contract
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contractStartDate">Start Date</Label>
          <Input
            id="contractStartDate"
            name="contractStartDate"
            type="date"
            value={formData.contractStartDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contractEndDate">End Date</Label>
          <Input
            id="contractEndDate"
            name="contractEndDate"
            type="date"
            value={formData.contractEndDate}
            onChange={handleChange}
            disabled={formData.contractType === ContractType.PERMANENT}
          />
        </div>
      </div>
    </div>
  );
}
