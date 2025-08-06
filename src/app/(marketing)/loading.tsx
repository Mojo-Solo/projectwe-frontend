
interface MarketingLoadingProps {
  className?: string;
  children?: React.ReactNode;
}

import { Loader2 } from "lucide-react";

export default function MarketingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    </div>
  );
}
