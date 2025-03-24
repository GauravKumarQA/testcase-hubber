
import { useState } from "react";
import { Plus } from "lucide-react";
import TestForm from "./TestForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NewJobButtonProps {
  onJobCreated: (jobName: string) => void;
}

const NewJobButton = ({ onJobCreated }: NewJobButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleJobCreated = (jobName: string) => {
    onJobCreated(jobName);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white flex items-center rounded-lg py-2 px-4 transition-all duration-300 transform hover:shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          New Test Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-card border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Test Job</DialogTitle>
        </DialogHeader>
        <TestForm onSubmit={handleJobCreated} />
      </DialogContent>
    </Dialog>
  );
};

export default NewJobButton;
