
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, Clock, CheckCircle2, AlertTriangle, 
  Timer, Info, PlayCircle, PauseCircle, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialJobs, TestJob, formatDuration, getStatusColor, getTestResultColor } from "@/utils/jobsData";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<TestJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching job data
    const timer = setTimeout(() => {
      const foundJob = initialJobs.find(j => j.id === id) || null;
      setJob(foundJob);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleCancel = () => {
    if (!job) return;
    
    setJob({ ...job, status: 'canceled' });
    toast.success("Job canceled", {
      description: "The test job has been canceled successfully."
    });
  };

  const handleRerun = () => {
    if (!job) return;
    
    setJob({ ...job, status: 'running', startTime: new Date().toISOString() });
    toast("Job restarted", {
      description: "The test job is now running again."
    });
    
    // Simulate job completing after a delay
    setTimeout(() => {
      setJob(prevJob => {
        if (!prevJob) return null;
        
        const success = Math.random() > 0.3;
        return {
          ...prevJob,
          status: success ? 'success' : 'failed',
          endTime: new Date().toISOString(),
          duration: Math.floor(Math.random() * 10000) + 5000,
        };
      });
      
      toast("Job completed", {
        description: "The test job has finished running."
      });
    }, 5000);
  };

  const handleDelete = () => {
    toast.success("Job deleted", {
      description: "The test job has been deleted successfully."
    });
    // In a real app, you would redirect to the jobs list page
    // and remove the job from state
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="page-container animate-fade-in flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="page-container animate-fade-in">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Jobs
          </Link>
          
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested test job could not be found.</p>
            <Button asChild>
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-container animate-fade-in">
        <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>
        
        <div className="glass-card rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-semibold">{job.name}</h1>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(job.status)}`}>
                  {job.status === 'running' ? (
                    <LoadingSpinner size="sm" />
                  ) : job.status === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : job.status === 'failed' ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span className="capitalize">{job.status}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1" />
                  <span>ID: {job.id}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>Started: {new Date(job.startTime).toLocaleString()}</span>
                </div>
                {job.endTime && (
                  <div className="flex items-center">
                    <Timer className="w-3.5 h-3.5 mr-1" />
                    <span>Duration: {formatDuration(job.duration || 0)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 self-end sm:self-center">
              {job.status === 'running' ? (
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={handleCancel}
                >
                  <PauseCircle className="w-4 h-4" />
                  Cancel
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="gap-1"
                  onClick={handleRerun}
                >
                  <PlayCircle className="w-4 h-4" />
                  Rerun
                </Button>
              )}
              <Button 
                variant="destructive" 
                className="gap-1"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard 
              label="Total Tests"
              value={job.testCount}
              icon={<Info className="text-primary" />}
            />
            <StatCard 
              label="Passed"
              value={job.passedTests}
              icon={<CheckCircle2 className="text-success" />}
            />
            <StatCard 
              label="Failed"
              value={job.failedTests}
              icon={<AlertTriangle className="text-error" />}
            />
          </div>
          
          <h2 className="text-lg font-medium mb-4">Test Results</h2>
          
          {job.testResults.length > 0 ? (
            <div className="glass-card border border-border/30 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30 bg-secondary/50">
                      <th className="text-left p-3 font-medium">Test Name</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-right p-3 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.testResults.map((test) => (
                      <tr key={test.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-left">{test.name}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center">
                            <span className={`inline-flex items-center gap-1 ${getTestResultColor(test.status)}`}>
                              {test.status === 'passed' ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : test.status === 'failed' ? (
                                <AlertTriangle className="w-4 h-4" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )}
                              <span className="capitalize">{test.status}</span>
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          {formatDuration(test.duration)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border/50 rounded-lg bg-secondary/20">
              <p className="text-muted-foreground">No test results available</p>
            </div>
          )}
          
          {job.status === 'failed' && job.testResults.some(t => t.status === 'failed' && t.errorMessage) && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-4">Error Details</h2>
              {job.testResults
                .filter(t => t.status === 'failed' && t.errorMessage)
                .map(test => (
                  <div key={`error-${test.id}`} className="mb-4 last:mb-0">
                    <h3 className="font-medium text-error mb-2">{test.name}</h3>
                    <pre className="bg-secondary/30 text-error/80 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                      {test.errorMessage}
                    </pre>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="glass-card border border-border/30 rounded-lg p-4 flex items-center">
    <div className="w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center mr-3">
      <div className="w-5 h-5">
        {icon}
      </div>
    </div>
    <div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </div>
);

export default JobDetail;
