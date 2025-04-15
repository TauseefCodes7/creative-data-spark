
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  FilterX,
  SlidersHorizontal
} from "lucide-react";

interface AdvancedFiltersProps {
  data: any[];
  onFilterChange: (filteredData: any[]) => void;
}

const AdvancedFilters = ({ data, onFilterChange }: AdvancedFiltersProps) => {
  const [medium, setMedium] = useState<string>("");
  const [minEngagement, setMinEngagement] = useState(0);
  const [minSentiment, setMinSentiment] = useState(0);

  const uniqueMediaTypes = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.medium)));
  }, [data]);

  const maxEngagement = React.useMemo(() => {
    return Math.max(...data.map(item => item.engagement || 0));
  }, [data]);

  const applyFilters = () => {
    let filteredData = [...data];
    
    if (medium) {
      filteredData = filteredData.filter(item => item.medium === medium);
    }
    
    if (minEngagement > 0) {
      filteredData = filteredData.filter(item => (item.engagement || 0) >= minEngagement);
    }
    
    if (minSentiment > 0) {
      filteredData = filteredData.filter(item => (item.sentiment || 0) >= minSentiment);
    }
    
    onFilterChange(filteredData);
  };

  const resetFilters = () => {
    setMedium("");
    setMinEngagement(0);
    setMinSentiment(0);
    onFilterChange(data);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Advanced Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <FilterX className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Medium</label>
          <Select value={medium} onValueChange={setMedium}>
            <SelectTrigger>
              <SelectValue placeholder="Select medium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Mediums</SelectItem>
              {uniqueMediaTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Min. Engagement</label>
          <Slider
            value={[minEngagement]}
            onValueChange={(value) => setMinEngagement(value[0])}
            max={maxEngagement}
            step={100}
          />
          <div className="text-xs text-muted-foreground">
            {minEngagement.toLocaleString()}+ engagements
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Min. Sentiment Score</label>
          <Slider
            value={[minSentiment]}
            onValueChange={(value) => setMinSentiment(value[0])}
            max={100}
            step={5}
          />
          <div className="text-xs text-muted-foreground">
            {minSentiment}+ sentiment score
          </div>
        </div>
      </div>
      
      <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
    </div>
  );
};

export default AdvancedFilters;
