/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../configs/env-config.js";
import axios from "axios";
import {
  BookOpenIcon,
  Filter,
  Code2Icon,
  ArrowUpRightIcon,
  TagIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

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

  const FilterSidebar = () => (
    <div className="w-64 rounded-xl border border-gray-800/50 bg-gray-900/50 p-4 backdrop-blur-sm">
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
      <div className="flex">
        <FilterSidebar />
        <div className="flex-1 p-8">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {questions.map((question) => (
                  <div
                    key={question._id}
                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm transition-all hover:border-indigo-600/50 hover:shadow-2xl"
                  >
                    <div className="p-6">
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
                              <TooltipTrigger>
                                <ArrowUpRightIcon className="text-gray-500 hover:text-indigo-400" />
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
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 transition-all group-hover:opacity-100"></div>
                  </div>
                ))}
              </div>

              {questions.length > 0 && (
                <div className="mt-8 flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {/* Pagination logic remains the same */}
                  </div>
                  <div className="text-gray-400">
                    Page {pageNo} of {totalPages} • {totalQuestions} problems
                  </div>
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
