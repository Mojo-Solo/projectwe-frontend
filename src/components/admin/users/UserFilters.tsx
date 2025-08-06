
interface UserFiltersProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";

export default function UserFilters() {
  const filters = [
    { id: "verified", label: "Email Verified" },
    { id: "2fa", label: "2FA Enabled" },
    { id: "active30", label: "Active in last 30 days" },
    { id: "trial", label: "On Trial" },
    { id: "paid", label: "Paid Subscription" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Filter Users</h4>
            <div className="space-y-2">
              {filters.map((filter) => (
                <div key={filter.id} className="flex items-center space-x-2">
                  <Checkbox id={filter.id} />
                  <Label
                    htmlFor={filter.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {filter.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm">
              Clear
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
