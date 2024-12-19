import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { API_BASE_URL } from "@/configs/env-config";
import axios from "axios";

import StepProblemDetails from "@/components/question-contribution/StepProblemDetails";
import StepCodeInput from "@/components/question-contribution/StepCodeInput";
import StepTestCases from "@/components/question-contribution/StepTestCases";
import StepExample from "@/components/question-contribution/StepExample";
import StepEmpty from "@/components/question-contribution/StepEmpty";

const LANGUAGES = [
  {
    name: "Python",
    icon: "/icons/python-icon.svg",
    defaultCode:
      "def solution():\n    # Write your code here\n    pass\n\n# Example usage\nprint(solution())",
  },
  {
    name: "JavaScript",
    icon: "/icons/javascript-icon.svg",
    defaultCode:
      "function solution() {\n    // Write your code here\n    return null;\n}\n\n// Example usage\nconsole.log(solution());",
  },
  {
    name: "Java",
    icon: "/icons/java-icon.svg",
    defaultCode:
      "public class Solution {\n    public static void main(String[] args) {\n        // Example usage\n        System.out.println(solution());\n    }\n    \n    public static Object solution() {\n        // Write your code here\n        return null;\n    }\n}",
  },
  {
    name: "C++",
    icon: "/icons/cpp-icon.svg",
    defaultCode:
      "#include <iostream>\n\nusing namespace std;\n\nauto solution() {\n    // Write your code here\n    return nullptr;\n}\n\nint main() {\n    // Example usage\n    cout << solution() << endl;\n    return 0;\n}",
  },
];

const steps = [
  "Problem Details",
  "Code Inputs",
  "Test Cases",
  "Examples",
  "Extra",
];

const getCodeLanguageAndCode = (obj) => {
  return Object.entries(obj).map(([key, value]) => {
    return { language: key, code: value };
  });
};

const CompetitiveProgrammingForm = () => {
  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES[0].name);
  const [copiedLanguage, setCopiedLanguage] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [problemData, setProblemData] = useState({
    title: "",
    explanation: "",
    constraints: "",
    tags: [],
    difficulty: "",

    codeInputs: {
      "C++": "",
      Java: "",
      Python: "",
    },

    testCases: [],

    examples: [],
  });

  const handleLanguageChange = useCallback((lang) => {
    setActiveLanguage(lang);
  }, []);

  const handleCodeChange = useCallback(
    (value, lang) => {
      setProblemData((prev) => ({
        ...prev,
        codeInputs: {
          ...prev.codeInputs,
          [lang]: value || "",
        },
      }));
    },
    [setProblemData],
  );

  const handleCopyCode = useCallback(
    (lang) => {
      const code = problemData.codeInputs[lang];
      navigator.clipboard.writeText(code);
      setCopiedLanguage(lang);

      setTimeout(() => {
        setCopiedLanguage(null);
      }, 2000);
    },
    [problemData],
  );

  const handleResetCode = useCallback(
    (lang) => {
      const defaultCode =
        LANGUAGES.find((l) => l.name === lang)?.defaultCode || "";
      handleCodeChange(defaultCode, lang);
    },
    [handleCodeChange],
  );

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepProblemDetails
            problemData={problemData}
            setProblemData={setProblemData}
          />
        );
      case 1:
        return (
          <StepCodeInput
            activeLanguage={activeLanguage}
            handleLanguageChange={handleLanguageChange}
            handleResetCode={handleResetCode}
            handleCopyCode={handleCopyCode}
            handleCodeChange={handleCodeChange}
            problemData={problemData}
            copiedLanguage={copiedLanguage}
          />
        );
      case 2:
        return (
          <StepTestCases
            problemData={problemData}
            setProblemData={setProblemData}
          />
        );
      case 3:
        return (
          <StepExample
            problemData={problemData}
            setProblemData={setProblemData}
          />
        );
      case 4:
        return <StepEmpty />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("You must be logged in to create a question.");
      return;
    }

    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const {
        title,
        constraints,
        tags,
        difficulty,
        explanation,
        codeInputs,
        testCases,
        examples,
      } = problemData;

      const {
        data: {
          data: {
            question: { _id: questionId },
          },
        },
      } = await api.post("/question/create", {
        title,
        constraints,
        tags,
        difficulty,
        explanation,
      });

      const requests = [
        api.post("/code-question/create-many", {
          questionId,
          codeQuestion: getCodeLanguageAndCode(codeInputs),
        }),
        api.post("/test-case/create-many", {
          question: questionId,
          testCases,
        }),
        api.post("/example/create-many", {
          question: questionId,
          examples,
        }),
      ];

      await Promise.all(requests);

      toast.success("Question created successfully!");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unknown error occurred";
      toast.error(`Error creating question: ${errorMessage}`);
      console.error("Question creation error:", error);
    }
  };

  return (
    <div className="font-inter flex min-h-screen items-center justify-center bg-black p-4 text-neutral-300">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-2 text-3xl font-light tracking-tight text-neutral-100">
            Problem Architect
          </h1>
          <p className="text-sm text-neutral-400">
            Craft your coding challenge with precision
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`mx-1 h-1 flex-1 rounded-full transition-all duration-300 ${
                currentStep === index
                  ? "bg-neutral-600"
                  : currentStep > index
                    ? "bg-neutral-700"
                    : "bg-neutral-900"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-rose-500 px-6 py-3 text-white"
        >
          test
        </button>

        {/* Content Area */}
        <motion.div
          className="rounded-lg border border-neutral-800 bg-neutral-900 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent(currentStep)}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex flex-1 items-center justify-center rounded-md border border-neutral-800 py-3 text-neutral-300 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </button>

          <button
            onClick={nextStep}
            className={`flex-1 rounded-md py-3 transition-all ${
              currentStep === steps.length - 1
                ? "bg-neutral-700 text-neutral-100 hover:bg-neutral-600"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            } flex items-center justify-center active:scale-[0.98]`}
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveProgrammingForm;
