import { useState } from "react";
import { PromptInput } from "@/components/PromptInput";
import { AIComparisonCard } from "@/components/AIComparisonCard";
import { toast } from "sonner";

interface AIResponse {
  model: string;
  response: string;
  responseTime: number;
  isLoading: boolean;
}

const AI_MODELS = [
  {
    name: "GPT-5",
    model: "openai/gpt-5",
    color: "#10a37f",
    key: "gpt5",
  },
  {
    name: "GPT-5 Mini",
    model: "openai/gpt-5-mini",
    color: "#15b088",
    key: "gpt5-mini",
  },
  {
    name: "GPT-5 Nano",
    model: "openai/gpt-5-nano",
    color: "#20c997",
    key: "gpt5-nano",
  },
  {
    name: "Gemini Pro",
    model: "google/gemini-2.5-pro",
    color: "#4285f4",
    key: "gemini-pro",
  },
  {
    name: "Gemini Flash",
    model: "google/gemini-2.5-flash",
    color: "#0f9d58",
    key: "gemini-flash",
  },
  {
    name: "Gemini Lite",
    model: "google/gemini-2.5-flash-lite",
    color: "#34a853",
    key: "gemini-lite",
  },
];

const Index = () => {
  const [responses, setResponses] = useState<Record<string, AIResponse>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prompt: string, files: File[]) => {
    setIsLoading(true);

    // Convert files to base64
    const filePromises = files.map(async (file) => {
      return new Promise<{ type: string; data: string; name: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve({
            type: file.type,
            data: base64,
            name: file.name
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const fileData = await Promise.all(filePromises);

    // Initialize all responses as loading
    const initialResponses: Record<string, AIResponse> = {};
    AI_MODELS.forEach((model) => {
      initialResponses[model.key] = {
        model: model.model,
        response: "",
        responseTime: 0,
        isLoading: true,
      };
    });
    setResponses(initialResponses);

    // Call each AI model
    const promises = AI_MODELS.map(async (model) => {
      const startTime = Date.now();
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-compare`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              prompt,
              model: model.model,
              files: fileData,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        setResponses((prev) => ({
          ...prev,
          [model.key]: {
            model: model.model,
            response: data.response || data.error || "No response",
            responseTime,
            isLoading: false,
          },
        }));
      } catch (error) {
        console.error(`Error calling ${model.name}:`, error);
        const endTime = Date.now();
        setResponses((prev) => ({
          ...prev,
          [model.key]: {
            model: model.model,
            response: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            responseTime: endTime - startTime,
            isLoading: false,
          },
        }));
      }
    });

    await Promise.all(promises);
    setIsLoading(false);
    toast.success("All AI models responded!");
  };

  const fastestTime = Object.values(responses)
    .filter((r) => !r.isLoading && r.responseTime > 0)
    .reduce((min, r) => Math.min(min, r.responseTime), Infinity);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Comparison Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare responses from multiple AI models in real-time
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Input Section */}
        <section className="sticky top-[120px] z-40 pb-6 bg-background/95 backdrop-blur-sm">
          <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {/* Comparison Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_MODELS.map((model) => (
            <AIComparisonCard
              key={model.key}
              name={model.name}
              model={model.model}
              response={responses[model.key]?.response || ""}
              isLoading={responses[model.key]?.isLoading || false}
              responseTime={responses[model.key]?.responseTime}
              isFastest={
                responses[model.key]?.responseTime === fastestTime &&
                fastestTime !== Infinity
              }
              color={model.color}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;
