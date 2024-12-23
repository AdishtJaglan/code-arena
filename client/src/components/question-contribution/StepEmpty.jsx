/* eslint-disable react/prop-types */
import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Code2,
  FileText,
  CheckSquare,
  Languages,
  ChevronRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import Button from "../Button";

const SolutionForm = ({ solutions, setSolutions, handleSaveSolution }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showTypeSelection, setShowTypeSelection] = useState(true);
  const [activeSolution, setActiveSolution] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState("cpp");

  const solutionTypes = [
    {
      id: "brute",
      label: "Brute Force",
      description: "Initial working solution",
    },
    {
      id: "better",
      label: "Better Solution",
      description: "Improved approach",
    },
    {
      id: "optimal",
      label: "Optimal Solution",
      description: "Most efficient implementation",
    },
  ];

  const languages = [
    { id: "cpp", name: "C++", language: "cpp" },
    { id: "python", name: "Python", language: "python" },
    { id: "java", name: "Java", language: "java" },
    { id: "javascript", name: "JavaScript", language: "javascript" },
  ];

  const handleTypeSelection = (type) => {
    setSelectedTypes((prev) => {
      const isSelected = prev.includes(type);
      return isSelected ? prev.filter((t) => t !== type) : [...prev, type];
    });
  };

  const initializeSolutions = () => {
    if (selectedTypes.length === 0) return;

    const initialSolutions = {};
    selectedTypes.forEach((type) => {
      initialSolutions[type] = {
        heading: "",
        explanation: "",
        code: languages.reduce(
          (acc, lang) => ({
            ...acc,
            [lang.id]: "",
          }),
          {},
        ),
      };
    });

    setSolutions(initialSolutions);
    setShowTypeSelection(false);
    setActiveSolution(selectedTypes[0]);
  };

  const handleCodeChange = (value, language) => {
    setSolutions((prev) => ({
      ...prev,
      [activeSolution]: {
        ...prev[activeSolution],
        code: {
          ...prev[activeSolution].code,
          [language]: value,
        },
      },
    }));
  };

  if (showTypeSelection) {
    return (
      <div className="font-inter flex items-center justify-center p-4 text-neutral-300">
        <div className="w-full max-w-xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-2 text-3xl font-light tracking-tight text-neutral-100">
              Select Solutions
            </h1>
            <p className="text-sm text-neutral-400">
              Choose the types of solutions you will provide
            </p>
          </motion.div>

          <motion.div
            className="rounded-lg p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="space-y-4">
              {solutionTypes.map((type) => (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelection(type.id)}
                  className={`cursor-pointer rounded-lg border ${
                    selectedTypes.includes(type.id)
                      ? "border-neutral-600 bg-neutral-800"
                      : "border-neutral-800 bg-neutral-900"
                  } p-4 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg text-neutral-200">{type.label}</h3>
                      <p className="text-sm text-neutral-400">
                        {type.description}
                      </p>
                    </div>
                    <CheckSquare
                      className={`h-5 w-5 transition-all ${
                        selectedTypes.includes(type.id)
                          ? "text-neutral-200"
                          : "text-neutral-600"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <button
            onClick={initializeSolutions}
            disabled={selectedTypes.length === 0}
            className="w-full rounded-md bg-neutral-800 py-3 text-neutral-300 transition-all hover:bg-neutral-700 active:scale-[0.98] disabled:opacity-50"
          >
            Continue
            <ChevronRight className="ml-2 inline-block h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter overflow-scroll text-neutral-300">
      <div className="flex">
        {/* Sidebar */}
        <div className="flex h-full w-64 flex-col">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <h2 className="mb-6 text-xl font-semibold text-neutral-100">
                Solutions
              </h2>

              <div className="space-y-2">
                {selectedTypes.map((type) => {
                  const solution = solutionTypes.find((t) => t.id === type);
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSolution(type)}
                      className={`group relative w-full overflow-hidden rounded-lg p-4 text-left transition-all ${
                        activeSolution === type
                          ? "bg-neutral-800"
                          : "hover:bg-neutral-800/40"
                      }`}
                    >
                      <div className="relative z-10 flex items-center space-x-3">
                        <div
                          className={`h-3 w-3 rounded-full transition-colors ${
                            activeSolution === type
                              ? "bg-blue-500 shadow-lg shadow-blue-500/30"
                              : "bg-neutral-600"
                          }`}
                        />
                        <span
                          className={`font-medium transition-colors ${
                            activeSolution === type
                              ? "text-neutral-100"
                              : "text-neutral-400 group-hover:text-neutral-300"
                          }`}
                        >
                          {solution?.label}
                        </span>
                      </div>

                      {activeSolution === type && (
                        <motion.div
                          layoutId="activeBackground"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>

          <div className="p-6">
            <Separator className="mb-6 bg-neutral-800" />

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-neutral-800 bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                onClick={() => setShowTypeSelection(true)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Selection
              </Button>

              <Button
                className="w-full bg-sky-600 text-white hover:bg-sky-700"
                onClick={() => handleSaveSolution(solutions)}
              >
                Save Solution
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSolution}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <h2 className="text-lg text-neutral-200">
                        Solution Details
                      </h2>
                    </div>
                    <input
                      value={solutions[activeSolution]?.heading || ""}
                      onChange={(e) =>
                        setSolutions((prev) => ({
                          ...prev,
                          [activeSolution]: {
                            ...prev[activeSolution],
                            heading: e.target.value,
                          },
                        }))
                      }
                      placeholder="Solution Heading"
                      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-neutral-200 placeholder:text-neutral-600"
                    />
                    <textarea
                      value={solutions[activeSolution]?.explanation || ""}
                      onChange={(e) =>
                        setSolutions((prev) => ({
                          ...prev,
                          [activeSolution]: {
                            ...prev[activeSolution],
                            explanation: e.target.value,
                          },
                        }))
                      }
                      placeholder="Explain your approach..."
                      className="h-32 w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-neutral-200 placeholder:text-neutral-600"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Code2 className="h-5 w-5" />
                        <h2 className="text-lg text-neutral-200">
                          Implementation
                        </h2>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Languages className="h-4 w-4 text-neutral-400" />
                        <select
                          value={activeLanguage}
                          onChange={(e) => setActiveLanguage(e.target.value)}
                          className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1 text-sm text-neutral-300"
                        >
                          {languages.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeLanguage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-[calc(100vh-520px)] min-h-[300px] overflow-hidden rounded-lg border border-neutral-800"
                      >
                        <Editor
                          height="100%"
                          language={
                            languages.find((l) => l.id === activeLanguage)
                              ?.language
                          }
                          value={
                            solutions[activeSolution]?.code[activeLanguage] ||
                            ""
                          }
                          onChange={(value) =>
                            handleCodeChange(value, activeLanguage)
                          }
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            fontFamily: "JetBrains Mono, monospace",
                            padding: { top: 16, bottom: 16 },
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionForm;
