import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

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
    <div className="font-inter min-h-screen bg-black text-neutral-300">
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
      <Navbar />

      <div className="flex w-full text-neutral-300">
        {/* Sidebar */}
        <div className="flex h-[calc(100vh-4rem)] w-1/3 flex-col justify-between border-r border-neutral-800/50 bg-black p-4 pt-8">
          <div className="mx-auto w-full space-y-6">
            {/* Header with subtle animation */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="mb-1 bg-gradient-to-r from-neutral-100 to-neutral-400 bg-clip-text text-2xl font-light tracking-tight text-transparent">
                Problem Architect
              </h1>
              <p className="text-xs text-neutral-400">
                Craft your coding challenge
              </p>
            </motion.div>

            {/* Progress Tracker */}
            <div className="relative pt-1">
              <div className="absolute left-0 top-4 h-0.5 w-full rounded-full bg-neutral-900">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neutral-600 to-neutral-500"
                  style={{
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <div key={step} className="group flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        currentStep > index
                          ? "border-neutral-500 bg-neutral-600 text-neutral-100"
                          : currentStep === index
                            ? "border-neutral-500 bg-black text-neutral-300 ring-2 ring-neutral-800/50 ring-offset-1 ring-offset-black"
                            : "border-neutral-800 bg-black text-neutral-500"
                      }`}
                    >
                      {currentStep > index ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </motion.div>
                    <span
                      className={`mt-2 text-[10px] transition-all duration-300 ${
                        currentStep === index
                          ? "text-neutral-300"
                          : currentStep > index
                            ? "text-neutral-500"
                            : "text-neutral-600"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Card */}
            <Card className="border-neutral-800 bg-neutral-900/90 backdrop-blur-sm">
              <CardContent className="min-h-[300px] p-4">
                <div className="flex h-full flex-col items-center justify-center space-y-3">
                  <div className="rounded-full bg-neutral-800/50 px-3 py-1 text-xs text-neutral-400">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                  <h2 className="text-lg font-medium text-neutral-300">
                    {steps[currentStep]}
                  </h2>
                  <p className="text-center text-xs text-neutral-400">
                    Complete your {steps[currentStep].toLowerCase()} to proceed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex-1 border-neutral-800 bg-transparent py-2 text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-neutral-200 disabled:opacity-30"
              >
                <ArrowLeft className="mr-2 h-3 w-3" /> Back
              </Button>
              <Button
                onClick={nextStep}
                className={`flex-1 py-2 text-sm ${
                  currentStep === steps.length - 1
                    ? "bg-gradient-to-r from-neutral-600 to-neutral-500 hover:from-neutral-500 hover:to-neutral-400"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className="py-y bg-rose-500 px-6">
          test
        </button>

        {/* Main Content Area */}
        <div className="w-2/3 p-8">
          <motion.div
            className="h-full rounded-lg border border-neutral-800 bg-neutral-900/90 p-8 backdrop-blur-sm"
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
        </div>
      </div>
    </div>
  );
};

export default CompetitiveProgrammingForm;
