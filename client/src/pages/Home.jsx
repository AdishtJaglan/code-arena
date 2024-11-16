import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      <Navbar />
      <div className="mt-20 flex flex-col items-center justify-center">
        <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-extrabold text-transparent">
          Welcome to Problem Solver
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          Test your skills with coding challenges.
        </p>
        <Link
          to="/problems"
          className="mt-8 rounded bg-indigo-600 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-indigo-500"
        >
          View Problems
        </Link>
      </div>
    </div>
  );
};

export default Home;
