
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload, Check, X, Server, Monitor, Smartphone, Tablet } from "lucide-react";
import { TestCase, Device, predefinedTestCases, predefinedDevices } from "@/utils/jobsData";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface TestFormProps {
  onSubmit: (name: string, testCases: TestCase[], devices: Device[]) => void;
}

const TestForm = ({ onSubmit }: TestFormProps) => {
  const [name, setName] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [testCases, setTestCases] = useState<TestCase[]>(predefinedTestCases);
  const [devices, setDevices] = useState<Device[]>(predefinedDevices);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const selectedTestCases = testCases.filter(tc => tc.enabled);
      const selectedDevices = devices.filter(d => d.selected);
      onSubmit(name.trim(), selectedTestCases, selectedDevices);
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

  const handleTestCaseToggle = (id: string) => {
    setTestCases(prevCases => 
      prevCases.map(tc => 
        tc.id === id ? { ...tc, enabled: !tc.enabled } : tc
      )
    );
  };

  const handleDeviceToggle = (id: string) => {
    setDevices(prevDevices => 
      prevDevices.map(d => 
        d.id === id ? { ...d, selected: !d.selected } : d
      )
    );
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'desktop': return <Monitor className="w-4 h-4 mr-2" />;
      case 'mobile': return <Smartphone className="w-4 h-4 mr-2" />;
      case 'tablet': return <Tablet className="w-4 h-4 mr-2" />;
      case 'server': return <Server className="w-4 h-4 mr-2" />;
      default: return <Monitor className="w-4 h-4 mr-2" />;
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

      <Tabs defaultValue="test-cases" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="test-cases" className="space-y-4 mt-2">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Select test cases to run
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {testCases.map((testCase) => (
                <div 
                  key={testCase.id} 
                  className="flex items-start space-x-2 p-2 rounded-md border border-border/40 bg-background/70"
                >
                  <Checkbox 
                    id={`tc-${testCase.id}`}
                    checked={testCase.enabled}
                    onCheckedChange={() => handleTestCaseToggle(testCase.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`tc-${testCase.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {testCase.name}
                    </label>
                    {testCase.description && (
                      <p className="text-xs text-muted-foreground">
                        {testCase.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4 mt-2">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Select devices to run tests on
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {devices.map((device) => (
                <div 
                  key={device.id} 
                  className="flex items-start space-x-2 p-2 rounded-md border border-border/40 bg-background/70"
                >
                  <Checkbox 
                    id={`dev-${device.id}`}
                    checked={device.selected}
                    onCheckedChange={() => handleDeviceToggle(device.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={`dev-${device.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      {getDeviceIcon(device.type)}
                      {device.name}
                    </label>
                    {device.os && (
                      <p className="text-xs text-muted-foreground">
                        {device.os}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="file" className="text-sm font-medium">
          Custom Test File (Optional)
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
              {fileName ? fileName : "Upload custom test file"}
            </span>
          </label>
          
          {uploadStatus === "uploading" && (
            <div className="w-8 h-8 flex items-center justify-center">
              <LoadingSpinner size="sm" />
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
          disabled={!name.trim() || !testCases.some(tc => tc.enabled) || !devices.some(d => d.selected)}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Create and Run Test Job
        </Button>
      </div>
    </form>
  );
};

export default TestForm;
