import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Zap } from "lucide-react";

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

  const renderCurrentStep = () => {
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

  const handleSubmit = () => {
    console.log("Full Problem Data:", problemData);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-neutral-200">
      <div className="absolute inset-0 bg-neutral-900/50 opacity-50 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4">
        <Card className="mx-auto w-full max-w-4xl border border-neutral-800 bg-neutral-900/60 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle
              as={motion.h2}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-black text-neutral-100"
            >
              Create Problem
            </CardTitle>
            <CardDescription className="mt-2 text-neutral-500">
              Fill out problem details step by step
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stepper */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                {[
                  "Problem Details",
                  "Code Inputs",
                  "Test Cases",
                  "Examples",
                  "Extra",
                ].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full py-2 text-center ${
                      currentStep === index
                        ? "font-bold text-neutral-100"
                        : "text-neutral-500"
                    } `}
                  >
                    {step}
                  </motion.div>
                ))}
              </div>
              <div className="relative h-1 w-full bg-neutral-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep + 1) * 20}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute h-1 bg-blue-600"
                  style={{ left: 0 }}
                />
              </div>
            </div>

            {/* Current Step Content */}
            <div className="mb-6">{renderCurrentStep()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-neutral-800 text-neutral-300 transition-all hover:bg-neutral-800 active:scale-95"
              >
                Previous
              </Button>
              {currentStep === 4 ? (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-95"
                >
                  <span>Submit Problem</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-95"
                >
                  <span>Next</span>
                  <Zap className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompetitiveProgrammingForm;
