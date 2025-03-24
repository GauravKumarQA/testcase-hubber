
import { Link } from "react-router-dom";
import { Clock, AlertTriangle, CheckCircle2, RotateCw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { TestJob, formatDuration, getStatusColor, timeAgo } from "@/utils/jobsData";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface JobCardProps {
  job: TestJob;
  className?: string;
}

export const JobCard = ({ job, className }: JobCardProps) => {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'running':
        return <LoadingSpinner size="sm" />;
      case 'queued':
        return <Clock className="w-4 h-4" />;
      case 'canceled':
        return <RotateCw className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Link
      to={`/jobs/${job.id}`}
      className={cn(
        "group block glass-card p-4 rounded-lg transition-all duration-300",
        "hover:shadow-hover hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary/50",
        "animate-slide-in",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {job.name}
          </h3>
          <p className="mt-1 flex items-center text-muted-foreground text-sm">
            <Clock className="inline mr-1 w-3.5 h-3.5" />
            {timeAgo(job.startTime)}
          </p>
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-xs font-medium flex items-center space-x-1",
          getStatusColor(job.status)
        )}>
          {getStatusIcon()}
          <span className="capitalize">{job.status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Stat 
          label="Tests"
          value={job.testCount.toString()}
          icon={<Timer className="w-3.5 h-3.5 text-muted-foreground" />}
        />
        <Stat 
          label="Passed"
          value={job.passedTests.toString()}
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-success" />}
        />
        <Stat 
          label="Failed"
          value={job.failedTests.toString()}
          icon={<AlertTriangle className="w-3.5 h-3.5 text-error" />}
        />
      </div>
      
      {job.duration && (
        <div className="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground flex items-center">
          <Timer className="w-3.5 h-3.5 mr-1" />
          <span>Duration: {formatDuration(job.duration)}</span>
        </div>
      )}
    </Link>
  );
};

interface StatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const Stat = ({ label, value, icon }: StatProps) => (
  <div className="flex flex-col items-center justify-center bg-secondary/50 rounded-md py-2 px-2">
    <div className="flex items-center mb-1">
      {icon}
    </div>
    <span className="font-medium">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export default JobCard;
