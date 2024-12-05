import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Users,
  Trophy,
  CodeIcon,
  Languages as LanguageIcon,
  Layers,
  TrendingUp,
  Target,
  ShieldCheck,
  Code,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { GitHub } from "@mui/icons-material";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/configs/env-config";
import axios from "axios";
import D3Heatmap from "@/components/Heatmap";
import Navbar from "@/components/Navbar";

const difficultyColors = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
};

const difficultyIcons = {
  easy: <Target className="mr-2 text-green-500" size={20} />,
  medium: <Layers className="mr-2 text-yellow-500" size={20} />,
  hard: <TrendingUp className="mr-2 text-red-500" size={20} />,
};

const getDifficultyColors = {
  easy: "text-emerald-600",
  medium: "text-amber-600",
  hard: "text-red-600",
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("solved");
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

  const handleQuestionClick = (questionId) => {
    navigate(`/problems/${questionId}`);
  };

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
    <div className="min-h-screen bg-black text-neutral-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid h-auto min-h-[85vh] grid-cols-8 gap-6">
          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="col-span-2 row-span-6 h-fit w-fit overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-xl"
          >
            <Card className="border-none bg-transparent">
              <CardHeader className="py-6 text-center">
                <div className="flex flex-col items-center">
                  <Avatar className="mb-4 h-28 w-28">
                    <AvatarImage src={userData?.profilePicture} />
                    <AvatarFallback className="bg-neutral-600 text-2xl font-bold text-neutral-100">
                      {userData?.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl font-bold tracking-tight text-neutral-100">
                    {userData?.username}
                  </CardTitle>
                  <p className="text-sm text-neutral-400">
                    @{userData?.username}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 rounded-xl bg-neutral-800 p-4">
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Trophy className="mr-2 text-amber-500" size={20} />
                      <span className="text-xl font-bold text-amber-400">
                        {userRank?.rank}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">Rank</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-400">
                        {userData?.rating}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Users className="mr-2 text-emerald-500" size={20} />
                      <span className="text-xl font-bold text-emerald-400">
                        {userStats?.contributedQuestions}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">Questions</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="rounded-xl bg-neutral-800 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-neutral-300">
                    Bio
                  </h3>
                  <p className="text-sm italic text-neutral-400">
                    {userData?.bio.length > 100
                      ? `${userData.bio.substring(0, 100)}...`
                      : userData?.bio}
                  </p>
                </div>

                {/* Languages */}
                <div className="rounded-xl bg-neutral-800 p-4">
                  <h3 className="mb-3 flex items-center text-sm font-semibold text-neutral-300">
                    <LanguageIcon className="mr-2 text-teal-500" size={18} />
                    Preferred Languages
                  </h3>
                  {Object.entries(languageData || {})
                    .filter(([key]) => key !== "totalCount")
                    .map(([language, count]) => (
                      <div key={language} className="mb-2">
                        <div className="mb-1 flex justify-between text-xs text-neutral-400">
                          <span>{language}</span>
                          <span>
                            {((count / languageData.totalCount) * 100).toFixed(
                              1,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={(count / languageData.totalCount) * 100}
                          className="h-2 bg-neutral-700"
                          indicatorClassName="bg-teal-500"
                        />
                      </div>
                    ))}
                </div>

                {/* Contributions */}
                <div className="rounded-xl bg-neutral-800 p-4">
                  <h3 className="mb-3 flex items-center text-sm font-semibold text-neutral-300">
                    <CodeIcon className="mr-2 text-emerald-500" size={18} />
                    Contributions
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Total Questions</span>
                      <span className="font-semibold text-emerald-400">
                        {userStats?.contributedQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">
                        Answers Contributed
                      </span>
                      <span className="font-semibold text-emerald-400">
                        {userStats?.contributedAnswers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <Button
                  variant="outline"
                  className="mt-4 w-full border-neutral-600 bg-transparent text-neutral-300 transition-colors hover:bg-neutral-700/30"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Questions Solved Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="col-span-3 row-span-2 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl"
          >
            <Card className="border-none bg-transparent">
              <CardHeader className="bg-neutral-800/50 py-4 text-center">
                <CardTitle className="flex items-center justify-center text-xl font-bold text-neutral-200">
                  <TrendingUp className="mr-2 text-indigo-600" size={24} />
                  Question Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {questionStats === null ? (
                  <div className="text-neutral-500">Loading...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(questionStats)
                        .filter(([key]) => key !== "total")
                        .map(([difficulty, count]) => (
                          <div
                            key={difficulty}
                            className="transform rounded-xl bg-neutral-800 p-4 text-center transition-all hover:scale-105 hover:shadow-lg"
                          >
                            <div className="mb-2 flex items-center justify-center">
                              {difficultyIcons[difficulty]}
                              <span
                                className={`text-3xl font-bold ${
                                  {
                                    easy: "text-emerald-600",
                                    medium: "text-amber-600",
                                    hard: "text-red-600",
                                  }[difficulty]
                                }`}
                              >
                                {count}
                              </span>
                            </div>
                            <div className="mb-2 text-sm capitalize text-neutral-500">
                              {difficulty} Questions
                            </div>
                            <Progress
                              value={parseFloat(
                                (count / questionStats.total) * 100,
                              ).toFixed(2)}
                              className="h-2 bg-neutral-900"
                              indicatorClassName={difficultyColors[difficulty]}
                            />
                            <div className="mt-1 text-xs text-neutral-600">
                              {parseFloat(
                                (count / questionStats.total) * 100,
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Total Questions */}
                    <div className="mt-4 rounded-xl bg-neutral-800 p-4 text-center">
                      <div className="mb-2 flex items-center justify-center">
                        <Layers className="mr-2 text-indigo-600" size={20} />
                        <span className="text-3xl font-bold text-indigo-500">
                          {questionStats?.total}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-500">
                        Total Questions Solved
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Accountability Partner */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="col-span-3 row-span-2 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-2xl"
          >
            <Card className="border-none bg-transparent">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-6">
                  <Avatar className="h-24 w-24 border-4 border-neutral-700 ring-4 ring-neutral-800">
                    <AvatarImage src={partnerData?.profilePicture} />
                    <AvatarFallback className="bg-neutral-800 text-3xl font-bold text-neutral-300">
                      {partnerData?.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <h3 className="flex items-center text-2xl font-bold tracking-tight text-neutral-200">
                        {partnerData?.username}
                        <ShieldCheck
                          className="ml-2 text-neutral-600"
                          size={24}
                        />
                      </h3>
                    </div>
                    <p className="text-md flex items-center text-neutral-500">
                      <Code className="mr-2 h-5 w-5" /> Accountability Partner
                      Rating: {partnerData?.rating}
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-4 rounded-xl bg-neutral-800 p-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-neutral-300">
                      {partnerData?.questionsSolved?.length || 0}
                    </span>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      Challenges Completed
                    </p>
                  </div>
                  <div className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={partnerData?.socialLink?.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <GitHub
                              className="text-neutral-600 transition-colors hover:text-neutral-300"
                              size={28}
                            />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View GitHub Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="mt-2 text-xs uppercase tracking-wider text-neutral-500">
                      GitHub
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-neutral-300">
                      {partnerRank === null ? "Loading..." : partnerRank?.rank}
                    </span>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      Rank
                    </p>
                  </div>
                </div>

                <div className="mb-4 rounded-xl bg-neutral-800 p-4">
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                    Partner Bio
                  </h4>
                  <p className="text-center text-sm italic text-neutral-600">
                    {partnerData?.bio.length > 120
                      ? `${partnerData.bio.substring(0, 120)}...`
                      : partnerData?.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-6 row-span-2 rounded-xl border border-gray-800 bg-neutral-800/50 p-6"
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
            transition={{ type: "spring", stiffness: 100 }}
            className="col-span-6 row-span-2 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl"
          >
            <Card className="border-none bg-transparent">
              <CardHeader className="bg-neutral-800/50 py-4 text-center">
                <CardTitle className="flex items-center justify-center text-xl font-bold text-neutral-200">
                  <CheckCircle className="mr-2 text-indigo-600" size={24} />
                  Problem Tracker
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-4"
                >
                  <TabsList className="grid grid-cols-2 rounded-xl bg-neutral-800 p-1">
                    <TabsTrigger
                      value="solved"
                      className="flex items-center gap-2 rounded-lg transition-all data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Solved Problems
                    </TabsTrigger>
                    <TabsTrigger
                      value="submissions"
                      className="flex items-center gap-2 rounded-lg transition-all data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                    >
                      <Clock className="h-4 w-4" />
                      Recent Submissions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="solved" className="space-y-2">
                    {solvedQues === null ? (
                      <div className="flex items-center justify-center italic text-neutral-500">
                        <Code className="mr-2" /> Loading solved problems...
                      </div>
                    ) : (
                      solvedQues.map((q, index) => (
                        <div
                          key={index}
                          className="transform rounded-xl bg-neutral-800 p-3 transition-all hover:scale-[1.02] hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex min-w-0 items-center space-x-2">
                              <span
                                onClick={() =>
                                  handleQuestionClick(q.question_id)
                                }
                                className="cursor-pointer truncate text-neutral-200 transition-colors hover:text-indigo-400"
                              >
                                {q.title.substring(0, 75)}...
                              </span>
                              <span
                                className={`rounded-md px-2 py-1 text-xs ${
                                  getDifficultyColors[
                                    q.difficulty.toLowerCase()
                                  ] || "text-neutral-500"
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-neutral-400">
                                {q.likes}
                              </span>
                              <ThumbsUp className="h-4 w-4 text-indigo-600" />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="submissions" className="space-y-2">
                    {submissions?.submissions?.map((submission, index) => (
                      <div
                        key={index}
                        className="transform rounded-xl bg-neutral-800 p-3 transition-all hover:scale-[1.02] hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex w-3/4 items-center gap-3">
                            <span
                              onClick={() =>
                                handleQuestionClick(
                                  submission?.question?.question_id,
                                )
                              }
                              className="w-3/4 cursor-pointer truncate text-neutral-200 transition-colors hover:text-indigo-400"
                            >
                              {submission?.question?.title.substring(0, 175)}
                            </span>
                            <span className="rounded-md bg-neutral-700 px-2 py-1 text-xs text-neutral-400">
                              {submission.language}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center gap-1 text-neutral-400">
                              <span>{submission.question.likes}</span>
                              <ThumbsUp className="h-4 w-4 text-indigo-600" />
                            </div>
                            <span
                              className={`rounded-md px-2 py-1 text-xs ${
                                submission.isSolved
                                  ? "bg-emerald-900/50 text-emerald-500"
                                  : "bg-red-900/50 text-red-500"
                              }`}
                            >
                              {submission.question.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
