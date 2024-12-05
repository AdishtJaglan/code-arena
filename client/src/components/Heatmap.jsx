/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const SubmissionsHeatmap = ({ data, dayData }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const year = 2024;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const margin = { top: 40, right: 10, bottom: 10, left: 10 };
    const maxWeeks = 6;
    const cellSpacing = 1;
    const cellSize = Math.min(
      36,
      (containerWidth - margin.left - margin.right) / (12 * (maxWeeks + 1) - 2),
    );
    const height = 7 * (cellSize + cellSpacing) + margin.top + margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const daysInMonth = (month) => new Date(year, month + 1, 0).getDate();

    const maxCount = d3.max(data.map((item) => item.count));
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateGreens)
      .domain([0, maxCount]);

    let xOffset = 0;

    for (let month = 0; month < 12; month++) {
      const monthDays = daysInMonth(month);
      const startDay = new Date(year, month, 1).getDay();

      svg
        .append("text")
        .attr("x", xOffset)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle")
        .attr("fill", "#718096")
        .attr("font-weight", "600")
        .attr("font-size", "10px")
        .text(
          new Date(year, month).toLocaleString("default", { month: "short" }),
        );

      for (let day = 0; day < monthDays; day++) {
        const dayOfWeek = (startDay + day) % 7;
        const week = Math.floor((startDay + day) / 7);

        const submission = data.find(
          (item) =>
            new Date(item.date).getFullYear() === year &&
            new Date(item.date).getMonth() === month &&
            new Date(item.date).getDate() === day + 1,
        );

        svg
          .append("rect")
          .attr("x", xOffset + week * cellSize)
          .attr("y", dayOfWeek * cellSize)
          .attr("width", cellSize - 1)
          .attr("height", cellSize - 1)
          .attr(
            "fill",
            submission && submission.count > 0
              ? colorScale(submission.count)
              : "#1f2937",
          )
          .attr("rx", 3)
          .attr("ry", 3)
          .style("stroke", "#4a5568")
          .style("stroke-width", 0.5)
          .style("transition", "all 0.2s ease")
          .on("mouseover", function () {
            d3.select(this).style("stroke", "#7c3aed").style("stroke-width", 1);
          })
          .on("mouseout", function () {
            d3.select(this)
              .style("stroke", "#4a5568")
              .style("stroke-width", 0.5);
          })
          .append("title")
          .text(
            `${new Date(year, month, day + 1).toLocaleDateString()}: ${
              submission ? submission.count : 0
            } submissions`,
          );
      }

      xOffset += maxWeeks * cellSize + cellSize;
    }
  }, [data, containerRef]);

  return (
    <div ref={containerRef} className="w-full space-y-4 bg-transparent">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-violet-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2a10 10 0 0 1 10 10v6a2 2 0 0 1-2 2h-6a10 10 0 0 1 0-20z" />
            <path d="M8 14v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <circle cx="12" cy="8" r="2" />
          </svg>
          <p>
            Active for{" "}
            <span
              className="font-semibold text-gray-200"
              data-tip={`User has been active for ${dayData.daysActive} days`}
            >
              {dayData.daysActive} days
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-blue-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <p>
              Highest streak:{" "}
              <span
                className="font-semibold text-gray-200"
                data-tip={`Longest streak is ${dayData.streaks.longestStreak} days`}
              >
                {dayData.streaks.longestStreak}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-orange-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a10 10 0 0 0 10 10v6a2 2 0 0 1-2 2h-6a10 10 0 0 0 0-20z" />
              <path d="M8 14v-2a2 2 0 0 0-2-2H2" />
              <circle cx="12" cy="8" r="2" />
            </svg>
            <p>
              Current streak:{" "}
              <span
                className="font-semibold text-gray-200"
                data-tip={`Current streak is ${dayData.streaks.currentStreak} days`}
              >
                {dayData.streaks.currentStreak}
              </span>
            </p>
          </div>
        </div>
      </div>
      <svg
        ref={svgRef}
        className="h-auto w-full rounded-md bg-neutral-800/50 shadow-sm ring-1 ring-gray-700"
      />
    </div>
  );
};

export default SubmissionsHeatmap;
