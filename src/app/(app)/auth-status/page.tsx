
interface AuthStatusPageProps {
  className?: string;
  children?: React.ReactNode;
}

"use client";

import { useAuth } from "@/hooks/useAuth";
import { signIn, signOut } from "next-auth/react";

export const dynamic = 'force-dynamic';

export default function AuthStatusPage() {
  const { user, isAuthenticated, isLoading, isAdmin, isAdvisor, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Authentication Status</h1>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Authentication Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                isAuthenticated 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>

            {isAuthenticated && user && (
              <>
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold mb-3">User Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">ID:</span> {user.id}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span> {user.name || 'Not set'}
                    </div>
                    <div>
                      <span className="font-medium">Role:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        role === 'ADMIN' || role === 'SUPER_ADMIN' 
                          ? 'bg-purple-100 text-purple-800'
                          : role === 'ADVISOR'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {role}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Organization ID:</span> {user.organizationId}
                    </div>
                    <div>
                      <span className="font-medium">Organization Slug:</span> {user.organizationSlug}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold mb-3">Permissions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Admin Access:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        isAdmin 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isAdmin ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Advisor Access:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        isAdvisor 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isAdvisor ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => signOut()}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="border-t pt-4">
                <p className="text-gray-600 mb-4">You are not currently authenticated.</p>
                <button
                  onClick={() => signIn()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}