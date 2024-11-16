import { useState } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import ProblemCard from "../components/ProblemCard";

const ProblemSet = () => {
  const [filter, setFilter] = useState({});
  const problems = [
    { title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Table"] },
    {
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      tags: ["String", "Sliding Window"],
    },
    {
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      tags: ["Array", "Binary Search"],
    },
  ];

  const filteredProblems = problems.filter((problem) => {
    if (
      filter.search &&
      !problem.title.toLowerCase().includes(filter.search.toLowerCase())
    )
      return false;
    if (filter.difficulty && problem.difficulty !== filter.difficulty)
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar />
      <div className="p-6">
        <FilterBar
          onFilterChange={(change) =>
            setFilter({ ...filter, [change.type]: change.value })
          }
        />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemSet;
