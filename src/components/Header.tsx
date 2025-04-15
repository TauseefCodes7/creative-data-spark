
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface HeaderProps {
  onExportData?: () => void;
  isDataLoaded: boolean;
}

const Header = ({ onExportData, isDataLoaded }: HeaderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Creative Data Insights</h1>
        <p className="text-sm text-muted-foreground">Analyze your creative performance data and uncover actionable insights</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search insights..."
            className="w-full rounded-full pl-8 sm:w-[200px] lg:w-[300px]"
            disabled={!isDataLoaded}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to use this tool</DialogTitle>
              <DialogDescription>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold">Getting Started</h3>
                    <p className="text-muted-foreground">
                      Upload your CSV data file or use our demo data to get started. The CSV should have headers including creative metrics.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Understanding Insights</h3>
                    <p className="text-muted-foreground">
                      Once your data is loaded, you'll see key metrics, performance analytics, and AI-generated insights to help optimize your creative strategy.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Recommended Data Format</h3>
                    <p className="text-muted-foreground">
                      For best results, include columns for date, project name, medium type, engagement metrics, conversion metrics, and sentiment scores.
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Button 
          variant="outline" 
          className="sm:ml-2" 
          onClick={onExportData}
          disabled={!isDataLoaded}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </header>
  );
};

export default Header;
