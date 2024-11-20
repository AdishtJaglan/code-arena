import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between bg-gradient-to-r from-gray-900 via-gray-800 to-violet-900 px-6 py-4 shadow-2xl">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-300 transition-colors hover:text-violet-400"
        >
          Home
        </Link>
        <Link
          to="/problems"
          className="text-gray-300 transition-colors hover:text-violet-400"
        >
          Problems
        </Link>
        <Link
          to="/leaderboard"
          className="text-gray-300 transition-colors hover:text-violet-400"
        >
          Leaderboard
        </Link>
        <Link
          to="/discuss"
          className="text-gray-300 transition-colors hover:text-violet-400"
        >
          Discuss
        </Link>
      </div>

      <div className="flex items-center justify-end gap-6">
        <Link
          to="/login"
          className="rounded-lg bg-violet-600 px-4 py-2 text-white transition-colors hover:bg-violet-700"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="rounded-lg border border-violet-500 px-4 py-2 text-violet-300 transition-colors hover:bg-violet-900/50"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
