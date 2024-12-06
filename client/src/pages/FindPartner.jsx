/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitHub } from "@mui/icons-material";
import {
  Star,
  Code,
  Target,
  CheckCircle,
  Send,
  BarChart2,
  User,
  Activity,
} from "lucide-react";
import { API_BASE_URL } from "@/configs/env-config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "@/components/Navbar";

const PartnerCard = ({ partner }) => {
  const [isRequestSent, setIsRequestSent] = useState(false);

  const sendPartnerRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${API_BASE_URL}/partner/request`,
        {
          receiverId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("Request send successfully.");
        setIsRequestSent(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        "An unexpected error occurred";

      console.error("Error sending request: ", errorMessage);
      toast.error(`Error sending partner request: ${errorMessage}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-xl border border-black bg-black/90 p-6 transition-all"
    >
      <div className="grid grid-cols-6 gap-3">
        <div className="max-w-1/2 col-span-3 flex items-center justify-center space-x-6 md:w-auto">
          <div className="relative">
            <img
              src={partner.profilePicture}
              alt={`${partner.username}'s profile`}
              className="h-auto w-48 rounded-full border-4 border-black/50 object-cover"
            />
            <div
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-600"
              title="Active"
            >
              <Activity className="h-3 w-3 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">
                {partner.username}
              </h2>
              <div className="flex items-center text-yellow-500">
                <Star className="mr-1 h-4 w-4" />
                <span className="font-semibold">{partner.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">{partner.bio}</p>
          </div>
        </div>

        <div className="col-span-3 w-full flex-grow space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-400">Q:</span>
              <span className="rounded-full bg-black/50 px-2 py-1 text-gray-300">
                {partner.questionContributions}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-400">A:</span>
              <span className="rounded-full bg-black/50 px-2 py-1 text-gray-300">
                {partner.answerContributions}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {partner.socialLinks?.github && (
                <a
                  href={partner.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-all hover:text-white"
                  title="GitHub Profile"
                >
                  <GitHub className="h-5 w-5" />
                </a>
              )}
              {partner.socialLinks?.leetcode && (
                <a
                  href={partner.socialLinks.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-all hover:text-white"
                  title="LeetCode Profile"
                >
                  <Code className="h-5 w-5" />
                </a>
              )}
              {partner.socialLinks?.codeforces && (
                <a
                  href={partner.socialLinks.codeforces}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-all hover:text-white"
                  title="Codeforces Profile"
                >
                  <BarChart2 className="h-5 w-5" />
                </a>
              )}
            </div>

            <button
              onClick={() => sendPartnerRequest(partner?._id)}
              disabled={isRequestSent}
              className={`group/button relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold outline-none ring-1 transition-all duration-300 ${
                isRequestSent
                  ? "cursor-not-allowed bg-black/40 text-gray-500 ring-black/20"
                  : "bg-black/60 text-gray-300 ring-white/10 hover:bg-black/80 hover:text-white"
              }`}
            >
              <Send
                className={`mr-2 inline h-4 w-4 ${isRequestSent ? "opacity-50" : ""}`}
              />
              {isRequestSent ? "Sent Request" : "Send Request"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-black/50 p-2">
              <div className="flex items-center justify-center space-x-1">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-300">
                  {partner.submissions}
                </span>
              </div>
              <p className="text-xs text-gray-600">Submissions</p>
            </div>
            <div className="rounded-md bg-black/50 p-2">
              <div className="flex items-center justify-center space-x-1">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-300">
                  {partner.questionsSolved}
                </span>
              </div>
              <p className="text-xs text-gray-600">Questions Solved</p>
            </div>
            <div className="rounded-md bg-black/50 p-2">
              <div className="flex items-center justify-center space-x-1">
                <Star className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-300">
                  {partner.matchScore}
                </span>
              </div>
              <p className="text-xs text-gray-600">Match Score</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FindPartner = () => {
  const [partners, setPartners] = useState(null);

  useEffect(() => {
    const fetchPartnerList = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${API_BASE_URL}/user/potential-partners`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPartners(response?.data?.data?.potentialPartners);
      } catch (error) {
        console.error("Unable to fetch partner list: " + error);
      }
    };

    fetchPartnerList();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-gray-200">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-neutral-900/50 opacity-50 blur-3xl"></div>

      <Navbar />

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Page Header */}
        <div className="pt-12 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-6xl font-black leading-tight text-neutral-200"
          >
            Code Partners
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-xl text-gray-400"
          >
            Connect with skilled developers, collaborate on challenges, and grow
            together
          </motion.p>
        </div>

        {/* Partners List */}
        <div className="mt-16 space-y-6">
          {partners === null ? (
            <div className="text-center text-gray-500">Loading partners...</div>
          ) : (
            partners.map((partner, index) => (
              <PartnerCard key={index} partner={partner} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPartner;
