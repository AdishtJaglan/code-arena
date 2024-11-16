const Navbar = () => {
  return (
    <div className="flex justify-between bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-4 shadow-lg">
      <div className="text-2xl font-bold text-white">ProblemSolver</div>
      <div className="flex items-center gap-6">
        <p className="cursor-pointer text-gray-200 hover:text-white">Home</p>
        <p className="cursor-pointer text-gray-200 hover:text-white">
          Problems
        </p>
        <p className="cursor-pointer text-gray-200 hover:text-white">
          Leaderboard
        </p>
        <p className="cursor-pointer text-gray-200 hover:text-white">Discuss</p>
      </div>
    </div>
  );
};

export default Navbar;
