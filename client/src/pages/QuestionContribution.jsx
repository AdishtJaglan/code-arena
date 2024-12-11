import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Editor } from "@monaco-editor/react";
import { Trash2, PlusCircle, ArrowRight, Zap } from "lucide-react";

const TAGS = [
  "Array",
  "String",
  "Dynamic Programming",
  "Graph",
  "Tree",
  "Math",
  "Greedy",
  "Recursion",
  "Bit Manipulation",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const LANGUAGES = ["C++", "Java", "Python"];

const CompetitiveProgrammingForm = () => {
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

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderProblemDetails = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div>
          <Label className="text-neutral-400">Problem Title</Label>
          <Input
            value={problemData.title}
            onChange={(e) =>
              setProblemData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter problem title"
            className="border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
          />
        </div>

        <div>
          <Label className="text-neutral-400">Problem Explanation</Label>
          <Textarea
            value={problemData.explanation}
            onChange={(e) =>
              setProblemData((prev) => ({
                ...prev,
                explanation: e.target.value,
              }))
            }
            placeholder="Detailed problem description"
            className="min-h-[150px] border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
          />
        </div>

        <div>
          <Label className="text-neutral-400">Constraints</Label>
          <Textarea
            value={problemData.constraints}
            onChange={(e) =>
              setProblemData((prev) => ({
                ...prev,
                constraints: e.target.value,
              }))
            }
            placeholder="Problem constraints"
            className="min-h-[100px] border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-neutral-400">Tags</Label>
            <Select
              onValueChange={(value) => {
                setProblemData((prev) => ({
                  ...prev,
                  tags: prev.tags.includes(value)
                    ? prev.tags
                    : [...prev.tags, value],
                }));
              }}
            >
              <SelectTrigger className="border-neutral-800 bg-neutral-900 text-neutral-200">
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent className="border-neutral-800 bg-neutral-900">
                {TAGS.map((tag) => (
                  <SelectItem
                    key={tag}
                    value={tag}
                    className="text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800"
                  >
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {problemData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center rounded-full bg-blue-600/20 px-2 py-1 text-xs text-neutral-300"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
                    onClick={() =>
                      setProblemData((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((t) => t !== tag),
                      }))
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-neutral-400">Difficulty</Label>
            <Select
              value={problemData.difficulty}
              onValueChange={(value) =>
                setProblemData((prev) => ({ ...prev, difficulty: value }))
              }
            >
              <SelectTrigger className="border-neutral-800 bg-neutral-900 text-neutral-200">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="border-neutral-800 bg-neutral-900">
                {DIFFICULTIES.map((diff) => (
                  <SelectItem
                    key={diff}
                    value={diff}
                    className="text-neutral-200 hover:bg-neutral-800 focus:bg-neutral-800"
                  >
                    {diff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCodeInputs = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {LANGUAGES.map((lang) => (
          <div key={lang} className="space-y-2">
            <Label className="text-neutral-400">{lang} Boilerplate Code</Label>
            <Editor
              height="250px"
              language={lang.toLowerCase()}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                },
                lineNumbers: "off",
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
              }}
              value={problemData.codeInputs[lang]}
              onChange={(value) =>
                setProblemData((prev) => ({
                  ...prev,
                  codeInputs: { ...prev.codeInputs, [lang]: value || "" },
                }))
              }
            />
          </div>
        ))}
      </motion.div>
    );
  };

  const renderTestCases = () => {
    const addTestCase = () => {
      setProblemData((prev) => ({
        ...prev,
        testCases: [...prev.testCases, { input: "", output: "" }],
      }));
    };

    const updateTestCase = (index, field, value) => {
      const updatedTestCases = [...problemData.testCases];
      updatedTestCases[index][field] = value;
      setProblemData((prev) => ({ ...prev, testCases: updatedTestCases }));
    };

    const removeTestCase = (index) => {
      setProblemData((prev) => ({
        ...prev,
        testCases: prev.testCases.filter((_, i) => i !== index),
      }));
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {problemData.testCases.map((testCase, index) => (
          <div key={index} className="relative grid grid-cols-2 gap-4">
            <div>
              <Label className="text-neutral-400">Input</Label>
              <Textarea
                value={testCase.input}
                onChange={(e) => updateTestCase(index, "input", e.target.value)}
                placeholder="Test case input"
                className="min-h-[100px] border-neutral-800 bg-neutral-900 text-neutral-200"
              />
            </div>
            <div>
              <Label className="text-neutral-400">Output</Label>
              <Textarea
                value={testCase.output}
                onChange={(e) =>
                  updateTestCase(index, "output", e.target.value)
                }
                placeholder="Test case output"
                className="min-h-[100px] border-neutral-800 bg-neutral-900 text-neutral-200"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-0 top-0 border-none bg-red-600/20 text-red-400 hover:bg-red-600/40"
              onClick={() => removeTestCase(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          onClick={addTestCase}
          className="w-full bg-blue-600 text-white transition-all hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Test Case
        </Button>
      </motion.div>
    );
  };

  const renderExamples = () => {
    const addExample = () => {
      setProblemData((prev) => ({
        ...prev,
        examples: [
          ...prev.examples,
          { input: "", output: "", explanation: "" },
        ],
      }));
    };

    const updateExample = (index, field, value) => {
      const updatedExamples = [...problemData.examples];
      updatedExamples[index][field] = value;
      setProblemData((prev) => ({ ...prev, examples: updatedExamples }));
    };

    const removeExample = (index) => {
      setProblemData((prev) => ({
        ...prev,
        examples: prev.examples.filter((_, i) => i !== index),
      }));
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {problemData.examples.map((example, index) => (
          <div
            key={index}
            className="relative space-y-2 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-400">Input</Label>
                <Input
                  value={example.input}
                  onChange={(e) =>
                    updateExample(index, "input", e.target.value)
                  }
                  placeholder="Example input"
                  className="border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
                />
              </div>
              <div>
                <Label className="text-neutral-400">Output</Label>
                <Input
                  value={example.output}
                  onChange={(e) =>
                    updateExample(index, "output", e.target.value)
                  }
                  placeholder="Example output"
                  className="border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
                />
              </div>
            </div>
            <div>
              <Label className="text-neutral-400">Explanation</Label>
              <Textarea
                value={example.explanation}
                onChange={(e) =>
                  updateExample(index, "explanation", e.target.value)
                }
                placeholder="Explain the example"
                className="min-h-[100px] border-neutral-800 bg-neutral-900 text-neutral-200 focus:border-blue-600"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-4 top-4 border-none bg-red-600/20 text-red-400 hover:bg-red-600/40"
              onClick={() => removeExample(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          onClick={addExample}
          className="w-full bg-blue-600 text-white transition-all hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Example
        </Button>
      </motion.div>
    );
  };

  const renderEmptyStep = () => (
    <div className="p-8 text-center text-muted-foreground">
      Step 5 - Coming Soon
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderProblemDetails();
      case 1:
        return renderCodeInputs();
      case 2:
        return renderTestCases();
      case 3:
        return renderExamples();
      case 4:
        return renderEmptyStep();
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
