/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const TAGS = [
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
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const StepProblemDetails = ({ problemData, setProblemData }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <Label className="text-neutral-400">Problem Title</Label>
        <Input
          value={problemData.title}
          onChange={(e) =>
            setProblemData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter problem title"
          className="border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
        />
      </div>

      <div>
        <Label className="text-neutral-400">Problem Explanation</Label>
        <Textarea
          value={problemData.explanation}
          onChange={(e) =>
            setProblemData((prev) => ({
              ...prev,
              explanation: e.target.value,
            }))
          }
          placeholder="Detailed problem description"
          className="min-h-[150px] border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
        />
      </div>

      <div>
        <Label className="text-neutral-400">Constraints</Label>
        <Textarea
          value={problemData.constraints}
          onChange={(e) =>
            setProblemData((prev) => ({
              ...prev,
              constraints: e.target.value,
            }))
          }
          placeholder="Problem constraints"
          className="min-h-[100px] border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-neutral-400">Tags</Label>
          <Select
            onValueChange={(value) => {
              setProblemData((prev) => ({
                ...prev,
                tags: prev.tags.includes(value)
                  ? prev.tags
                  : [...prev.tags, value],
              }));
            }}
          >
            <SelectTrigger className="border-neutral-800 bg-neutral-900 text-neutral-200">
              <SelectValue placeholder="Select tags" />
            </SelectTrigger>
            <SelectContent className="border-neutral-800 bg-neutral-900">
              {TAGS.map((tag) => (
                <SelectItem
                  key={tag}
                  value={tag}
                  className="text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800"
                >
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 flex flex-wrap gap-2">
            {problemData.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center rounded-full bg-black/20 px-2 py-1 text-xs text-neutral-300"
              >
                {tag}
                <button
                  className="ml-1 h-4 w-4"
                  onClick={() =>
                    setProblemData((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((t) => t !== tag),
                    }))
                  }
                >
                  <Trash2 className="h-3 w-3 text-rose-500 hover:text-rose-600" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-neutral-400">Difficulty</Label>
          <Select
            value={problemData.difficulty}
            onValueChange={(value) =>
              setProblemData((prev) => ({ ...prev, difficulty: value }))
            }
          >
            <SelectTrigger className="border-neutral-800 bg-neutral-900 text-neutral-200">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="border-neutral-800 bg-neutral-900">
              {DIFFICULTIES.map((diff) => (
                <SelectItem
                  key={diff}
                  value={diff}
                  className="text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800"
                >
                  {diff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
};

export default StepProblemDetails;
