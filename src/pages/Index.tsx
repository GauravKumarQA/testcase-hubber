
import { useState, useEffect } from "react";
import { Search, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { predefinedJobs, TestJob, createJob, Device, TestCase } from "@/utils/jobsData";
import JobCard from "@/components/jobs/JobCard";
import NewJobButton from "@/components/jobs/NewJobButton";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";

const Index = () => {
  const [jobs, setJobs] = useState<TestJob[]>(predefinedJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateJob = (jobName: string, testCases: TestCase[], devices: Device[]) => {
    const newJob = createJob(jobName, testCases, devices);
    setJobs(prevJobs => [newJob, ...prevJobs]);
    
    toast.success("New test job created", {
      description: `Job "${jobName}" has been created with ${testCases.length} test cases on ${devices.length} devices.`,
    });
    
    // Simulate job state changes
    setTimeout(() => {
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === newJob.id ? { ...job, status: 'running' } : job
      ));
    }, 2000);
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setJobs(prevJobs => prevJobs.map(job => {
        if (job.id === newJob.id) {
          const testCount = testCases.length * devices.length;
          const passedTests = success ? testCount : Math.floor(testCount * 0.7);
          const failedTests = testCount - passedTests;
          
          return { 
            ...job, 
            status: success ? 'success' : 'failed',
            endTime: new Date().toISOString(),
            duration: Math.floor(Math.random() * 10000) + 5000,
            testCount,
            passedTests,
            failedTests,
            skippedTests: 0,
          };
        }
        return job;
      }));
      
      toast(success ? "Tests completed successfully" : "Tests failed", {
        description: `Job "${jobName}" has finished running.`,
      });
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="page-container page-transition animate-slide-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Test Templates</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage test job templates
            </p>
          </div>
          
          <NewJobButton onJobCreated={handleCreateJob} />
        </div>
        
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9 bg-background border-input/80 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[220px] bg-muted/40 rounded-lg"></div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-secondary/60 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No templates found</h3>
            <p className="text-muted-foreground max-w-md">
              {searchTerm 
                ? `No templates matching "${searchTerm}" were found. Try a different search term.` 
                : "You haven't created any test templates yet. Create a new job to get started."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
