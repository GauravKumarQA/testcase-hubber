
import { Link } from "react-router-dom";
import { PlayCircle, BarChart2, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <header className="bg-background border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <PlayCircle className="w-7 h-7 text-primary" />
            <span className="text-lg font-medium">TestHub</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" icon={<BarChart2 className="w-4 h-4" />} label="Dashboard" exact />
          <NavLink to="/history" icon={<Clock className="w-4 h-4" />} label="History" />
          <NavLink to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>

        <div className="flex items-center space-x-4">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            Documentation
          </button>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}

const NavLink = ({ to, label, icon, exact = false }: NavLinkProps) => {
  // In a real app, you'd check if this route is active
  const isActive = window.location.pathname === to || 
    (!exact && window.location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/60 hover:text-foreground hover:bg-muted"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;
