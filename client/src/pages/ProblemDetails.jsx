import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const ProblemDetails = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar />
      <div className="p-6">
        <h1 className="text-4xl font-bold">Problem {id}</h1>
        <p className="mt-4 text-gray-300">
          Detailed description and test cases for the problem will go here.
        </p>
      </div>
    </div>
  );
};

export default ProblemDetails;
