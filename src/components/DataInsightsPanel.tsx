
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface DataInsightsPanelProps {
  data: any[];
}

const COLORS = ['#8B5CF6', '#0EA5E9', '#D946EF', '#F97316', '#22C55E'];

const DataInsightsPanel = ({ data }: DataInsightsPanelProps) => {
  // Skip rendering if no data
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate insights from data
  const insights = useMemo(() => {
    // Get data properties
    const sampleItem = data[0];
    const numericKeys = Object.keys(sampleItem).filter(
      key => typeof sampleItem[key] === 'number'
    );
    
    // For medium distribution (pie chart)
    const mediumCounts: Record<string, number> = {};
    if (sampleItem.medium) {
      data.forEach(item => {
        const medium = item.medium;
        mediumCounts[medium] = (mediumCounts[medium] || 0) + 1;
      });
    }
    
    const mediumData = Object.keys(mediumCounts).map(medium => ({
      name: medium,
      value: mediumCounts[medium]
    }));
    
    // For performance by medium (bar chart)
    const performanceByMedium: Record<string, { engagement: number, conversion: number, count: number }> = {};
    if (sampleItem.medium && sampleItem.engagement && sampleItem.conversion) {
      data.forEach(item => {
        const medium = item.medium;
        if (!performanceByMedium[medium]) {
          performanceByMedium[medium] = { engagement: 0, conversion: 0, count: 0 };
        }
        performanceByMedium[medium].engagement += item.engagement || 0;
        performanceByMedium[medium].conversion += item.conversion || 0;
        performanceByMedium[medium].count += 1;
      });
    }
    
    const performanceData = Object.keys(performanceByMedium).map(medium => ({
      name: medium,
      engagement: Math.round(performanceByMedium[medium].engagement / performanceByMedium[medium].count),
      conversion: Math.round(performanceByMedium[medium].conversion / performanceByMedium[medium].count)
    }));
    
    // For trend data (line chart)
    let trendData: any[] = [];
    if (sampleItem.date && sampleItem.engagement) {
      // Group by date
      const dateGroups: Record<string, { engagement: number, conversion: number, count: number }> = {};
      data.forEach(item => {
        const date = item.date.substring(0, 7); // Get YYYY-MM part
        if (!dateGroups[date]) {
          dateGroups[date] = { engagement: 0, conversion: 0, count: 0 };
        }
        dateGroups[date].engagement += item.engagement || 0;
        dateGroups[date].conversion += item.conversion || 0;
        dateGroups[date].count += 1;
      });
      
      // Convert to array and sort by date
      trendData = Object.keys(dateGroups)
        .map(date => ({
          date,
          engagement: Math.round(dateGroups[date].engagement / dateGroups[date].count),
          conversion: Math.round(dateGroups[date].conversion / dateGroups[date].count)
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }
    
    // Calculate key metrics
    const totalEngagement = data.reduce((sum, item) => sum + (item.engagement || 0), 0);
    const totalConversion = data.reduce((sum, item) => sum + (item.conversion || 0), 0);
    const avgSentiment = data.reduce((sum, item) => sum + (item.sentiment || 0), 0) / data.length;
    
    // Calculate conversion rate
    const conversionRate = totalEngagement > 0 
      ? (totalConversion / totalEngagement * 100).toFixed(2) + '%'
      : 'N/A';
    
    // Find best performing medium
    let bestMedium = '';
    let bestConversionRate = 0;
    Object.keys(performanceByMedium).forEach(medium => {
      const mediumStats = performanceByMedium[medium];
      const convRate = mediumStats.conversion / mediumStats.engagement;
      if (convRate > bestConversionRate) {
        bestConversionRate = convRate;
        bestMedium = medium;
      }
    });

    return {
      mediumData,
      performanceData,
      trendData,
      totalEngagement,
      totalConversion,
      conversionRate,
      avgSentiment,
      bestMedium
    };
  }, [data]);
  
  // Generate text insights
  const textInsights = useMemo(() => {
    if (!insights) return [];
    
    const insightItems = [
      {
        title: "Best Performing Medium",
        description: `${insights.bestMedium} shows the highest conversion rate among all mediums.`,
        color: "purple",
        icon: <TrendingUp className="h-5 w-5" />
      },
      {
        title: "Audience Engagement Trend",
        description: insights.trendData.length > 1 ? 
          (insights.trendData[insights.trendData.length - 1].engagement > insights.trendData[0].engagement ?
            "Engagement is trending upward. Continue with similar content strategies." :
            "Engagement is trending downward. Consider refreshing your creative approach.") :
          "Not enough trend data to analyze engagement patterns.",
        color: "blue",
        icon: insights.trendData.length > 1 && 
          insights.trendData[insights.trendData.length - 1].engagement > insights.trendData[0].engagement ? 
          <ArrowUpRight className="h-5 w-5" /> : 
          <ArrowDownRight className="h-5 w-5" />
      },
      {
        title: "Conversion Performance",
        description: `Your overall conversion rate is ${insights.conversionRate}. ${
          parseFloat(insights.conversionRate) > 5 ? 
            "This is above industry average." : 
            "There's room for improvement."
        }`,
        color: "pink",
        icon: <ArrowUpRight className="h-5 w-5" />
      },
      {
        title: "Medium Distribution",
        description: `Your content is distributed across ${insights.mediumData.length} different mediums. ${
          insights.mediumData.length > 3 ? 
            "Good diversification of content types." : 
            "Consider expanding to more platforms for wider reach."
        }`,
        color: "orange",
        icon: <TrendingUp className="h-5 w-5" />
      },
      {
        title: "Creative Sentiment",
        description: `Average sentiment score is ${insights.avgSentiment.toFixed(1)}/100. ${
          insights.avgSentiment > 70 ? 
            "Strong positive audience reaction." : 
            insights.avgSentiment > 50 ? 
              "Moderately positive sentiment." : 
              "Audience sentiment needs improvement."
        }`,
        color: "green",
        icon: insights.avgSentiment > 50 ? 
          <ArrowUpRight className="h-5 w-5" /> : 
          <ArrowDownRight className="h-5 w-5" />
      }
    ];
    
    return insightItems;
  }, [insights]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Engagement</div>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold">{insights.totalEngagement.toLocaleString()}</div>
              <Badge className="ml-2 bg-insight-blue/10 text-insight-blue">Impressions</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Conversions</div>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold">{insights.totalConversion.toLocaleString()}</div>
              <Badge className="ml-2 bg-insight-purple/10 text-insight-purple">Actions</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold">{insights.conversionRate}</div>
              <ArrowUpRight className="ml-2 h-4 w-4 text-insight-green" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Avg. Sentiment</div>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold">{insights.avgSentiment.toFixed(1)}</div>
              <Badge className="ml-2 bg-insight-pink/10 text-insight-pink">Out of 100</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="medium">
            <TabsList className="mb-4">
              <TabsTrigger value="medium">By Medium</TabsTrigger>
              <TabsTrigger value="distribution">Medium Distribution</TabsTrigger>
              <TabsTrigger value="trends">Time Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="medium">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insights.performanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8B5CF6" name="Engagement" />
                    <Bar dataKey="conversion" fill="#F97316" name="Conversion" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="distribution">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insights.mediumData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {insights.mediumData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={insights.trendData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="engagement" stroke="#8B5CF6" activeDot={{ r: 8 }} name="Engagement" />
                    <Line type="monotone" dataKey="conversion" stroke="#F97316" name="Conversion" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Insights Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {textInsights.map((insight, index) => (
          <div key={index} className={`insight-card insight-card-${insight.color}`}>
            <div className="flex items-center gap-2">
              {insight.icon}
              <h3 className="font-medium">{insight.title}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataInsightsPanel;
