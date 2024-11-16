const FilterBar = ({ onFilterChange }) => {
  return (
    <div className="flex items-center justify-between rounded bg-gray-900 p-4">
      <input
        type="text"
        placeholder="Search problems..."
        className="rounded bg-gray-800 p-2 text-gray-300 focus:outline-none"
        onChange={(e) =>
          onFilterChange({ type: "search", value: e.target.value })
        }
      />
      <select
        className="rounded bg-gray-800 p-2 text-gray-300"
        onChange={(e) =>
          onFilterChange({ type: "difficulty", value: e.target.value })
        }
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
};

export default FilterBar;
