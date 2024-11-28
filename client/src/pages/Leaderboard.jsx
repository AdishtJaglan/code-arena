import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowUp, ArrowDown, Star } from "lucide-react";
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

  const getRatingColor = (rating) => {
    if (rating >= 3000) return "text-amber-400";
    if (rating >= 2700) return "text-purple-500";
    if (rating >= 2400) return "text-blue-500";
    return "text-green-500";
  };

  const getRatingTier = (rating) => {
    if (rating >= 3000) return "Legendary";
    if (rating >= 2700) return "Master";
    if (rating >= 2400) return "Expert";
    return "Challenger";
  };

  const renderTrophyIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Trophy className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-gray-200">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-indigo-900/10 to-purple-900/20 opacity-50 blur-3xl"></div>
      <Navbar />
      <div className="container relative z-10 mx-auto px-4 pt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-5xl font-black text-transparent">
            Leaderboard
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Top performers who have conquered the most challenging coding
            problems
          </p>
        </motion.div>

        {leaderboardData === null ? (
          <div className="max-w-8xl mx-auto min-h-screen w-full animate-pulse rounded-lg bg-[#1a1a2e] p-4">
            <div className="mb-6 h-16 rounded-lg bg-[#16213e] shadow-lg"></div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-4 border-b border-[#534b6c] bg-[#0f3460] p-4 transition-all duration-300 hover:bg-[#213555]"
              >
                <div className="h-14 w-14 animate-pulse rounded-full bg-[#7e57c2]"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-5 w-3/4 rounded bg-[#534b6c]"></div>
                  <div className="h-4 w-1/2 rounded bg-[#3f3b54]"></div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-5 w-20 rounded bg-[#9c27b0]"></div>
                  <div className="h-4 w-16 rounded bg-[#6a1b9a]"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="p-4 text-left">Rank</th>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-center">Problems Solved</th>
                    <th className="p-4 text-center">Rating</th>
                    <th className="p-4 text-left">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                      }}
                      className="border-b border-gray-800 transition-colors hover:bg-gray-800/30"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <span>
                            {index +
                              1 +
                              (currentPage > 1 ? (currentPage - 1) * 10 : 0)}
                          </span>
                          {currentPage === 1 && renderTrophyIcon(index)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="h-12 w-12 rounded-full border-2 border-gray-700"
                          />
                          <div>
                            <div
                              onClick={() => handleUsernameClick(user.user_id)}
                              className="cursor-pointer font-semibold transition-colors duration-300 hover:text-purple-400"
                            >
                              {user.username}
                            </div>
                            <div className="max-w-xs truncate text-xs text-gray-500">
                              {user.bio}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{user.questionsSolved.length}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`font-bold ${getRatingColor(user.rating)}`}
                        >
                          {user.rating}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${getRatingColor(user.rating)} bg-gray-800`}
                        >
                          {getRatingTier(user.rating)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="my-8 flex justify-center space-x-4">
              <button
                onClick={handlePrevious}
                className="flex items-center space-x-2 rounded-lg bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                <ArrowUp className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="rounded-lg bg-gray-800 px-4 py-2 text-gray-300">
                Page {currentPage} of{" "}
                {Math.ceil(leaderboardData.count / itemsPerPage)}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 rounded-lg bg-gray-800 px-4 py-2 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                <span>Next</span>
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;