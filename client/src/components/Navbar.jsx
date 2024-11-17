import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-4 shadow-lg">
      <div className="flex items-center gap-6">
        <p className="cursor-pointer text-gray-200 hover:text-white">Home</p>
        <p className="cursor-pointer text-gray-200 hover:text-white">
          Problems
        </p>
        <p className="cursor-pointer text-gray-200 hover:text-white">
          Leaderboard
        </p>
        <p className="cursor-pointer text-gray-200 hover:text-white">Discuss</p>
      </div>

      <div className="flex items-center justify-end gap-6">
        <Link
          to="/login"
          className="rounded-lg bg-orange-300 px-4 py-2 text-gray-800"
        >
          Login
        </Link>
        <Link to="/register" className="rounded-lg bg-indigo-700 px-4 py-2">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
