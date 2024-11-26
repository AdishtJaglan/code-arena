import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageCircleCode,
  Trophy,
  MessageCircle,
  Home,
  LogIn,
  UserPlus,
} from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center space-x-2">
          <MessageCircleCode className="h-8 w-8 text-indigo-500" />
          <span className="text-2xl font-bold text-white">CodeArena</span>
        </Link>

        <div className="flex items-center space-x-6">
          {[
            { icon: Home, label: "Home", path: "/" },
            { icon: MessageCircleCode, label: "Problems", path: "/problems" },
            { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
            { icon: MessageCircle, label: "Discuss", path: "/discuss" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="group relative flex items-center space-x-2 text-gray-400 transition-colors duration-300 hover:text-white"
            >
              <item.icon className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100" />
              <span className="text-sm font-medium">{item.label}</span>
              <span className="absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-indigo-500 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-gray-400 transition-all hover:bg-gray-800 hover:text-white"
            asChild
          >
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
          <Button
            className="bg-indigo-700 transition-colors hover:bg-indigo-600"
            asChild
          >
            <Link to="/register">
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
