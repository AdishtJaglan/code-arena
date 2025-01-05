/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

//TODO -> Add the discussion, submission
//TODO -> get judge0 languauge ids mapped
//TODO -> create submission animation, remove toasts

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "@/configs/env-config";
import { motion } from "framer-motion";
import {
  FileText,
  Trophy,
  SquareTerminal,
  Edit,
  MessageCircle,
  MessageCircleCode,
  Upload,
  Clipboard,
  Check,
  Eraser,
  TriangleAlert,
  SquareChartGantt,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2Icon,
  Copy,
} from "lucide-react";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt"; //! fill
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt"; //! outline
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt"; //! fill
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt"; //! outline
import { Editor } from "@monaco-editor/react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import axios from "axios";
import Navbar from "../components/Navbar";
import LANGUAGE_CONFIGS from "@/configs/language-config";

const TestStatus = {
  NOT_RUN: "not_run",
  RUNNING: "running",
  PASSED: "passed",
  FAILED: "failed",
};

const StatusBadge = ({ status }) => {
  const variants = {
    [TestStatus.NOT_RUN]: {
      color: "bg-zinc-800 text-zinc-400",
      label: "Not Run",
    },
    [TestStatus.RUNNING]: {
      color: "bg-blue-950/30 border-blue-800 text-blue-400",
      label: "Running Tests",
    },
    [TestStatus.PASSED]: {
      color: "bg-emerald-950/30 border-emerald-800 text-emerald-400",
      label: "All Tests Passed",
    },
    [TestStatus.FAILED]: {
      color: "bg-red-950/30 border-red-800 text-red-400",
      label: "Tests Failed",
    },
  };

  return (
    <Badge variant="outline" className={`${variants[status].color}`}>
      {variants[status].label}
    </Badge>
  );
};

const getLanguage = (lang) => {
  switch (lang) {
    case "C++":
      return "cpp";
    default:
      return lang.toLowerCase();
  }
};

const ProblemDetails = () => {
  const { id } = useParams();
  const editorRef = useRef(null);

  //! question related states
  const [examples, setExamples] = useState([]);
  const [question, setQuestion] = useState(null);
  const [submittedBy, setSubmittedBy] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);

  //! answer related states
  const [answers, setAnswers] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState({});
  const [copiedStates, setCopiedStates] = useState({});

  //! test case related states
  const [testCases, setTestCases] = useState(null);
  const [overallStatus, setOverallStatus] = useState(TestStatus.NOT_RUN);
  const [loading, setLoading] = useState(false);

  //!submission related states
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  //! editor related states
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [initialCode, setInitialCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const config = LANGUAGE_CONFIGS[selectedLanguage];

  //! bug report modal state
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  //! resizable pane states
  const [rightTopHeight, setRightTopHeight] = useState(80);

  const handleMouseDown = useCallback(
    (e, direction) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = rightTopHeight;

      const handleMouseMove = (e) => {
        const rightPane = document.getElementById("rightPane");
        const deltaY = e.clientY - startY;
        const containerHeight = rightPane.offsetHeight;
        const newHeight = startHeight + (deltaY / containerHeight) * 100;
        setRightTopHeight(Math.min(Math.max(20, newHeight), 80));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [rightTopHeight],
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const [questionResponse, testCaseResponse, answerResponse] =
          await Promise.allSettled([
            axios.get(`${API_BASE_URL}/question/complete-question/${id}`),
            axios.get(`${API_BASE_URL}/test-case/${id}`),
            axios.get(`${API_BASE_URL}/answer/complete/${id}`),
          ]);

        if (questionResponse.status === "fulfilled") {
          const { submittedBy, examples, ...question } =
            questionResponse.value.data.data.question;

          let langObj = {};

          question?.codeQuestion.forEach((code) => {
            if (code?.language) {
              langObj[getLanguage(code.language)] = code?.code;
            }
          });

          setInitialCode(langObj);
          setQuestion(question);
          setSubmittedBy(submittedBy);
          setExamples(examples);
        } else {
          console.error(
            "Error while fetching question: ",
            questionResponse?.reason?.message,
          );
        }

        if (testCaseResponse.status === "fulfilled") {
          const testCases = testCaseResponse.value?.data?.data?.testCases;
          testCases.map((ts) => (ts.passed = null));

          setTestCases(testCases);
        } else {
          console.error(
            "Error while fetching test cases: ",
            testCaseResponse?.reason?.message,
          );
        }

        if (answerResponse.status === "fulfilled") {
          setAnswers(answerResponse.value?.data?.data?.answer);
        } else {
          console.error(
            "Error fetching the answer, please try again: " +
              answerResponse?.reason?.message,
          );
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message;
        console.error(
          "Error fetching question data, please try again: " + errorMessage,
        );
      }
    };

    getData();
  }, [id]);

  const tabs = [
    { id: "description", icon: FileText },
    { id: "editorial", icon: Edit },
    { id: "discussion", icon: MessageCircle },
    { id: "submissions", icon: Upload },
  ];

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "hard":
        return "border-red-500 bg-red-500/20 text-red-200";
      case "medium":
        return "border-yellow-500 bg-yellow-500/20 text-yellow-200";
      case "easy":
        return "border-green-500 bg-green-500/20 text-green-200";
      default:
        return "border-zinc-500 bg-zinc-500/20 text-zinc-200";
    }
  };

  const handleReportDialogSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bug-report/create`, {
        title: reportTitle,
        description: reportDescription,
      });

      if (response.data.success === true) {
        toast.success("Report submitted successfully.", {
          className: "border-zinc-800 bg-zinc-900 text-zinc-300",
          duration: 2000,
        });
        setIsBugReportOpen(false);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message;

      console.error("Error occurred while submitting report:", errorMessage);
      toast.error("Error submitting bug report.", {
        className: "border-rose-600 bg-rose-900 text-zinc-200",
        duration: 2000,
      });
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopy = async () => {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);

      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    if (!editorRef.current) return;

    editorRef.current.setValue("");

    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  useEffect(() => {
    const getOverallStatus = () => {
      if (testCases.every((tc) => tc.status === TestStatus.NOT_RUN)) {
        return TestStatus.NOT_RUN;
      }
      if (testCases.some((tc) => tc.status === TestStatus.RUNNING)) {
        return TestStatus.RUNNING;
      }
      if (testCases.some((tc) => tc.status === TestStatus.FAILED)) {
        return TestStatus.FAILED;
      }
      if (testCases.every((tc) => tc.status === TestStatus.PASSED)) {
        return TestStatus.PASSED;
      }
      return TestStatus.NOT_RUN;
    };

    if (testCases != null) {
      getOverallStatus();
    }
  }, [testCases]);

  const runTestCases = async () => {
    setLoading(true);
    setRightTopHeight(60);
    setOverallStatus(TestStatus.RUNNING);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Login to run test cases.", {
        className: "border-rose-600 bg-rose-900 text-zinc-200",
        duration: 2000,
      });
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/submission/run`,
        {
          sourceCode: editorRef.current.getValue(),
          language: selectedLanguage,
          languageId: 1, //! update this
          testCases,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { results } = response?.data?.data || {};

      for (const res of results) {
        if (res?.passed === false) {
          setOverallStatus(TestStatus.FAILED);
          break;
        } else {
          setOverallStatus(TestStatus.PASSED);
        }
      }

      setTestCases(results);
    } catch (error) {
      const errorMessage = error?.response?.message;
      console.error("Error running test cases: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    setSubmitting(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Login to run your code!", {
        className: "border-rose-600 bg-rose-900 text-zinc-200",
        duration: 2000,
      });

      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/submission/submit`,
        {
          sourceCode: editorRef.current.getValue(),
          language: "JavaScript",
          languageId: 1, //! update this
          question: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { submission } = response?.data?.data || {};

      if (submission.isSolved === false) {
        setAccepted(false);
        toast.error("Incorrect submission, please try again!", {
          className: "border-rose-600 bg-rose-900 text-zinc-200",
          duration: 2000,
        });
      } else {
        setAccepted(true);
        toast.success("Submission accepted, all test cases passed!", {
          className: "border-zinc-800 bg-zinc-900 text-zinc-300",
          duration: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.message || error?.message;
      console.error("Unable to submit code: " + errorMessage);

      toast.error("Unable to run your code, please try again!", {
        className: "border-rose-600 bg-rose-900 text-zinc-200",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCode = (code, ansIndex) => {
    navigator.clipboard.writeText(code);
    setCopiedStates((prev) => ({ ...prev, [ansIndex]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [ansIndex]: false }));
    }, 2000);
  };

  const initializeLanguage = (codeAnswers) => {
    if (!selectedLanguages[codeAnswers.language]) {
      setSelectedLanguages((prev) => ({
        ...prev,
        [codeAnswers.language]: codeAnswers.code,
      }));
    }
  };

  const getCode = (lang) => {
    const languageMap = {
      cpp: initialCode["cpp"],
      c: initialCode["c"],
      javascript: initialCode["javascript"],
      java: initialCode["java"],
      python: initialCode["python"],
    };

    return languageMap[lang] || lang.toLowerCase();
  };

  useEffect(() => {
    const getReactionStatus = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/question/like/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setIsDisLiked(response?.data?.data?.dislike);
        setIsLiked(response?.data?.data?.like);
      } catch (error) {
        const errorMessage =
          error?.response?.message || error?.message || error;
        console.error("Error fetching reaction data: " + errorMessage);
      }
    };

    getReactionStatus();
  }, [id]);

  const reactToQuestion = async (like) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Must be logged in to react.", {
        className: "border-rose-600 bg-rose-900 text-zinc-200",
        duration: 2000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/question/like/${id}?like=${like}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response?.data?.success === true) {
        if (like === true) {
          setIsLiked(true);
          setIsDisLiked(false);
        } else {
          setIsLiked(false);
          setIsDisLiked(true);
        }
        toast.success("Reaction added successfully.", {
          className: "border-zinc-800 bg-zinc-900 text-zinc-300",
          duration: 2000,
        });
      } else {
        toast.error("Error occurred while adding reaction.", {
          className: "border-rose-600 bg-rose-900 text-zinc-200",
          duration: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.message || error?.message || error;
      console.error("Error reacting to question: " + errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-neutral-200">
      <Navbar isQuestionDetail={true} />
      <Toaster position="bottom-left" theme="dark" />

      <div id="editorContainer" className="flex h-[90vh] w-full space-x-1">
        {/* main question */}
        <motion.div
          className="h-full w-1/2 overflow-scroll rounded-sm border border-zinc-700 bg-neutral-900/60"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Tabs defaultValue="description" className="relative">
            <TabsList className="sticky top-0 z-10 flex w-full items-center justify-start gap-1 overflow-hidden rounded-none border-t border-zinc-800 bg-zinc-900/95 p-3 backdrop-blur-sm">
              {tabs.map(({ id, icon: Icon }, index) => (
                <React.Fragment key={id}>
                  <TabsTrigger
                    value={id}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 data-[state=active]:rounded-[0.5rem] data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    <Icon
                      size={16}
                      className={`${index === 0 ? "text-blue-500" : index === 3 ? "text-emerald-600" : "text-orange-400"} `}
                    />
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </TabsTrigger>
                  {index != tabs.length - 1 && (
                    <Separator orientation="vertical" className="bg-zinc-600" />
                  )}
                </React.Fragment>
              ))}
            </TabsList>

            <TabsContent
              value="description"
              className="flex h-full flex-col p-4"
            >
              {question != null && submittedBy != null ? (
                <>
                  {/* heading */}
                  <div className="mb-6 flex items-center space-x-2 overflow-hidden">
                    <h2 className="text-xl font-bold">{question?.title}</h2>
                  </div>

                  {/* tags */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 overflow-hidden">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${getDifficultyStyle(question?.difficulty)}`}
                      >
                        {question?.difficulty?.toLowerCase()}
                      </Badge>

                      <div className="flex flex-wrap gap-2 overflow-clip">
                        {question?.tags?.map((tag, index) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer border-zinc-700 bg-zinc-800/50 px-3 py-1 text-xs font-normal tracking-wide text-zinc-200 backdrop-blur-sm transition-all hover:border-zinc-500 hover:bg-zinc-700/50"
                          >
                            {tag.toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-x-4">
                      {isLiked ? (
                        <ThumbUpAltIcon
                          className="cursor-pointer"
                          onClick={() => reactToQuestion(true)}
                        />
                      ) : (
                        <ThumbUpOffAltIcon
                          className="cursor-pointer"
                          onClick={() => reactToQuestion(true)}
                        />
                      )}

                      {isDisLiked ? (
                        <ThumbDownAltIcon
                          className="cursor-pointer"
                          onClick={() => reactToQuestion(false)}
                        />
                      ) : (
                        <ThumbDownOffAltIcon
                          className="cursor-pointer"
                          onClick={() => reactToQuestion(false)}
                        />
                      )}
                    </div>
                  </div>

                  {/* question */}
                  <div className="mb-6 flex-1 overflow-hidden p-4">
                    <p>{question?.explanation}</p>
                  </div>

                  {/* examples */}
                  <div className="my-3 flex-1 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
                    {examples.map((ex, index) => (
                      <div key={ex?._id} className="my-3 space-y-4">
                        <p className="font-bold text-neutral-200">
                          Example {index + 1}:
                        </p>
                        <div className="flex flex-col gap-2 border-l-2 border-neutral-600 px-3">
                          <p className="text-sm text-gray-200">
                            Input:{" "}
                            <span className="font-light text-neutral-300">
                              {ex?.input}
                            </span>
                          </p>
                          <p className="text-sm text-gray-200">
                            Output:{" "}
                            <span className="font-light text-neutral-300">
                              {ex?.output}
                            </span>
                          </p>
                          <p className="text-sm text-gray-200">
                            Explanation:{" "}
                            <span className="font-light text-neutral-300">
                              {ex?.explanation}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* constraints */}
                  <div className="mb-6 space-y-1 p-4">
                    <p className="font-bold text-neutral-200">Constraints:</p>
                    <ul className="list-disc pl-6">
                      {question?.constraints?.map((cnst, index) => (
                        <li
                          key={index}
                          className="text-sm font-thin leading-7 text-neutral-400"
                        >
                          {cnst}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* question stats */}
                  <Card className="mb-6 w-full border-neutral-800 bg-neutral-900/80">
                    <CardContent className="grid grid-cols-2 gap-6 p-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-400">Likes</span>
                        <span className="text-lg font-medium text-zinc-100">
                          {question?.likes.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-400">Dislikes</span>
                        <span className="text-lg font-medium text-zinc-100">
                          {question?.dislikes.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-400">
                          Success Rate
                        </span>
                        <span className="text-lg font-medium text-zinc-100">
                          {question?.acceptanceRate.toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-400">Solutions</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-medium text-zinc-100">
                            {question?.noOfSuccess}
                          </span>
                          <span className="text-xs text-zinc-500">
                            of {question?.noOfSuccess + question?.noOfFails}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* contributor */}
                  <div className="space-y-2 p-4">
                    <p className="font-bold text-neutral-200">Contributor:</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={submittedBy?.profilePicture}
                        alt={submittedBy?.username}
                        className="h-12 w-12 rounded-full object-cover"
                      />

                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-zinc-100">
                            {submittedBy?.username}
                          </h3>
                          <div className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5">
                            <Trophy size={14} className="text-yellow-500" />
                            <span className="text-sm text-zinc-300">
                              {submittedBy?.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {submittedBy?.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col p-4">
                  {/* Title skeleton */}
                  <div className="mb-6 h-7 w-3/4 animate-pulse rounded-lg bg-neutral-800" />

                  {/* Tags skeleton */}
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-800" />
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-6 w-16 animate-pulse rounded-full bg-neutral-800"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question skeleton */}
                  <div className="mb-6 flex-1 space-y-3 p-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-4 w-full animate-pulse rounded bg-neutral-800"
                      />
                    ))}
                  </div>

                  {/* Examples skeleton */}
                  <div className="my-3 rounded-xl border border-neutral-800 bg-neutral-900/80 p-4">
                    {[1, 2].map((example) => (
                      <div key={example} className="my-3 space-y-4">
                        <div className="h-5 w-24 animate-pulse rounded bg-neutral-800" />
                        <div className="space-y-3 border-l-2 border-neutral-600 px-3">
                          {[1, 2, 3].map((line) => (
                            <div
                              key={line}
                              className="h-4 w-11/12 animate-pulse rounded bg-neutral-800"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constraints skeleton */}
                  <div className="mb-6 space-y-3 p-4">
                    <div className="h-5 w-28 animate-pulse rounded bg-neutral-800" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800" />
                  </div>

                  {/* Stats card skeleton */}
                  <Card className="mb-6 border-neutral-800 bg-neutral-900/80">
                    <CardContent className="grid grid-cols-2 gap-6 p-6">
                      {[1, 2, 3, 4].map((stat) => (
                        <div key={stat} className="flex flex-col gap-2">
                          <div className="h-3 w-16 animate-pulse rounded bg-neutral-800" />
                          <div className="h-6 w-20 animate-pulse rounded bg-neutral-800" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Contributor skeleton */}
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-24 animate-pulse rounded bg-neutral-800" />
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-800" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-32 animate-pulse rounded bg-neutral-800" />
                          <div className="flex h-6 w-16 items-center gap-1 rounded-md bg-neutral-800" />
                        </div>
                        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="editorial" className="mt-0 px-4">
              {answers === null ? (
                <div>loading...</div>
              ) : (
                <Tabs defaultValue={answers[0]?.type} className="w-full">
                  <TabsList className="rounded-lg bg-zinc-900/40 p-1 backdrop-blur-sm">
                    {answers?.map((ans, index) => (
                      <TabsTrigger
                        key={index}
                        value={ans?.type}
                        className="rounded-md px-4 py-2 transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                      >
                        {ans?.type}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {answers?.map((ans, index) => (
                    <TabsContent key={index} value={ans?.type} className="mt-6">
                      <Card className="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <h3 className="text-3xl font-semibold tracking-tight text-white/90">
                              {ans?.heading}
                            </h3>

                            <div className="py-3">
                              <h4 className="mb-3 mt-6 text-xl font-bold text-white">
                                Intuition:
                              </h4>
                              <p className="font-light leading-relaxed text-zinc-400">
                                {ans?.intuition}
                              </p>
                            </div>

                            {ans.codeAnswer?.length > 0 && (
                              <div className="mt-8">
                                <div className="mb-4 flex items-center justify-between">
                                  <Select
                                    value={selectedLanguages[index]}
                                    onValueChange={(language) =>
                                      setSelectedLanguages((prev) => ({
                                        ...prev,
                                        [index]: language,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="w-40 border-zinc-700/50 bg-zinc-800/50 text-white">
                                      <SelectValue placeholder="View Answer" />
                                    </SelectTrigger>
                                    <SelectContent className="border-zinc-700 bg-zinc-800">
                                      {ans.codeAnswer.map((code, codeIndex) => {
                                        initializeLanguage(code);

                                        return (
                                          <SelectItem
                                            key={codeIndex}
                                            value={code.language}
                                            className="text-zinc-200 hover:bg-zinc-700/50"
                                          >
                                            {code.language}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {ans.codeAnswer
                                  .filter(
                                    (code) =>
                                      code.language ===
                                      selectedLanguages[index],
                                  )
                                  .map((code, codeIndex) => (
                                    <div
                                      key={codeIndex}
                                      className="group relative"
                                    >
                                      <div className="relative h-fit overflow-hidden rounded-xl">
                                        <div className="absolute right-2 top-2 z-50 h-8 w-8">
                                          <button
                                            onClick={() =>
                                              handleCopyCode(
                                                code.code,
                                                `${index}-${codeIndex}`,
                                              )
                                            }
                                            className="rounded-md bg-zinc-700/50 p-2 transition-colors hover:bg-zinc-700"
                                          >
                                            {copiedStates[
                                              `${index}-${codeIndex}`
                                            ] ? (
                                              <Check className="h-4 w-4 text-green-400" />
                                            ) : (
                                              <Copy className="h-4 w-4 text-zinc-400" />
                                            )}
                                          </button>
                                        </div>
                                        <Editor
                                          height="400px"
                                          language={getLanguage(code.language)}
                                          theme={"vs-dark"}
                                          defaultValue={code.code}
                                          value={code.code}
                                          options={{
                                            fontSize: 14,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: "on",
                                            padding: { top: 16 },
                                            lineNumbers: "on",
                                            renderLineHighlight: "all",
                                            smoothScrolling: true,
                                            cursorBlinking: "smooth",
                                            readOnly: true,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}

                            <div className="py-3">
                              <h4 className="mb-3 mt-6 text-xl font-bold text-white">
                                Approach:
                              </h4>
                              <p className="font-light leading-relaxed text-zinc-400">
                                {ans?.approach}
                              </p>
                            </div>

                            <div className="py-3">
                              <h4 className="mb-3 mt-6 text-xl font-bold text-white">
                                Complexity Analysis:
                              </h4>
                              <p className="font-light leading-relaxed text-zinc-400">
                                {ans?.complexityAnalysis}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </TabsContent>

            <TabsContent
              value="discussion"
              className="flex h-full flex-col p-4"
            ></TabsContent>

            <TabsContent
              value="submissions"
              className="flex h-full flex-col p-4"
            ></TabsContent>
          </Tabs>
        </motion.div>

        {/* editor + Test cases */}
        <div
          id="rightPane"
          className="flex w-1/2 flex-1 flex-col overflow-hidden"
        >
          {/* editor */}
          <motion.div
            className="relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-700 bg-neutral-900/80 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ height: `${rightTopHeight}%` }}
          >
            {/* header */}
            <div className="flex w-full items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <MessageCircleCode className="h-5 w-5 text-blue-500" />
                <p className="text-sm text-neutral-200">Code</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex w-full items-center justify-between bg-neutral-950 px-4 py-1.5">
              <div className="flex items-center justify-evenly gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="flex items-center justify-center transition-all duration-200 ease-in-out"
                        disabled={copied}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Clipboard className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-200" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleClear}
                        className="flex items-center justify-center transition-all duration-200 ease-in-out"
                        disabled={cleared}
                      >
                        {cleared ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Eraser className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-200" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{cleared ? "Cleared!" : "Clear editor"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="h-6 w-28 border-0 bg-zinc-800/50 text-xs font-medium text-neutral-300 hover:bg-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-neutral-700 bg-zinc-800">
                  {Object.entries(LANGUAGE_CONFIGS).map(([key]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="text-xs text-neutral-300 hover:bg-zinc-700"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* editor */}
            <div className="min-h-0 w-full flex-1">
              <Editor
                height="100%"
                language={config.language}
                theme={config.theme}
                defaultValue={`// Start coding in ${config.language}`}
                value={getCode(selectedLanguage)}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  padding: { top: 16 },
                  lineNumbers: "on",
                  renderLineHighlight: "all",
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                }}
              />
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-4 bg-neutral-950 px-4 py-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TriangleAlert
                      onClick={() => setIsBugReportOpen(true)}
                      className="h-4 w-4 cursor-pointer text-orange-400 hover:text-orange-200"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Report a bug</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex space-x-4">
                <button
                  onClick={() => submitCode()}
                  className="flex w-20 items-center justify-center rounded-[0.5rem] border border-green-500 bg-green-500/20 px-4 py-1 text-green-200 hover:bg-emerald-800/30"
                >
                  {submitting ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "submit"
                  )}
                </button>
                <button
                  onClick={() => runTestCases()}
                  className="rounded-[0.5rem] border border-red-500 bg-red-500/20 px-4 py-1 text-red-200 hover:bg-red-900/30"
                >
                  {loading ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    "run"
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <div
            className="h-0.5 cursor-row-resize bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600"
            onMouseDown={(e) => handleMouseDown(e, "vertical")}
          ></div>

          {/* Test cases */}
          <motion.div
            className="flex-1 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full flex-col overflow-hidden">
              <div className="mb-4 flex items-center justify-between bg-zinc-900/95 px-6 py-3">
                <div className="flex items-center space-x-3">
                  <SquareTerminal className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-medium text-gray-200">
                    Test Cases
                  </h3>
                  <Separator
                    orientation="vertical"
                    className="h-6 bg-zinc-700"
                  />
                  <Badge variant="secondary" className="bg-zinc-800">
                    {testCases?.length} Cases
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={overallStatus} />
                  <SquareChartGantt
                    className={`h-5 w-5 ${
                      overallStatus === "failed"
                        ? "text-red-400"
                        : overallStatus === "running"
                          ? "text-blue-400"
                          : overallStatus === "passed"
                            ? "text-emerald-400"
                            : "text-zinc-400"
                    } `}
                  />
                </div>
              </div>

              <div className="px-6 pb-6">
                {testCases == null ? (
                  <div className="flex h-48 items-center justify-center">
                    <div className="text-gray-400">Loading test cases...</div>
                  </div>
                ) : (
                  <Tabs defaultValue="case0" className="w-full">
                    <TabsList className="mb-4 w-full justify-start space-x-2 bg-zinc-900/50 p-1">
                      {testCases.map((testCase, index) => (
                        <TabsTrigger
                          key={index}
                          value={`case${index}`}
                          className={`flex items-center space-x-2 data-[state=active]:bg-zinc-700/50 data-[state=active]:text-zinc-300`}
                        >
                          <span>Case {index + 1}</span>
                          {testCase.passed === null ? (
                            <Clock className="h-4 w-4 text-zinc-500" />
                          ) : testCase.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {testCases.map((testCase, index) => (
                      <TabsContent key={index} value={`case${index}`}>
                        <Card className="border-zinc-800 bg-zinc-900/30">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-400">
                                    Input:
                                  </span>
                                  <code className="rounded bg-zinc-900 px-2 py-1 font-mono text-sm text-emerald-400">
                                    {testCase.input}
                                  </code>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-400">
                                    Output:
                                  </span>
                                  <code className="rounded bg-zinc-900 px-2 py-1 font-mono text-sm text-emerald-400">
                                    {testCase.output}
                                  </code>
                                  {testCase.passed === null ? (
                                    <Clock className="h-4 w-4 text-zinc-500" />
                                  ) : testCase.passed ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              </div>
                              {testCase.status === TestStatus.FAILED &&
                                testCase.error && (
                                  <div className="mt-2 rounded-md bg-red-950/30 p-3 text-sm text-red-400">
                                    {testCase.error}
                                  </div>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={isBugReportOpen} onOpenChange={setIsBugReportOpen}>
        <DialogContent className="max-w-md rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-zinc-200">Report Issue</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Help us improve by reporting any issues
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-400">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Brief description"
                className="border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
                onChange={(e) => setReportTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-400">
                Description
              </Label>
              <textarea
                id="description"
                className="h-32 w-full rounded-md border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 placeholder:text-zinc-600"
                placeholder="Steps to reproduce the issue..."
                onChange={(e) => setReportDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsBugReportOpen(false)}
              className="border-rose-600 bg-rose-900 text-zinc-400 hover:bg-red-900 hover:text-zinc-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReportDialogSubmit()}
              className="border border-emerald-600 bg-emerald-800 text-zinc-300 hover:bg-emerald-700"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemDetails;
