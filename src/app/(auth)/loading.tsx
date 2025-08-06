
interface AuthLoadingProps {
  className?: string;
  children?: React.ReactNode;
}

import { Loader2, Shield } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <Loader2 className="h-6 w-6 animate-spin text-primary absolute bottom-0 right-1/2 translate-x-1/2" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">Securing your session</p>
          <p className="text-sm text-muted-foreground">
            Please wait a moment...
          </p>
        </div>
      </div>
    </div>
  );
}
