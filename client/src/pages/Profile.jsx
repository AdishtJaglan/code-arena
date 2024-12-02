import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Github,
  Linkedin,
  Twitter,
  Award,
  TrendingUp,
  CodeIcon,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/configs/env-config";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [questionStats, setQuestionStats] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [solvedQues, setSolvedQues] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [heatmap, setHeatmap] = useState(null);

  const fetchProfileData = async (id) => {
    try {
      const [
        userResponse,
        languageResponse,
        submissionResponse,
        heatMapResponse,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/user/user-data/${id}`),
        axios.get(`${API_BASE_URL}/submission/preferred-language/${id}`),
        axios.get(`${API_BASE_URL}/submission/recent-questions/${id}`),
        axios.get(`${API_BASE_URL}/submission/heatmap/${id}`),
      ]);

      const {
        contributedAnswers,
        contributedQuestions,
        solvedQuestions,
        totalComments,
        totalSubmissions,
        user,
      } = userResponse?.data?.data || {};

      const { daysActive, streaks, heatmapData } =
        heatMapResponse?.data?.data || {};

      const userLanguageData = languageResponse?.data?.data || {};
      const { acceptedSubmissions, allSubmissions } =
        submissionResponse?.data?.data || {};

      if (user) {
        setUserData(user);
        setUserStats({
          contributedAnswers,
          contributedQuestions,
          solvedQuestions,
          totalComments,
          totalSubmissions,
        });
      }
      setLanguageData(userLanguageData);
      setSolvedQues(acceptedSubmissions);
      setSubmissions(allSubmissions);
      setDayData({ streaks, daysActive });
      setHeatmap(heatmapData);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const fetchQuestionStats = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/questions-solved/${userId}`,
      );
      setQuestionStats(response?.data?.data || {});
    } catch (error) {
      console.error("Error fetching question stats:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData(id);
    }
  }, [id]);

  useEffect(() => {
    if (userData?._id) {
      fetchQuestionStats(userData._id);
    }
  }, [userData?._id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      <div className="mx-auto max-w-6xl">
        {userData !== null && userStats !== null && questionStats !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 md:grid-cols-3"
          >
            {/* Profile Overview */}
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <motion.img
                    src={userData.profilePicture}
                    alt={`${userData.username}'s profile`}
                    className="h-32 w-32 rounded-full border-4 border-gray-700 object-cover"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                  <h2 className="mt-4 text-2xl font-bold text-white">
                    {userData.username}
                  </h2>
                  <Badge variant="secondary" className="mt-2">
                    {userData.role}
                  </Badge>
                  <p className="mt-4 text-center text-gray-400">
                    {userData.bio}
                  </p>

                  {/* Social Links */}
                  <div className="mt-6 flex space-x-4">
                    <TooltipProvider>
                      {Object.entries(userData.socialLinks).map(
                        ([platform, link]) => (
                          <Tooltip key={platform}>
                            <TooltipTrigger asChild>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-colors hover:text-white"
                              >
                                {platform === "github" && <Github />}
                                {platform === "linkedin" && <Linkedin />}
                                {platform === "twitter" && <Twitter />}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              {platform.charAt(0).toUpperCase() +
                                platform.slice(1)}
                            </TooltipContent>
                          </Tooltip>
                        ),
                      )}
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats and Achievements */}
            <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="mr-2" /> Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* User Stats */}
                  <div>
                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                      <CodeIcon className="mr-2" /> Contribution Breakdown
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          icon: Award,
                          label: "Contributed Answers",
                          value: userStats.contributedAnswers,
                        },
                        {
                          icon: Target,
                          label: "Solved Questions",
                          value: userStats.solvedQuestions,
                        },
                        {
                          icon: CodeIcon,
                          label: "Total Submissions",
                          value: userStats.totalSubmissions,
                        },
                      ].map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 * index }}
                          className="flex items-center rounded-lg bg-gray-700 p-3"
                        >
                          <stat.icon className="mr-3 text-blue-400" />
                          <div>
                            <div className="text-sm text-gray-400">
                              {stat.label}
                            </div>
                            <div className="font-bold text-white">
                              {stat.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Problem Solving Chart */}
                  <div>
                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                      <Target className="mr-2" /> Problem Difficulty
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={questionStats}>
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <RechartsTooltip
                            contentStyle={{
                              background: "#333",
                              border: "none",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar
                            dataKey="value"
                            barSize={30}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
