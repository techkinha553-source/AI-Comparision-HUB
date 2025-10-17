import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

interface PromptInputProps {
  onSubmit: (prompt: string, files: File[]) => void;
  isLoading: boolean;
}

export const PromptInput = ({ onSubmit, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if ((prompt.trim() || files.length > 0) && !isLoading) {
      onSubmit(prompt, files);
      setPrompt("");
      setFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file size (max 10MB per file)
    const oversizedFiles = selectedFiles.filter(f => f.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Some files are too large. Max size is 10MB per file.");
      return;
    }

    // Check total files (max 5)
    if (files.length + selectedFiles.length > 5) {
      toast.error("Maximum 5 files allowed.");
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group flex items-center gap-2 px-3 py-2 bg-card border-2 border-primary/50 rounded-lg"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                  <Paperclip className="w-6 h-6" />
                </div>
              )}
              <span className="text-sm max-w-[150px] truncate">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute -top-2 -right-2 rounded-full bg-destructive hover:bg-destructive/90"
                onClick={() => removeFile(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <Textarea
          placeholder="Enter your prompt to compare AI responses... (you can also attach images or files)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[120px] pr-28 text-lg resize-none bg-card border-2 focus:border-primary"
          disabled={isLoading}
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (!prompt.trim() && files.length === 0)}
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
