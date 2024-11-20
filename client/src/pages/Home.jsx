import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-violet-900 text-gray-200">
      <Navbar />
      <div className="mt-20 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-extrabold text-transparent">
          Problem Solver
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-400">
          Sharpen your coding skills with challenging problems, track your
          progress, and join a community of learners.
        </p>
        <Link
          to="/problems"
          className="mt-8 rounded-lg bg-violet-600 px-6 py-3 text-lg font-medium text-white transition-all hover:scale-[1.02] hover:bg-violet-700 active:scale-[0.98]"
        >
          Start Coding
        </Link>
      </div>
    </div>
  );
};

export default Home;
