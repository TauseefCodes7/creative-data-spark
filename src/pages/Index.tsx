
import React, { useState, useRef } from "react";
import Header from "@/components/Header";
import DataUploader from "@/components/DataUploader";
import DataInsightsPanel from "@/components/DataInsightsPanel";
import EmptyState from "@/components/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("insights");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDataUploaded = (uploadedData: any[]) => {
    setData(uploadedData);
    // Switch to insights tab after data is loaded
    setActiveTab("insights");
  };

  const handleUploadClick = () => {
    // Programmatically click the file input inside DataUploader
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleExportData = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Convert data to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(','));
      const csvContent = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', 'creative-insights-data.csv');
      a.click();
      
      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] p-4 md:p-6 lg:p-8">
      <Header onExportData={handleExportData} isDataLoaded={data.length > 0} />
      
      <main className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <TabsList>
              <TabsTrigger value="upload">Upload Data</TabsTrigger>
              <TabsTrigger value="insights">Insights & Analytics</TabsTrigger>
            </TabsList>
            
            {data.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground sm:mt-0">
                Analyzing {data.length} data points
              </p>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <TabsContent value="upload" className="mt-0">
            <DataUploader onDataUploaded={handleDataUploaded} />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-0">
            {data.length > 0 ? (
              <DataInsightsPanel data={data} />
            ) : (
              <EmptyState onUploadClick={() => setActiveTab("upload")} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
