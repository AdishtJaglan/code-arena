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
import { Trash2, PlusCircle } from "lucide-react";

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
          <Label>Problem Title</Label>
          <Input
            value={problemData.title}
            onChange={(e) =>
              setProblemData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter problem title"
          />
        </div>

        <div>
          <Label>Problem Explanation</Label>
          <Textarea
            value={problemData.explanation}
            onChange={(e) =>
              setProblemData((prev) => ({
                ...prev,
                explanation: e.target.value,
              }))
            }
            placeholder="Detailed problem description"
            className="min-h-[150px]"
          />
        </div>

        <div>
          <Label>Constraints</Label>
          <Textarea
            value={problemData.constraints}
            onChange={(e) =>
              setProblemData((prev) => ({
                ...prev,
                constraints: e.target.value,
              }))
            }
            placeholder="Problem constraints"
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tags</Label>
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
              <SelectTrigger>
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent>
                {TAGS.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {problemData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center rounded-full bg-primary/20 px-2 py-1 text-xs"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4"
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
            <Label>Difficulty</Label>
            <Select
              value={problemData.difficulty}
              onValueChange={(value) =>
                setProblemData((prev) => ({ ...prev, difficulty: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((diff) => (
                  <SelectItem key={diff} value={diff}>
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
            <Label>{lang} Boilerplate Code</Label>
            <Editor
              height="250px"
              language={lang.toLowerCase()}
              theme="vs-dark"
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
              <Label>Input</Label>
              <Textarea
                value={testCase.input}
                onChange={(e) => updateTestCase(index, "input", e.target.value)}
                placeholder="Test case input"
              />
            </div>
            <div>
              <Label>Output</Label>
              <Textarea
                value={testCase.output}
                onChange={(e) =>
                  updateTestCase(index, "output", e.target.value)
                }
                placeholder="Test case output"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => removeTestCase(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addTestCase} className="w-full">
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
          <div key={index} className="relative space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Input</Label>
                <Input
                  value={example.input}
                  onChange={(e) =>
                    updateExample(index, "input", e.target.value)
                  }
                  placeholder="Example input"
                />
              </div>
              <div>
                <Label>Output</Label>
                <Input
                  value={example.output}
                  onChange={(e) =>
                    updateExample(index, "output", e.target.value)
                  }
                  placeholder="Example output"
                />
              </div>
            </div>
            <div>
              <Label>Explanation</Label>
              <Textarea
                value={example.explanation}
                onChange={(e) =>
                  updateExample(index, "explanation", e.target.value)
                }
                placeholder="Explain the example"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => removeExample(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addExample} className="w-full">
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
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Create Competitive Programming Problem</CardTitle>
        <CardDescription>Fill out problem details step by step</CardDescription>
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
              <div
                key={step}
                className={`w-full py-2 text-center ${
                  currentStep === index
                    ? "font-bold text-primary"
                    : "text-muted-foreground"
                } `}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="relative h-1 w-full bg-muted">
            <div
              className="absolute h-1 bg-primary transition-all duration-300"
              style={{
                width: `${(currentStep + 1) * 20}%`,
                left: 0,
              }}
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
          >
            Previous
          </Button>
          {currentStep === 4 ? (
            <Button onClick={handleSubmit}>Submit Problem</Button>
          ) : (
            <Button onClick={nextStep}>Next</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitiveProgrammingForm;
