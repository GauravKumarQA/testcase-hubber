
import { useState } from "react";
import { ListCheck, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateId, TestCase, predefinedTestCases } from "@/utils/jobsData";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TestCases = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(predefinedTestCases);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreateTestCase = (values: FormValues) => {
    const newTestCase: TestCase = {
      id: `tc-${generateId()}`,
      name: values.name,
      description: values.description || undefined,
      enabled: true,
    };

    setTestCases((prev) => [...prev, newTestCase]);
    toast.success("Test case created", {
      description: `Test case "${values.name}" has been created.`,
    });
    form.reset();
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
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center rounded-lg py-2 px-4 transition-all duration-300 transform hover:shadow-lg">
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

        {testCases.length > 0 ? (
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
