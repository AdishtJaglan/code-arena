/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, X, Info } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "@/configs/env-config";
import axios from "axios";

const StepRequest = ({ partnerData, onSendRequest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problemSolvingData, setProblemSolvingData] = useState([
    { name: "Easy", solved: partnerData?.statistics?.easyCount || 0 },
    { name: "Medium", solved: partnerData?.statistics?.mediumCount || 0 },
    { name: "Hard", solved: partnerData?.statistics?.hardCount || 0 },
  ]);

  const SkippedStepContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-gray-950/20 p-6 text-center"
    >
      <div className="rounded-full bg-gray-800 p-4">
        <X className="h-12 w-12 text-blue-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-200">
        Accountability Partner Skipped
      </h2>
      <p className="max-w-md text-gray-400">
        You&apos;ve chosen to skip selecting an accountability partner for now.
        This can be changed later in your profile settings.
      </p>
    </motion.div>
  );

  useEffect(() => {
    if (!partnerData?._id) return;

    const renderPartnerQuestionData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/questions-solved/${partnerData._id}`,
        );

        const { easy = 0, medium = 0, hard = 0 } = response?.data?.data || {};

        setProblemSolvingData([
          { name: "Easy", solved: easy },
          { name: "Medium", solved: medium },
          { name: "Hard", solved: hard },
        ]);
      } catch (error) {
        console.error("Unable to fetch partner question data: " + error);
      }
    };

    renderPartnerQuestionData();
  }, [partnerData?._id]);

  const renderPartnerContent = () => (
    <>
      <div className="flex items-center space-x-4 rounded-lg bg-gradient-to-r from-gray-800 to-blue-900/20 p-4 shadow-md">
        <img
          src={partnerData.profilePicture}
          alt={`${partnerData.username}'s profile`}
          className="h-16 w-16 rounded-full border-2 border-blue-500"
        />
        <div>
          <h2 className="text-xl font-bold text-blue-300">
            {partnerData.username}
          </h2>
          <p className="text-sm text-gray-400">Rating: {partnerData.rating}</p>
        </div>
      </div>

      <div className="h-32 overflow-y-auto rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
        <h3 className="text-md mb-2 font-semibold text-gray-300">Bio</h3>
        <p className="text-sm italic text-gray-400">{partnerData.bio}</p>
      </div>

      <div className="h-48 rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
        <h3 className="text-md mb-2 font-semibold text-gray-300">
          Problem Solving Distribution
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={problemSolvingData}>
            <XAxis dataKey="name" stroke="#3b82f6" />
            <YAxis stroke="#3b82f6" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#3b82f6",
                borderRadius: "2px",
                border: "1px solid ##3b82f6",
              }}
              labelStyle={{ color: "#000" }}
            />
            <Line
              type="monotone"
              dataKey="solved"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => onSendRequest(partnerData._id)}
          className="flex flex-1 transform items-center justify-center rounded-lg bg-blue-500/70 py-3 text-white transition-all hover:scale-[1.02] hover:bg-blue-500/50"
        >
          <Send className="mr-2" size={20} />
          Send Partner Request
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="transform rounded-lg bg-gray-800 px-4 text-gray-300 transition-all hover:scale-[1.1] hover:bg-gray-700"
        >
          <Info size={20} />
        </button>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-violet-600 h-full space-y-4 overflow-y-auto p-2"
    >
      {partnerData ? renderPartnerContent() : <SkippedStepContent />}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-lg border border-violet-800/50 bg-gray-800 p-6"
          >
            <h2 className="mb-4 text-xl font-bold text-violet-400">
              Accountability Partner
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>An accountability partner can help you:</p>
              <ul className="list-inside list-disc space-y-2">
                <li>Stay motivated and consistent</li>
                <li>Provide feedback and support</li>
                <li>Help track your coding progress</li>
                <li>Create a collaborative learning environment</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                You can skip this step and add a partner later in your profile
                settings.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-white transition-colors hover:bg-violet-700"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default StepRequest;
