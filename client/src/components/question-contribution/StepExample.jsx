/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, PlusCircle, Trash2 } from "lucide-react";

const StepExample = ({ problemData, setProblemData }) => {
  const addExample = () => {
    setProblemData((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
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
    <div className="space-y-6">
      <AnimatePresence>
        {problemData.examples.map((example, index) => (
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
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      Input
                    </Label>
                    <Input
                      value={example.input}
                      onChange={(e) =>
                        updateExample(index, "input", e.target.value)
                      }
                      placeholder="Enter example input"
                      className="border-neutral-800 bg-neutral-950 text-neutral-200 transition-all focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center text-neutral-300">
                      <FileText className="mr-2 h-4 w-4 text-green-500" />
                      Output
                    </Label>
                    <Input
                      value={example.output}
                      onChange={(e) =>
                        updateExample(index, "output", e.target.value)
                      }
                      placeholder="Enter expected output"
                      className="border-neutral-800 bg-neutral-950 text-neutral-200 transition-all focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center text-neutral-300">
                    <FileText className="mr-2 h-4 w-4 text-purple-500" />
                    Explanation
                  </Label>
                  <Textarea
                    value={example.explanation}
                    onChange={(e) =>
                      updateExample(index, "explanation", e.target.value)
                    }
                    placeholder="Provide a detailed explanation of this example"
                    className="min-h-[120px] border-neutral-800 bg-neutral-950 text-neutral-200 transition-all focus:ring-2 focus:ring-purple-600"
                  />
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
                        onClick={() => removeExample(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Remove this example</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-xs text-neutral-500">
                  Example {index + 1}
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
          onClick={addExample}
          className="group w-full bg-blue-600 text-white transition-all hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          Add Example
        </Button>
      </motion.div>
    </div>
  );
};

export default StepExample;
