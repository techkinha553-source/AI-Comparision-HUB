import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIComparisonCardProps {
  name: string;
  model: string;
  response: string;
  isLoading: boolean;
  responseTime?: number;
  isFastest?: boolean;
  color: string;
}

const formatResponseTime = (ms: number) => {
  if (ms < 1000) {
    return `${ms}ms`;
  } else if (ms < 60000) {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  } else {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(2);
    return `${minutes}m ${seconds}s`;
  }
};

export const AIComparisonCard = ({
  name,
  model,
  response,
  isLoading,
  responseTime,
  isFastest,
  color,
}: AIComparisonCardProps) => {
  return (
    <div className="space-y-3">
      <Card
        className={cn(
          "relative overflow-hidden backdrop-blur-sm transition-all duration-300",
          "border-2 hover:shadow-lg",
          isLoading && "animate-pulse"
        )}
        style={{
          borderColor: color,
          background: `linear-gradient(135deg, ${color}08, transparent)`,
        }}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold" style={{ color }}>
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{model}</p>
            </div>
            {isFastest && responseTime && (
              <Badge className="bg-accent text-accent-foreground">
                ⚡ Fastest
              </Badge>
            )}
          </div>

          <div className="min-h-[200px] relative">
            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color }} />
              </div>
            ) : response ? (
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground whitespace-pre-wrap">{response}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Waiting for prompt...
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Response Time Bar */}
      {responseTime !== undefined && (
        <Card 
          className="border-2 bg-card/50 backdrop-blur-sm"
          style={{ borderColor: color }}
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-muted-foreground">
                Response Time
              </span>
            </div>
            <Badge 
              variant="secondary" 
              className="font-mono text-base"
              style={{ 
                borderColor: color,
                color: color
              }}
            >
              {formatResponseTime(responseTime)}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};
