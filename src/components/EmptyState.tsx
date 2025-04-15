
import React from "react";
import { Upload, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUploadClick: () => void;
}

const EmptyState = ({ onUploadClick }: EmptyStateProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-pulse-gentle">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <BarChart2 className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No Data Loaded Yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Upload your creative performance data or use our demo data to get started with insights and analytics.
      </p>
      <Button onClick={onUploadClick} className="mt-6" size="lg">
        <Upload className="mr-2 h-4 w-4" />
        Upload Data Now
      </Button>
    </div>
  );
};

export default EmptyState;
