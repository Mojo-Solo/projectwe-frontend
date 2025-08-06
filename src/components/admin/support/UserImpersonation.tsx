"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, User, LogIn, AlertTriangle } from "lucide-react";

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  status: string;
  workspace: string;
}

export default function UserImpersonation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null,
  );
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [impersonationReason, setImpersonationReason] = useState("");

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          status: "Active",
          workspace: "Acme Corp",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          status: "Trial",
          workspace: "Tech Startup",
        },
      ]);
      setIsSearching(false);
    }, 500);
  };

  const handleImpersonate = async () => {
    if (!selectedUser || !impersonationReason) return;

    // Log the impersonation action
    console.log(
      "Impersonating user:",
      selectedUser,
      "Reason:",
      impersonationReason,
    );

    // In a real implementation, this would:
    // 1. Create an audit log entry
    // 2. Generate a temporary session token
    // 3. Open the user's dashboard in a new tab

    window.open(`/dashboard?impersonate=${selectedUser.id}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Warning:</strong> User impersonation is logged and audited.
          Only use for legitimate support purposes.
        </AlertDescription>
      </Alert>

      {/* Search Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="user-search">Search User</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="user-search"
              placeholder="Enter email, name, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <Label>Search Results</Label>
            <div className="border rounded-lg divide-y">
              {searchResults.map((user) => (
                <div key={index}
                  key={user.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedUser?.id === user.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        {user.workspace} • {user.status}
                      </p>
                    </div>
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected User Details */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Selected User</CardTitle>
            <CardDescription>
              Confirm user details before impersonation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600">Name</Label>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label className="text-gray-600">Workspace</Label>
                <p className="font-medium">{selectedUser.workspace}</p>
              </div>
              <div>
                <Label className="text-gray-600">Status</Label>
                <p className="font-medium">{selectedUser.status}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Impersonation</Label>
              <textarea
                id="reason"
                className="w-full mt-1 px-3 py-2 border rounded-md resize-none"
                rows={3}
                placeholder="Provide a detailed reason for impersonating this user..."
                value={impersonationReason}
                onChange={(e) => setImpersonationReason(e.target.value)}
                required
              />
            </div>

            <Button
              onClick={handleImpersonate}
              disabled={!impersonationReason.trim()}
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Impersonate User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
