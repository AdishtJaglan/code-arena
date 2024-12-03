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

const getDifficultyStyles = (difficulty) => {
  switch (difficulty) {
    case "Hard":
      return "bg-red-900/50 text-red-400 border border-red-800";
    case "Medium":
      return "bg-yellow-900/50 text-yellow-400 border border-yellow-800";
    case "Easy":
      return "bg-green-900/50 text-green-400 border border-green-800";
    default:
      return "bg-gray-800 text-gray-400";
  }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-gray-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid h-auto min-h-[85vh] grid-cols-8 gap-6">
          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="col-span-2 row-span-6 h-fit w-fit overflow-hidden rounded-2xl border border-slate-700 bg-gray-900/60 shadow-2xl"
          >
            <Card className="border-none bg-transparent">
              <CardHeader className="bg-slate-800/50 py-6 text-center">
                <div className="flex flex-col items-center">
                  <Avatar className="mb-4 h-28 w-28 border-4 border-indigo-500 ring-4 ring-slate-700">
                    <AvatarImage src={userData?.profilePicture} />
                    <AvatarFallback className="bg-indigo-600 text-2xl font-bold text-white">
                      {userData?.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl font-bold tracking-tight text-white">
                    {userData?.username}
                  </CardTitle>
                  <p className="text-sm text-slate-400">
                    @{userData?.username}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 rounded-xl bg-slate-800 p-4">
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Trophy className="mr-2 text-yellow-500" size={20} />
                      <span className="text-xl font-bold text-yellow-400">
                        {userRank?.rank}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Rank</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <span className="text-xl font-bold text-indigo-400">
                        {userData?.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center">
                      <Users className="mr-2 text-green-500" size={20} />
                      <span className="text-xl font-bold text-green-400">
                        {userStats?.contributedQuestions}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Questions</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="rounded-xl bg-slate-800 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-300">
                    Bio
                  </h3>
                  <p className="text-sm italic text-slate-400">
                    {userData?.bio.length > 100
                      ? `${userData.bio.substring(0, 100)}...`
                      : userData?.bio}
                  </p>
                </div>

                {/* Languages */}
                <div className="rounded-xl bg-slate-800 p-4">
                  <h3 className="mb-3 flex items-center text-sm font-semibold text-slate-300">
                    <LanguageIcon className="mr-2 text-cyan-500" size={18} />
                    Preferred Languages
                  </h3>
                  {Object.entries(languageData || {})
                    .filter(([key]) => key !== "totalCount")
                    .map(([language, count]) => (
                      <div key={language} className="mb-2">
                        <div className="mb-1 flex justify-between text-xs text-slate-400">
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
                          className="h-2 bg-slate-700"
                          indicatorClassName="bg-cyan-500"
                        />
                      </div>
                    ))}
                </div>

                {/* Contributions */}
                <div className="rounded-xl bg-slate-800 p-4">
                  <h3 className="mb-3 flex items-center text-sm font-semibold text-slate-300">
                    <CodeIcon className="mr-2 text-emerald-500" size={18} />
                    Contributions
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Questions</span>
                      <span className="font-semibold text-emerald-400">
                        {userStats?.contributedQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">
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
                  className="mt-4 w-full border-indigo-600 bg-transparent text-indigo-400 transition-colors hover:bg-indigo-600/10"
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
            className="col-span-3 row-span-2 overflow-hidden rounded-2xl border border-slate-700 bg-gray-900/60 shadow-xl"
          >
            <Card className="border-none bg-transparent">
              <CardHeader className="bg-slate-800/50 py-4 text-center">
                <CardTitle className="flex items-center justify-center text-xl font-bold text-white">
                  <TrendingUp className="mr-2 text-indigo-500" size={24} />
                  Question Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {questionStats === null ? (
                  "loading..."
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(questionStats)
                        .filter(([key]) => key !== "total")
                        .map(([difficulty, count]) => (
                          <div
                            key={difficulty}
                            className="transform rounded-xl bg-slate-800 p-4 text-center transition-all hover:scale-105 hover:shadow-lg"
                          >
                            <div className="mb-2 flex items-center justify-center">
                              {difficultyIcons[difficulty]}
                              <span
                                className={`text-3xl font-bold ${
                                  {
                                    easy: "text-green-500",
                                    medium: "text-yellow-500",
                                    hard: "text-red-500",
                                  }[difficulty]
                                }`}
                              >
                                {count}
                              </span>
                            </div>
                            <div className="mb-2 text-sm capitalize text-slate-400">
                              {difficulty} Questions
                            </div>
                            <Progress
                              value={parseFloat(
                                (count / questionStats.total) * 100,
                              ).toFixed(2)}
                              className="h-2 bg-slate-700"
                              indicatorClassName={difficultyColors[difficulty]}
                            />
                            <div className="mt-1 text-xs text-slate-500">
                              {parseFloat(
                                (count / questionStats.total) * 100,
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Total Questions */}
                    <div className="mt-4 rounded-xl bg-slate-800 p-4 text-center">
                      <div className="mb-2 flex items-center justify-center">
                        <Layers className="mr-2 text-indigo-500" size={20} />
                        <span className="text-3xl font-bold text-indigo-400">
                          {questionStats?.total}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
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
            className="col-span-3 row-span-2 overflow-hidden rounded-2xl border border-gray-700 bg-gray-900/60 shadow-2xl"
          >
            <Card className="border-none bg-transparent">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-6">
                  <Avatar className="h-24 w-24 border-4 border-violet-500 ring-4 ring-gray-700">
                    <AvatarImage src={partnerData?.profilePicture} />
                    <AvatarFallback className="bg-violet-600 text-3xl font-bold text-white">
                      {partnerData?.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <h3 className="flex items-center text-2xl font-bold tracking-tight text-white">
                        {partnerData?.username}
                        <ShieldCheck
                          className="ml-2 text-violet-500"
                          size={24}
                        />
                      </h3>
                    </div>
                    <p className="text-md flex items-center text-violet-500">
                      <Code className="mr-2 h-5 w-5" /> Accountability Partner
                      Rating: {partnerData?.rating}
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-4 rounded-xl bg-gray-800 p-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-violet-400">
                      {partnerData?.questionsSolved?.length || 0}
                    </span>
                    <p className="text-xs uppercase tracking-wider text-gray-300">
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
                              className="text-gray-400 transition-colors hover:text-white"
                              size={28}
                            />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View GitHub Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="mt-2 text-xs uppercase tracking-wider text-gray-300">
                      GitHub
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-violet-400">
                      {partnerRank === null ? "Loading..." : partnerRank?.rank}
                    </span>
                    <p className="text-xs uppercase tracking-wider text-gray-300">
                      Rank
                    </p>
                  </div>
                </div>

                <div className="mb-4 rounded-xl bg-gray-800 p-4">
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-300">
                    Partner Bio
                  </h4>
                  <p className="text-center text-sm italic text-gray-400">
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
            className="col-span-6 row-span-2 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 shadow-2xl"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2 rounded-xl bg-purple-900/40 p-1">
                <TabsTrigger
                  value="solved"
                  className="flex items-center gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-violet-700/80 data-[state=active]:text-white"
                >
                  <CheckCircle className="h-4 w-4" />
                  Solved Problems
                </TabsTrigger>
                <TabsTrigger
                  value="submissions"
                  className="flex items-center gap-2 rounded-lg transition-all duration-300 data-[state=active]:bg-violet-700/80 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4" />
                  Recent Submissions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="solved" className="space-y-2">
                {solvedQues === null ? (
                  <div className="flex items-center justify-center italic text-gray-500">
                    <Code className="mr-2" /> Loading solved problems...
                  </div>
                ) : (
                  solvedQues.map((q, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between overflow-hidden rounded-xl bg-gray-800/50 p-3"
                    >
                      <div className="flex min-w-0 items-center space-x-2">
                        <span
                          onClick={() => handleQuestionClick(q.question_id)}
                          className="cursor-pointer truncate font-semibold text-white transition-all duration-300 hover:text-indigo-400"
                        >
                          {q.title.substr(0, 75)}...
                        </span>
                        <span
                          className={`flex-shrink-0 rounded-md px-2 py-1 text-xs ${getDifficultyStyles(q.difficulty)}`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{q.likes}</span>
                        <ThumbsUp className="h-4 w-4 flex-shrink-0 text-violet-500" />
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="submissions" className="space-y-2">
                {submissions?.submissions?.map((submission, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl bg-gray-800/50 p-3"
                  >
                    <div className="flex w-3/4 items-center gap-3">
                      <span
                        onClick={() =>
                          handleQuestionClick(submission?.question?.question_id)
                        }
                        className="w-3/4 cursor-pointer truncate font-semibold text-white transition-all duration-300 hover:text-indigo-400"
                      >
                        {submission?.question?.title.substr(0, 175)}
                      </span>
                      <span className="rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-300">
                        {submission.language}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <span>{submission.question.likes}</span>
                        <ThumbsUp className="h-4 w-4 text-violet-500" />
                      </div>
                      <span
                        className={`rounded-md px-2 py-1 text-xs ${
                          submission.isSolved
                            ? "border border-green-800 bg-green-900/50 text-green-400"
                            : "border border-red-800 bg-red-900/50 text-red-400"
                        }`}
                      >
                        {submission.question.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
