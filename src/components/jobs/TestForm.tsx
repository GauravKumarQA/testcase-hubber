
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload, Check, X } from "lucide-react";

interface TestFormProps {
  onSubmit: (name: string) => void;
}

const TestForm = ({ onSubmit }: TestFormProps) => {
  const [name, setName] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Simulate file upload
      setUploadStatus("uploading");
      setTimeout(() => {
        setUploadStatus(Math.random() > 0.9 ? "error" : "success");
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Job Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., API Integration Tests"
          className="bg-background/50 border-border/50 focus:border-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file" className="text-sm font-medium">
          Test File (Optional)
        </Label>
        <div className="flex items-center gap-2">
          <label
            htmlFor="file-upload"
            className={`
              flex-1 cursor-pointer bg-background/80 hover:bg-background/90 
              border border-dashed border-border/70 rounded-lg px-4 py-3
              flex items-center justify-center transition-colors
            `}
          >
            <input
              id="file-upload"
              type="file"
              accept=".js,.ts,.jsx,.tsx"
              className="sr-only"
              onChange={handleFileChange}
            />
            <Upload className="w-5 h-5 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground">
              {fileName ? fileName : "Upload test file"}
            </span>
          </label>
          
          {uploadStatus === "uploading" && (
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </div>
          )}
          
          {uploadStatus === "success" && (
            <div className="w-8 h-8 flex items-center justify-center bg-success/10 rounded-full">
              <Check className="w-5 h-5 text-success" />
            </div>
          )}
          
          {uploadStatus === "error" && (
            <div className="w-8 h-8 flex items-center justify-center bg-error/10 rounded-full">
              <X className="w-5 h-5 text-error" />
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border/30">
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2 transition-all hover:shadow-md"
          disabled={!name.trim()}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Create and Run Test Job
        </Button>
      </div>
    </form>
  );
};

export default TestForm;
