
interface LoadingProps {
  className?: string;
  children?: React.ReactNode;
}

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 blur-xl h-12 w-12 bg-primary/20 animate-pulse mx-auto" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">Loading ProjectWE®</p>
          <p className="text-sm text-muted-foreground">
            Preparing your exit planning experience...
          </p>
        </div>
      </div>
    </div>
  );
}
