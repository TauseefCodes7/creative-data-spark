
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Target,
  Zap
} from "lucide-react";

interface AIRecommendationsProps {
  data: any[];
}

const AIRecommendations = ({ data }: AIRecommendationsProps) => {
  const generateRecommendations = () => {
    // Analyze medium performance
    const mediumPerformance = data.reduce((acc: Record<string, any>, item) => {
      if (!acc[item.medium]) {
        acc[item.medium] = { 
          engagement: 0, 
          conversion: 0, 
          sentiment: 0,
          count: 0 
        };
      }
      acc[item.medium].engagement += item.engagement || 0;
      acc[item.medium].conversion += item.conversion || 0;
      acc[item.medium].sentiment += item.sentiment || 0;
      acc[item.medium].count += 1;
      return acc;
    }, {});

    // Calculate averages and identify trends
    const recommendations = [];
    
    // Best performing medium
    const bestMedium = Object.entries(mediumPerformance).reduce((best, [medium, stats]: [string, any]) => {
      const convRate = stats.conversion / stats.engagement;
      if (!best || convRate > best.rate) {
        return { medium, rate: convRate };
      }
      return best;
    }, null);

    if (bestMedium) {
      recommendations.push({
        title: "Channel Optimization",
        description: `Focus more resources on ${bestMedium.medium} content, as it shows the highest conversion rate.`,
        icon: <Target className="h-5 w-5" />,
        type: "success"
      });
    }

    // Sentiment analysis
    const avgSentiment = data.reduce((sum, item) => sum + (item.sentiment || 0), 0) / data.length;
    if (avgSentiment < 70) {
      recommendations.push({
        title: "Content Sentiment",
        description: "Consider revising content strategy to improve audience sentiment. Focus on more positive and engaging narratives.",
        icon: <TrendingDown className="h-5 w-5" />,
        type: "warning"
      });
    }

    // Engagement trends
    const recentData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentEngagement = recentData.slice(0, 5).reduce((sum, item) => sum + item.engagement, 0) / 5;
    const olderEngagement = recentData.slice(-5).reduce((sum, item) => sum + item.engagement, 0) / 5;
    
    if (recentEngagement < olderEngagement) {
      recommendations.push({
        title: "Engagement Alert",
        description: "Recent content shows declining engagement. Consider A/B testing new content formats.",
        icon: <Zap className="h-5 w-5" />,
        type: "warning"
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="mt-1">{rec.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <Badge variant={rec.type === "warning" ? "destructive" : "default"}>
                    {rec.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {rec.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
