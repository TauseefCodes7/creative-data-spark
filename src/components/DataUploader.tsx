
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DataUploaderProps {
  onDataUploaded: (data: any[]) => void;
}

const DataUploader = ({ onDataUploaded }: DataUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSVData(text);
        onDataUploaded(data);
        toast.success("Data uploaded successfully!");
      } catch (error) {
        toast.error("Failed to parse data. Please ensure it's a valid CSV format.");
        console.error("Error parsing CSV:", error);
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
      setIsUploading(false);
    };

    reader.readAsText(file);
  };

  const parseCSVData = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',');
      const entry: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        let value = values[index]?.trim() || '';
        // Try to convert numeric values
        if (!isNaN(Number(value)) && value !== '') {
          entry[header] = Number(value);
        } else {
          entry[header] = value;
        }
      });
      
      data.push(entry);
    }
    
    return data;
  };

  const generateDemoData = () => {
    setIsUploading(true);
    setFileName("demo-data.csv");
    
    // Generate creative performance data
    const demoData = Array.from({ length: 50 }, (_, i) => {
      const month = (i % 12) + 1;
      const year = 2023 + Math.floor(i / 12);
      const project = `Project ${Math.floor(Math.random() * 10) + 1}`;
      const medium = ["Digital", "Print", "Social", "Video", "Audio"][Math.floor(Math.random() * 5)];
      const engagement = Math.floor(Math.random() * 10000) + 1000;
      const conversion = Math.floor(Math.random() * 500) + 50;
      const sentiment = Math.floor(Math.random() * 100) + 1;
      
      return {
        date: `${year}-${month.toString().padStart(2, '0')}-01`,
        project,
        medium,
        engagement,
        conversion,
        sentiment,
        roi: (conversion * 2.5) / (engagement * 0.01)
      };
    });
    
    setTimeout(() => {
      onDataUploaded(demoData);
      toast.success("Demo data loaded successfully!");
      setIsUploading(false);
    }, 800);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Your Creative Data</CardTitle>
        <CardDescription>
          Upload a CSV file with your creative performance metrics or use our demo data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <div className="relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/20 bg-muted/50 px-5 py-5 text-center transition hover:bg-muted">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {isUploading ? "Uploading..." : "Drop your CSV file here or click to browse"}
                </span>
                {fileName && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <FileText className="h-3 w-3" />
                    <span>{fileName}</span>
                    {!isUploading && <CheckCircle className="h-3 w-3 text-green-500" />}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col justify-center sm:w-1/2">
            <Button 
              onClick={generateDemoData} 
              variant="outline" 
              className="w-full"
              disabled={isUploading}
            >
              Use Demo Data
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Don't have data yet? Our demo includes creative performance data across different mediums and projects.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataUploader;
