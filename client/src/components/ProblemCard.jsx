const ProblemCard = ({ title, difficulty, tags }) => {
  const difficultyColors = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow transition-shadow hover:shadow-lg">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className={`mt-2 ${difficultyColors[difficulty]}`}>{difficulty}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-gray-700 px-2 py-1 text-sm text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProblemCard;
