// TODO -> create toggle for isHidden flag. Only allow three cases of isHidden: true
/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileCode, Trash2, PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StepTestCases = ({ problemData, setProblemData }) => {
  const addTestCase = () => {
    setProblemData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "", isHidden: true }], //! dont hardcode this flag
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
    <div className="space-y-6">
      <AnimatePresence>
        {problemData.testCases.map((testCase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-neutral-800 bg-neutral-900/80 shadow-lg">
              <CardContent className="space-y-4 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center text-neutral-300">
                      <FileCode className="mr-2 h-4 w-4 text-blue-500" />
                      Input
                    </Label>
                    <Textarea
                      value={testCase.input}
                      onChange={(e) =>
                        updateTestCase(index, "input", e.target.value)
                      }
                      placeholder="Enter test case input"
                      className="min-h-[120px] border-neutral-800 bg-neutral-950 text-neutral-200 transition-all focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center text-neutral-300">
                      <FileCode className="mr-2 h-4 w-4 text-green-500" />
                      Output
                    </Label>
                    <Textarea
                      value={testCase.output}
                      onChange={(e) =>
                        updateTestCase(index, "output", e.target.value)
                      }
                      placeholder="Enter expected test case output"
                      className="min-h-[120px] border-neutral-800 bg-neutral-950 text-neutral-200 transition-all focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-neutral-800 p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="border-none bg-red-600/20 text-red-400 hover:bg-red-600/40"
                        onClick={() => removeTestCase(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Remove this test case</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-neutral-500">
                  Test Case {index + 1}
                </span>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Button
          onClick={addTestCase}
          className="group w-full bg-blue-600 text-white transition-all hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          Add Test Case
        </Button>
      </motion.div>
    </div>
  );
};

export default StepTestCases;
