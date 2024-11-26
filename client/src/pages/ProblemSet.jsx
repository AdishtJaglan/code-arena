/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../configs/env-config.js";
import axios from "axios";
import {
  BookOpenIcon,
  Filter,
  Code2Icon,
  ArrowUpRightIcon,
  TrendingUpIcon,
  StarIcon,
  CheckCircle2Icon,
  XCircleIcon,
  TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Navbar from "@/components/Navbar.jsx";

const DifficultyBadge = ({ difficulty }) => {
  const difficultyColors = {
    Easy: "bg-green-500/20 text-green-400",
    Medium: "bg-yellow-500/20 text-yellow-400",
    Hard: "bg-red-500/20 text-red-400",
  };

  return (
    <Badge
      className={`${difficultyColors[difficulty] || "bg-gray-500/20 text-gray-400"} px-2 py-1 text-xs font-medium uppercase tracking-wider`}
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
  const [filters, setFilters] = useState({
    difficulty: null,
    tags: [],
  });

  useEffect(() => {
    const getAllQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/question/complete-question?page=${pageNo}&limit=${15}`,
          {
            params: {
              difficulty: filters.difficulty,
              tags: filters.tags,
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

    getAllQuestions();
  }, [pageNo, filters]);

  const solveProblemClick = (id) => {
    navigate(`/problems/${id}`);
  };

  const FilterSidebar = () => (
    <div className="fixed h-full w-1/5 rounded-xl border border-gray-800/50 bg-gray-900/50 p-4 backdrop-blur-sm">
      <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-200">
        <Filter className="mr-2" /> Filters
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-400">Difficulty</h4>
          <div className="flex space-x-2">
            {["Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    difficulty: prev.difficulty === diff ? null : diff,
                  }))
                }
                className={`rounded-md px-3 py-1 text-sm transition-all ${
                  filters.difficulty === diff
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-400">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {["Array", "String", "Dynamic Programming", "Tree", "Graph"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(tag)
                        ? prev.tags.filter((t) => t !== tag)
                        : [...prev.tags, tag],
                    }))
                  }
                  className={`flex items-center rounded-md px-2 py-1 text-xs transition-all ${
                    filters.tags.includes(tag)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <TagIcon className="mr-1 h-3 w-3" /> {tag}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-gray-200">
      <div className="flex gap-3">
        <div className="min-h-screen w-1/5">
          <FilterSidebar />
        </div>

        <div className="w-4/5 flex-1 space-y-6">
          <Navbar />
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div className="group relative overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900 p-5">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center space-x-3">
                    <StarIcon className="h-5 w-5 text-indigo-500 opacity-70 transition-opacity group-hover:opacity-100" />
                    <span className="text-sm font-medium text-gray-400 transition-colors group-hover:text-gray-200">
                      Total Problems
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-100 transition-colors group-hover:text-indigo-400">
                    {totalQuestions}
                  </p>
                </div>
                <StarIcon className="absolute right-0 top-1/2 h-16 w-16 -translate-y-1/2 text-gray-800 opacity-20 transition-opacity group-hover:opacity-30" />
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900 p-5">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center space-x-3">
                    <CheckCircle2Icon className="h-5 w-5 text-green-500 opacity-70 transition-opacity group-hover:opacity-100" />
                    <span className="text-sm font-medium text-gray-400 transition-colors group-hover:text-gray-200">
                      Solved
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-100 transition-colors group-hover:text-green-400">
                    0
                  </p>
                </div>
                <CheckCircle2Icon className="absolute right-0 top-1/2 h-16 w-16 -translate-y-1/2 text-gray-800 opacity-20 transition-opacity group-hover:opacity-30" />
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900 p-5">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="mb-2 flex items-center space-x-3">
                    <XCircleIcon className="h-5 w-5 text-red-500 opacity-70 transition-opacity group-hover:opacity-100" />
                    <span className="text-sm font-medium text-gray-400 transition-colors group-hover:text-gray-200">
                      Unsolved
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-100 transition-colors group-hover:text-red-400">
                    {totalQuestions}
                  </p>
                </div>
                <XCircleIcon className="absolute right-0 top-1/2 h-16 w-16 -translate-y-1/2 text-gray-800 opacity-20 transition-opacity group-hover:opacity-30" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card
                    key={question._id}
                    onClick={() => solveProblemClick(question.question_id)}
                    className="group cursor-pointer border-gray-800/50 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-indigo-600/50 hover:shadow-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Code2Icon className="text-indigo-400" />
                          <h3 className="text-lg font-semibold text-indigo-300 group-hover:text-indigo-200">
                            {question.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DifficultyBadge difficulty={question.difficulty} />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ArrowUpRightIcon className="text-gray-500 hover:text-indigo-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Solve Problem</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                        <div className="flex space-x-6">
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
                                className="bg-gray-800 text-gray-300"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {questions.length > 0 && (
                <div className="flex items-center justify-center py-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => setPageNo(Math.max(1, pageNo - 1))}
                          disabled={pageNo === 1}
                        />
                      </PaginationItem>
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            isActive={pageNo === index + 1}
                            onClick={() => setPageNo(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() =>
                            setPageNo(Math.min(totalPages, pageNo + 1))
                          }
                          disabled={pageNo === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {questions.length === 0 && (
                <div className="py-16 text-center text-gray-500">
                  <BookOpenIcon className="mx-auto mb-4 h-16 w-16 text-indigo-500" />
                  <p>No problems found. Try adjusting your filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSet;
