/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCw, Check, Copy } from "lucide-react";
import { Editor } from "@monaco-editor/react";

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

const StepCodeInput = ({
  activeLanguage,
  handleLanguageChange,
  handleResetCode,
  handleCopyCode,
  handleCodeChange,
  problemData,
  copiedLanguage,
}) => {
  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl"
      >
        <Tabs
          value={activeLanguage}
          onValueChange={handleLanguageChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 rounded-none border-b border-neutral-800 bg-neutral-950/50 p-1">
            {LANGUAGES.map((lang) => (
              <TabsTrigger
                key={lang.name}
                value={lang.name}
                className="group relative transition-all duration-300 data-[state=active]:bg-neutral-800"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={lang.icon}
                    alt={`${lang.name} icon`}
                    className="h-5 w-5 opacity-60 transition-opacity group-data-[state=active]:opacity-100"
                  />
                  <span className="font-medium text-neutral-400 group-data-[state=active]:text-white">
                    {lang.name}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {LANGUAGES.map((lang) => (
            <TabsContent key={lang.name} value={lang.name} className="p-4">
              <div className="relative">
                <div className="absolute right-2 top-2 z-10 flex space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-neutral-800/50 hover:bg-neutral-700"
                        onClick={() => handleResetCode(lang.name)}
                      >
                        <RefreshCw className="h-4 w-4 text-neutral-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Reset to Default
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-neutral-800/50 hover:bg-neutral-700"
                        onClick={() => handleCopyCode(lang.name)}
                      >
                        {copiedLanguage === lang.name ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-neutral-400" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {copiedLanguage === lang.name ? "Copied!" : "Copy Code"}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Editor
                  height="400px"
                  language={
                    lang.name === "C++" ? "cpp" : lang.name.toLowerCase()
                  }
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollbar: {
                      vertical: "hidden",
                      horizontal: "hidden",
                    },
                    lineNumbers: "on",
                    glyphMargin: true,
                    folding: true,
                    lineDecorationsWidth: 10,
                    renderLineHighlight: "none",
                    fontFamily: "JetBrains Mono, Consolas, monospace",
                    fontSize: 13,
                  }}
                  value={
                    problemData.codeInputs[lang.name] ||
                    LANGUAGES.find((l) => l.name === lang.name)?.defaultCode ||
                    ""
                  }
                  onChange={(value) => handleCodeChange(value, lang.name)}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </TooltipProvider>
  );
};

export default StepCodeInput;
