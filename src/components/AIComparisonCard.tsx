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

        {responseTime !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Response time:</span>
            <Badge variant="secondary">{responseTime}ms</Badge>
          </div>
        )}

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
  );
};
