
import { useState } from "react";
import { ListCheck, Plus, Trash2, List, LayoutGrid } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateId, TestCase, predefinedTestCases } from "@/utils/jobsData";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const formSchema = z.object({
  id: z.string().min(2, { message: "ID must be at least 2 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ViewMode = "grid" | "list";

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(predefinedTestCases);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: `tc-${generateId()}`,
      name: "",
      description: "",
    },
  });

  const handleCreateTestCase = (values: FormValues) => {
    const newTestCase: TestCase = {
      id: values.id,
      name: values.name,
      description: values.description || undefined,
      enabled: true,
    };

    setTestCases((prev) => [...prev, newTestCase]);
    toast.success("Test case created", {
      description: `Test case "${values.name}" has been created.`,
    });
    form.reset({
      id: `tc-${generateId()}`,
      name: "",
      description: "",
    });
    setOpen(false);
  };

  const handleDeleteTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
    toast.info("Test case deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="page-container page-transition animate-slide-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Test Cases</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage test case definitions
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white flex items-center rounded-lg py-2 px-4 transition-all duration-300 transform hover:shadow-lg ml-2">
                  <Plus className="w-5 h-5 mr-2" />
                  New Test Case
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-card border-0">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Create New Test Case</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateTestCase)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID</FormLabel>
                          <FormControl>
                            <Input placeholder="tc-123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="API Authentication Test" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tests the API authentication flow with different credentials" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end pt-4">
                      <Button type="submit">Create Test Case</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {testCases.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testCases.map((testCase) => (
                <Card key={testCase.id} className="transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">{testCase.name}</CardTitle>
                    <CardDescription>ID: {testCase.id}</CardDescription>
                  </CardHeader>
                  {testCase.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{testCase.description}</p>
                    </CardContent>
                  )}
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {testCase.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteTestCase(testCase.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              {testCases.map((testCase, index) => (
                <div key={testCase.id}>
                  <div className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-grow flex items-center justify-between">
                      <div className="flex flex-col flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{testCase.name}</span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
                            {testCase.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">ID: {testCase.id}</div>
                        {testCase.description && (
                          <p className="text-sm text-muted-foreground mt-1">{testCase.description}</p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-4"
                        onClick={() => handleDeleteTestCase(testCase.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < testCases.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-secondary/60 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <ListCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No test cases found</h3>
            <p className="text-muted-foreground max-w-md">
              You haven't created any test cases yet. Create a new test case to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestCases;
