import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageCircleCode, CheckCircle, Languages } from "lucide-react";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/configs/env-config";
import axios from "axios";
import D3Heatmap from "@/components/Heatmap";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("solved");
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [questionStats, setQuestionStats] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const [submissions, setSubmissions] = useState(null);
  const [solvedQues, setSolvedQues] = useState(null);
  const [dayData, setDayData] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [partnerRank, setPartnerRank] = useState(null);

  const fetchProfileData = async (id) => {
    try {
      const [
        userResponse,
        languageResponse,
        submissionResponse,
        heatMapResponse,
        partnerResponse,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/user/user-data/${id}`),
        axios.get(`${API_BASE_URL}/submission/preferred-language/${id}`),
        axios.get(`${API_BASE_URL}/submission/recent-questions/${id}`),
        axios.get(`${API_BASE_URL}/submission/heatmap/${id}`),
        axios.get(`${API_BASE_URL}/user/partner/${id}`),
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

      const { partner } = partnerResponse?.data?.data || {};

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

      const questions = acceptedSubmissions.submissions.map((q) => q.question);

      setSolvedQues(questions);
      setLanguageData(userLanguageData);
      setSubmissions(allSubmissions);
      setDayData({ streaks, daysActive });
      setHeatmap(heatmapData);
      setPartnerData(partner);
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

  const fetchRank = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/rank/${userId}`);

      return response?.data?.data || {};
    } catch (error) {
      console.error("Error fetching user rank: " + error);
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

  useEffect(() => {
    const fetchUserRank = async (id) => {
      const data = await fetchRank(id);

      setUserRank(data);
    };

    if (userData?.user_id) {
      fetchUserRank(userData?.user_id);
    }
  }, [userData?.user_id]);

  useEffect(() => {
    const fetchPartnerRank = async (id) => {
      const data = await fetchRank(id);

      setPartnerRank(data);
    };

    if (partnerData?.user_id) {
      fetchPartnerRank(partnerData?.user_id);
    }
  }, [partnerData?.user_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-gray-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid h-auto min-h-[85vh] grid-cols-8 gap-6">
          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-2 row-span-6 space-y-6 rounded-xl border border-gray-800 bg-gray-900/60 p-6"
          >
            {userData === null ? (
              "loading..."
            ) : (
              <div className="text-center">
                <Avatar className="mx-auto mb-4 h-24 w-24 border-2 border-indigo-500">
                  <AvatarImage src={userData?.profilePicture} />
                  <AvatarFallback>
                    {userData?.username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-white">
                  {userData?.username}
                </h2>
                <p className="text-gray-400">@{userData?.username}</p>

                <div className="mt-4 flex justify-center space-x-4">
                  <div className="text-center">
                    <span className="text-xl font-bold text-indigo-500">
                      {userData?.rating}
                    </span>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-bold text-green-500">
                      {userRank?.rank}
                    </span>
                    <p className="text-xs text-gray-400">Rank</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-300">
                  {userData?.bio.substring(0, 50)}...
                </p>

                <Button className="mt-4 w-full bg-indigo-700 hover:bg-indigo-600">
                  Edit Profile
                </Button>
              </div>
            )}

            {languageData === null ? (
              "loading..."
            ) : (
              <div>
                <h3 className="text-md mb-4 flex items-center font-semibold">
                  <Languages className="mr-2 h-5 w-5 text-indigo-500" />
                  Preferred Languages
                </h3>
                <div className="space-y-2">
                  {Object.entries(languageData)
                    .filter(([key]) => key !== "totalCount")
                    .map(([language, count]) => (
                      <div
                        key={language}
                        className="flex items-center justify-between"
                      >
                        <span>{language}</span>
                        <span className="text-gray-400">{count} submitted</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {userStats === null ? (
              "loading..."
            ) : (
              <div>
                <h3 className="text-md mb-4 flex items-center font-semibold">
                  <MessageCircleCode className="mr-2 h-5 w-5 text-green-500" />
                  Contributions
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Questions</span>
                    <span>{userStats?.contributedQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answers Contributed</span>
                    <span>{userStats?.contributedAnswers}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Questions Solved Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-3 row-span-2 flex items-center justify-center rounded-xl border border-gray-800 bg-gray-900/60 p-6"
          >
            {questionStats === null ? (
              "loading..."
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(questionStats)
                  .filter(([key]) => key !== "total")
                  .map(([difficulty, count]) => (
                    <div
                      key={difficulty}
                      className="transform rounded-lg bg-gray-800 p-4 text-center transition-all hover:scale-105"
                    >
                      <div
                        className={`text-3xl font-bold ${
                          difficulty === "easy"
                            ? "text-green-500"
                            : difficulty === "medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                        } `}
                      >
                        {count}
                      </div>
                      <div className="text-sm capitalize text-gray-400">
                        {difficulty} Questions
                      </div>
                    </div>
                  ))}
                <div className="col-span-3 rounded-lg bg-gray-800 p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-500">
                    {questionStats.total}
                  </div>
                  <div className="text-sm text-gray-400">
                    Total Questions Solved
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Accountability Partner */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-3 row-span-2 rounded-xl border border-gray-800 bg-gray-900/60 p-6"
          >
            {partnerData === null ? (
              "loading..."
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-indigo-500">
                    <AvatarImage src={partnerData?.profilePicture} />
                    <AvatarFallback>
                      {partnerData?.username.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {partnerData?.username}
                    </h3>
                    <p className="text-sm text-gray-400">
                      @{partnerData?.username}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="text-center">
                    <span className="text-xl font-bold text-indigo-500">
                      {partnerData?.rating}
                    </span>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-bold text-green-500">
                      {partnerRank?.rank}
                    </span>
                    <p className="text-xs text-gray-400">Rank</p>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-gray-300">
                  {partnerData.bio.substr(0, 90)}...
                </p>
              </>
            )}
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-6 row-span-2 rounded-xl border border-gray-800 bg-gray-900/60 p-6"
          >
            {heatmap === null && dayData === null ? (
              "loading..."
            ) : (
              <D3Heatmap data={heatmap} dayData={dayData} />
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-6 row-span-2 rounded-xl border border-gray-800 bg-gray-900/60 p-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger
                  value="solved"
                  className="data-[state=active]:bg-indigo-700"
                >
                  Recently Solved
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="data-[state=active]:bg-indigo-700"
                >
                  Recent Submissions
                </TabsTrigger>
              </TabsList>
              <TabsContent value="solved">
                {solvedQues === null ? (
                  "loading..."
                ) : (
                  <div className="mt-4 space-y-2">
                    {solvedQues.map((q, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded p-2 hover:bg-gray-700"
                      >
                        <div>
                          <span className="font-semibold">
                            {q.title.substr(0, 90)}...
                          </span>
                          <span
                            className={`ml-2 rounded px-2 py-1 text-xs ${
                              q.difficulty === "Hard"
                                ? "bg-red-900 text-red-300"
                                : q.difficulty === "Medium"
                                  ? "bg-yellow-900 text-yellow-300"
                                  : "bg-green-900 text-green-300"
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">
                            {q.likes}
                          </span>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="submissions">
                <div className="mt-4 space-y-2">
                  {submissions?.submissions?.map((submission, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded p-2 hover:bg-gray-700"
                    >
                      <div>
                        <span className="font-semibold">
                          {submission?.question?.title}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {submission.language}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          {submission.question.likes}
                        </span>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            submission.isSolved === true
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {submission.question.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
