import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/configs/env-config";
import Navbar from "@/components/Navbar";
import axios from "axios";

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const getLeaderboardData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/leaderboard?page=${currentPage}&limit=${itemsPerPage}`,
        );
        setLeaderboardData(response.data.data);
      } catch (error) {
        console.error("Error getting leaderboard data: " + error);
      }
    };

    getLeaderboardData();
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(leaderboardData.count / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleUsernameClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const getRatingClass = (rating) => {
    if (rating >= 2000) return "bg-violet-900/30 text-violet-400";
    if (rating >= 1500) return "bg-blue-900/30 text-blue-400";
    if (rating >= 1000) return "bg-green-900/30 text-green-400";
    return "bg-neutral-900/30 text-neutral-400";
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-neutral-100">
            Leaderboard
          </h1>
          <p className="mx-auto max-w-xl text-neutral-500">
            Top performers who have conquered the most challenging coding
            problems
          </p>
        </motion.div>

        {leaderboardData === null ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-lg bg-neutral-900"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50">
              {leaderboardData.users.map((user, index) => (
                <motion.div
                  key={user.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                  }}
                  className="flex items-center border-b border-neutral-800 p-4 transition-colors last:border-b-0 hover:bg-neutral-900/70"
                >
                  <div className="w-12 flex-none font-mono text-neutral-500">
                    {index + 1 + (currentPage > 1 ? (currentPage - 1) * 10 : 0)}
                  </div>

                  <div className="flex flex-grow items-center space-x-4">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="h-12 w-12 rounded-full border-2 border-neutral-700"
                    />
                    <div>
                      <div
                        onClick={() => handleUsernameClick(user.user_id)}
                        className="cursor-pointer font-semibold text-neutral-200 hover:text-neutral-400"
                      >
                        {user.username}
                      </div>
                      <div className="max-w-xs truncate text-sm text-neutral-500">
                        {user.bio}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-neutral-600" />
                      <span className="text-neutral-300">
                        {user.questionsSolved.length}
                      </span>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getRatingClass(user.rating)}`}
                    >
                      {user.rating}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <button
                onClick={handlePrevious}
                className="rounded-full bg-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-700"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="rounded-full bg-neutral-800 px-6 py-2 text-neutral-300">
                Page {currentPage} of{" "}
                {Math.ceil(leaderboardData.count / itemsPerPage)}
              </div>

              <button
                onClick={handleNext}
                className="rounded-full bg-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-700"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
