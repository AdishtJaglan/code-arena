/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../configs/env-config.js";
import axios from "axios";
import {
  BookOpenIcon,
  FilterIcon,
  Code2Icon,
  ArrowUpRightIcon,
  TrendingUpIcon,
  StarIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  Search,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MagicCard } from "@/components/MagicCard.jsx";
import FixedActionButton from "@/components/ActionButton.jsx";
import Particles from "@/components/Particles.jsx";
import Navbar from "@/components/Navbar.jsx";

const tags = [
  "Arrays",
  "Linked List",
  "Stack",
  "Queue",
  "Hashing",
  "Heap",
  "Binary Search",
  "Sorting",
  "Dynamic Programming",
  "Backtracking",
  "Recursion",
  "Graph Theory",
  "Tree",
  "Binary Tree",
  "Binary Search Tree",
  "Greedy",
  "Divide and Conquer",
  "Sliding Window",
  "Bit Manipulation",
  "Math",
  "Two Pointers",
  "Strings",
  "Trie",
  "Union Find",
  "Geometry",
  "Game Theory",
  "Segment Tree",
  "Fenwick Tree",
  "Memoization",
  "Combinatorics",
  "Breadth First Search",
  "Depth First Search",
  "Shortest Path",
  "Topological Sort",
  "Network Flow",
  "Knapsack",
  "Matrix",
  "Prefix Sum",
  "Kadane's Algorithm",
  "Hash Map",
  "Set",
  "Probability",
  "Modular Arithmetic",
  "Bitmasking",
  "Number Theory",
  "Intervals",
  "Monotonic Stack",
  "Monotonic Queue",
  "Z-Algorithm",
  "KMP Algorithm",
  "Minimum Spanning Tree",
  "Maximum Flow",
  "Eulerian Path",
  "Cycle Detection",
  "Strongly Connected Components",
  "Disjoint Set",
  "Probability and Statistics",
  "String Matching",
  "Pattern Searching",
];

const DifficultyBadge = ({ difficulty }) => {
  const difficultyColors = {
    Easy: "bg-green-500/20 text-green-400 border border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <Badge
      className={`${difficultyColors[difficulty] || "bg-gray-500/20 text-gray-400"} rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wider`}
    >
      {difficulty}
    </Badge>
  );
};

const ProblemSet = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionsSolved, setQuestionsSolved] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: null,
    tags: [],
  });

  useEffect(() => {
    const getAllQuestions = async () => {
      setIsLoading(true);
      const parsedFilters = filters.tags.join(",");

      try {
        const response = await axios.get(
          `${API_BASE_URL}/question/complete-question?page=${pageNo}&limit=${15}`,
          {
            params: {
              difficulty: filters.difficulty,
              tags: parsedFilters,
              search: searchTerm,
            },
          },
        );

        if (response.status === 200) {
          const { questions, totalPages, totalQuestions } = response.data.data;
          setQuestions(questions);
          setTotalPages(totalPages);
          setTotalQuestions(totalQuestions);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(getAllQuestions, 500);
    return () => clearTimeout(timerId);
  }, [pageNo, filters, searchTerm]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchUserQuestionsSolved = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/questions-solved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return { data: response.data.data, error: null };
      } catch (error) {
        return {
          data: null,
          error: error.response?.data?.error || error.message,
        };
      }
    };

    const fetchQuestionDifficultyCount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/question/difficulty-count`,
        );
        return { data: response.data.data, error: null };
      } catch (error) {
        return {
          data: null,
          error: error.response?.data?.error || error.message,
        };
      }
    };

    const fetchQuestionData = async () => {
      const [userResult, questionResult] = await Promise.allSettled([
        fetchUserQuestionsSolved(),
        fetchQuestionDifficultyCount(),
      ]);

      if (userResult.status === "fulfilled" && userResult.value.data) {
        setQuestionsSolved(userResult.value.data);
      } else {
        console.error(
          "Error fetching questions solved:",
          userResult?.value?.error,
        );
      }

      if (questionResult.status === "fulfilled" && questionResult.value.data) {
        setQuestionData(questionResult.value.data);
      } else {
        console.error(
          "Error fetching question difficulty count:",
          questionResult?.value?.error,
        );
      }
    };

    fetchQuestionData();
  }, []);

  const solveProblemClick = (id) => {
    navigate(`/problems/${id}`);
  };

  const clearAllFilters = () => {
    setFilters({ difficulty: null, tags: [] });
    setSearchTerm("");
  };

  const FiltersModal = () => {
    const [localDifficulty, setLocalDifficulty] = useState(filters.difficulty);
    const [localTags, setLocalTags] = useState([...filters.tags]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleApplyFilters = () => {
      setFilters({
        difficulty: localDifficulty,
        tags: localTags,
      });
    };

    const toggleTag = (tag) => {
      setLocalTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    };

    const filteredTags = tags.filter((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const tagGroups = filteredTags.reduce((groups, tag) => {
      const firstLetter = tag[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(tag);
      return groups;
    }, {});

    const clearAllFilters = () => {
      setLocalDifficulty(null);
      setLocalTags([]);
      setSearchTerm("");
    };

    const difficultyColors = {
      Easy: "bg-green-500/20 text-green-400 border border-green-500/30",
      Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      Hard: "bg-red-500/20 text-red-400 border border-red-500/30",
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-zinc-800 bg-zinc-900 text-gray-300 hover:bg-zinc-900 hover:text-gray-400"
          >
            <FilterIcon className="h-4 w-4" /> Filters
            {(filters.difficulty || filters.tags.length > 0) && (
              <Badge
                variant="secondary"
                className="ml-2 bg-zinc-800 text-gray-300"
              >
                {filters.difficulty ? 1 : 0 + filters.tags.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[90vh] w-[95vw] max-w-6xl border-zinc-800 bg-black">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-gray-100">
              <span>Filters</span>
              {(filters.difficulty || filters.tags.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-400 hover:text-red-500"
                >
                  Clear All
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-6">
            {/* Difficulty Filter */}
            <div className="col-span-3">
              <h4 className="mb-4 text-lg font-semibold text-gray-200">
                Difficulty
              </h4>
              <div className="flex flex-col space-y-2">
                {["Easy", "Medium", "Hard"].map((diff) => (
                  <Button
                    key={diff}
                    variant={localDifficulty === diff ? "default" : "outline"}
                    className={`w-full justify-start ${
                      localDifficulty === diff
                        ? difficultyColors[diff] // Apply the color styles from the object
                        : "hover:bg-zinc-850 border-zinc-800 bg-zinc-900 text-gray-400 hover:text-gray-200"
                    }`}
                    onClick={() =>
                      setLocalDifficulty(localDifficulty === diff ? null : diff)
                    }
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="col-span-9">
              <div className="mb-4 flex items-center space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-zinc-800 bg-zinc-900 pl-8 text-gray-300"
                  />
                </div>
                {localTags.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-900 text-blue-300"
                  >
                    {localTags.length} Selected
                  </Badge>
                )}
              </div>

              {/* Grouped Tags with Alphabetical Sections */}
              <div className="scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-800 max-h-[60vh] overflow-y-auto">
                {Object.entries(tagGroups).map(([letter, letterTags]) => (
                  <div key={letter} className="mb-4">
                    <h5 className="sticky top-0 z-10 mb-2 bg-black text-sm font-semibold text-gray-500">
                      {letter}
                    </h5>
                    <div className="grid grid-cols-4 gap-2">
                      {letterTags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center space-x-2 truncate"
                        >
                          <Checkbox
                            id={tag}
                            checked={localTags.includes(tag)}
                            onCheckedChange={() => toggleTag(tag)}
                            className="border-zinc-700 bg-zinc-800 data-[state=checked]:border-blue-800 data-[state=checked]:bg-blue-900"
                          />
                          <label
                            htmlFor={tag}
                            className="max-w-full truncate text-sm font-medium leading-none text-gray-300"
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="ghost"
              className="hover:bg-zinc-850 bg-zinc-900 text-gray-400 hover:text-gray-200"
              onClick={clearAllFilters}
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="hover:bg-blue-850 bg-blue-900 text-blue-300"
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const cardData = [
    {
      icon: StarIcon,
      color: "blue",
      label: "Total Problems",
      value: totalQuestions,
      difficulty: [
        {
          name: "Easy",
          count: questionData?.easyTotal,
          color: "bg-green-500",
        },
        {
          name: "Medium",
          count: questionData?.mediumTotal,
          color: "bg-yellow-500",
        },
        {
          name: "Hard",
          count: questionData?.hardTotal,
          color: "bg-red-500",
        },
      ],
    },
    {
      icon: CheckCircle2Icon,
      color: "green",
      label: "Solved",
      value: questionsSolved?.total || 0,
      difficulty: [
        {
          name: "Easy",
          count: questionsSolved?.easy || 0,
          color: "bg-green-500",
        },
        {
          name: "Medium",
          count: questionsSolved?.medium || 0,
          color: "bg-yellow-500",
        },
        {
          name: "Hard",
          count: questionsSolved?.hard || 0,
          color: "bg-red-500",
        },
      ],
    },
    {
      icon: XCircleIcon,
      color: "red",
      label: "Unsolved",
      value: totalQuestions - (questionsSolved?.total || 0),
      difficulty: [
        {
          name: "Easy",
          count: questionData?.easyTotal - (questionsSolved?.easy || 0),
          color: "bg-green-500",
        },
        {
          name: "Medium",
          count: questionData?.mediumTotal - (questionsSolved?.medium || 0),
          color: "bg-yellow-500",
        },
        {
          name: "Hard",
          count: questionData?.hardTotal - (questionsSolved?.hard || 0),
          color: "bg-red-500",
        },
      ],
    },
  ];

  return (
    <>
      <Particles
        className="fixed inset-0 h-screen w-screen"
        quantity={100}
        ease={80}
        color={"#ffffff"}
        refresh
      />
      <div className="min-h-screen bg-black text-gray-100 dark:bg-black dark:text-gray-100">
        <Navbar />
        <FixedActionButton />

        <div className="container mx-auto px-4 py-8">
          {/* Header with Search and Filters */}
          <div className="mb-8 flex items-center justify-between">
            <div className="relative mr-4 max-w-md flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-zinc-800 bg-zinc-900 text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="flex items-center space-x-4">
              <FiltersModal />
              {(filters.difficulty || filters.tags.length > 0) && (
                <Button
                  variant="destructive"
                  onClick={clearAllFilters}
                  className="bg-red-900/50 text-red-400 hover:bg-red-900/70"
                >
                  <XIcon className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {cardData.map(({ icon: Icon, color, label, value, difficulty }) => (
              <MagicCard
                key={label}
                className="group relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-zinc-900/60 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:border-zinc-700/70 hover:shadow-2xl"
              >
                <div className="flex h-full">
                  <div className={`w-1/2 bg-${color}-500/10 min-h-full p-6`}>
                    <div className="flex min-h-full flex-col items-center justify-center">
                      <div
                        className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-${color}-500/20 transition-all duration-500 group-hover:bg-${color}-500/30`}
                      >
                        <Icon
                          className={`h-10 w-10 text-${color}-500 transition-transform duration-500 group-hover:scale-110`}
                        />
                      </div>
                      <h3 className="mb-2 text-sm uppercase tracking-wider text-gray-400 transition-colors group-hover:text-gray-200">
                        {label}
                      </h3>
                      <p
                        className={`text-5xl font-bold text-${color}-500 transition-all group-hover:tracking-wide`}
                      >
                        {value}
                      </p>
                    </div>
                  </div>

                  <div className="w-full space-y-4 p-6">
                    {difficulty.map(({ name, count, color }) => (
                      <div key={name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
                            {name}
                          </span>
                          <span className="text-sm font-bold text-gray-200">
                            {count}
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className={`${color} h-full transition-all duration-500 group-hover:opacity-80`}
                            style={{
                              width: `${(count / totalQuestions) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </MagicCard>
            ))}
          </div>

          {/* Pagination */}
          {questions.length > 0 && (
            <Pagination className="my-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setPageNo(Math.max(1, pageNo - 1))}
                    disabled={pageNo === 1}
                    className="bg-zinc-900 text-gray-400 hover:bg-zinc-800 disabled:opacity-50"
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={pageNo === index + 1}
                      onClick={() => setPageNo(index + 1)}
                      className={`${
                        pageNo === index + 1
                          ? "bg-blue-950 text-blue-400"
                          : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"
                      }`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => setPageNo(Math.min(totalPages, pageNo + 1))}
                    disabled={pageNo === totalPages}
                    className="bg-zinc-900 text-gray-400 hover:bg-zinc-800 disabled:opacity-50"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-blue-800"></div>
            </div>
          ) : (
            <>
              {/* Problem List */}
              <div className="mb-8 space-y-4">
                {questions.map((question) => (
                  <Card
                    key={question._id}
                    onClick={() => solveProblemClick(question.question_id)}
                    className="hover:bg-zinc-850 cursor-pointer border-zinc-800 bg-zinc-900 transition-all duration-300 hover:border-zinc-700"
                  >
                    <MagicCard
                      className={
                        "hover:bg-zinc-850 flex flex-col border-zinc-800 bg-zinc-900 transition-all duration-300"
                      }
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Code2Icon className="h-6 w-6 text-indigo-500" />
                            <h3 className="text-lg font-semibold text-gray-100">
                              {question.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DifficultyBadge difficulty={question.difficulty} />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-indigo-400"
                            >
                              <ArrowUpRightIcon />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <TrendingUpIcon className="mr-2 h-4 w-4 text-green-500" />
                              <span>
                                {question.acceptanceRate.toFixed(2)}% Acceptance
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {question.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-zinc-800 text-gray-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </MagicCard>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {questions.length === 0 && (
                <div className="py-16 text-center">
                  <BookOpenIcon className="mx-auto mb-4 h-16 w-16 text-indigo-600" />
                  <p className="text-lg text-gray-500">
                    No problems found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProblemSet;
