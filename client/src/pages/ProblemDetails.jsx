/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "@/configs/env-config";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Code,
  Clock,
  BarChart2,
  Copy,
  CheckCircle2,
  FileCode,
  ChevronRight,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Gauge,
  Check,
  Layers,
  FileText,
  CodeIcon,
  Save,
  Play,
  Languages,
} from "lucide-react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LANGUAGE_CONFIGS from "@/configs/language-config";

const LanguageDropdown = ({ language, languages, onLanguageChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = languages[language];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-md bg-gray-700 px-3 py-2 text-gray-300 transition-colors hover:bg-gray-600"
      >
        <currentLang.icon className="h-4 w-4" />
        <span className="text-sm capitalize">{language}</span>
        <Languages className="ml-1 h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 overflow-hidden rounded-md border border-gray-700 bg-gray-800 shadow-lg">
          {Object.keys(languages).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                onLanguageChange(lang);
                setIsOpen(false);
              }}
              className={`flex w-full items-center space-x-2 px-3 py-2 text-left ${
                language === lang
                  ? "bg-violet-700 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              } `}
            >
              {React.createElement(languages[lang].icon, {
                className: "w-4 h-4",
              })}
              <span className="text-sm capitalize">{lang}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProblemDetails = () => {
  const { id } = useParams();
  const editorRef = useRef(null);

  const [examples, setExamples] = useState([]);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [submittedBy, setSubmittedBy] = useState(null);
  const [expandedSolution, setExpandedSolution] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("// your code goes in here");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getQuestionDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/question/complete-question/${id}`,
        );

        const { answer, submittedBy, examples, ...question } =
          response.data.data.question;

        console.log(response.data.data.question);

        setQuestion(question);
        setAnswers(answer);
        setSubmittedBy(submittedBy);
        setExamples(examples);
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching question: ", error);
      }
    };

    getQuestionDetails();
  }, [id]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-gray-200">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-indigo-900/10 to-purple-900/20 opacity-50 blur-3xl"></div>
      <Navbar />
      <div className="container relative z-10 mx-auto px-4 pt-8">
        {loading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-700"></div>
                <div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-700"></div>
              </div>
              <p className="mt-4 text-sm text-gray-300">
                <span className="text-blue-400">Loading</span>
                <span className="ml-1 text-green-400">content</span>
                <span className="ml-1 text-purple-400">...</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60">
            <div className="w-1/2 overflow-auto border-r border-gray-800 p-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="mb-4 bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
                  {question.title}
                </h1>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 rounded-md bg-gray-800 p-3">
                    <Clock className="text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-300">Time Limit</p>
                      <p className="font-semibold text-blue-400">
                        {question.timeLimit}ms
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rounded-md bg-gray-800 p-3">
                    <BarChart2 className="text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-300">Memory</p>
                      <p className="font-semibold text-blue-400">
                        {question.memoryLimit}MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rounded-md bg-gray-800 p-3">
                    <Gauge
                      className={`${
                        question.difficulty === "Easy"
                          ? "text-green-400"
                          : question.difficulty === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-gray-300">Difficulty</p>
                      <p
                        className={`font-semibold ${
                          question.difficulty === "Easy"
                            ? "text-green-400"
                            : question.difficulty === "Medium"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {question.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rounded-md bg-gray-800 p-3">
                    <Check className="text-green-400" />
                    <div>
                      <p className="text-sm text-gray-300">Acceptance</p>
                      <p className="font-semibold text-green-400">
                        {question.acceptanceRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between rounded-md bg-gray-800 p-4">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="text-green-400" />
                    <span className="text-gray-300">{question.likes}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="text-red-400" />
                    <span className="text-gray-300">{question.dislikes}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Layers className="text-purple-400" />
                    <span className="text-gray-300">
                      {question.noOfSuccess + question.noOfFails}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-purple-400">
                    Constraints
                  </h2>
                  <p className="rounded-md bg-gray-800 p-4 text-gray-300">
                    {question.constraints}
                  </p>
                </div>

                <div>
                  <h2 className="mb-2 text-xl font-semibold text-purple-400">
                    Examples
                  </h2>
                  <div className="space-y-4">
                    {examples.map((example, index) => (
                      <div
                        key={example._id || index}
                        className="rounded-md border border-gray-700 bg-gray-800 p-4 transition-all hover:border-purple-500"
                      >
                        <p className="mb-2 text-gray-300">
                          <strong className="text-blue-400">Input:</strong>{" "}
                          {example.input}
                        </p>
                        <p className="mb-2 text-gray-300">
                          <strong className="text-green-400">Output:</strong>{" "}
                          {example.output}
                        </p>
                        <p className="text-gray-300">
                          <strong className="text-purple-400">
                            Explanation:
                          </strong>{" "}
                          {example.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 rounded-md bg-gray-800 p-4">
                  <img
                    src={submittedBy.profilePicture}
                    alt={submittedBy.username}
                    className="h-16 w-16 rounded-full border-2 border-purple-500 object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-300">
                      {submittedBy.username}
                    </p>
                    <p className="text-sm text-gray-400">{submittedBy.bio}</p>
                    <p className="mt-1 text-sm text-blue-400">
                      Submitted {submittedBy.submissionDate}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex w-1/2 flex-col">
              <Tabs defaultValue="code" className="flex h-full flex-col">
                <TabsList className="grid w-full grid-cols-2 border-b border-gray-700 bg-gray-800/50">
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-violet-900/50 data-[state=active]:text-violet-300"
                  >
                    <Code className="mr-2 h-4 w-4" /> Code
                  </TabsTrigger>
                  <TabsTrigger
                    value="solutions"
                    className="data-[state=active]:bg-violet-900/50 data-[state=active]:text-violet-300"
                  >
                    <FileCode className="mr-2 h-4 w-4" /> Solutions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="flex-1 overflow-hidden">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between space-x-4 bg-gray-800/80 p-2">
                      <LanguageDropdown
                        language={language}
                        languages={LANGUAGE_CONFIGS}
                        onLanguageChange={handleLanguageChange}
                      />

                      <div className="flex items-center space-x-2">
                        <button
                          // onClick={runTestCases}
                          className="group flex items-center space-x-2 rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-500"
                        >
                          <Play className="h-4 w-4 group-hover:animate-pulse" />
                          <span className="text-sm">Run</span>
                        </button>
                        <button className="group flex items-center space-x-2 rounded-md bg-green-600 px-3 py-2 text-white transition-colors hover:bg-green-500">
                          <Save className="h-4 w-4 group-hover:scale-110" />
                          <span className="text-sm">Submit</span>
                        </button>
                      </div>
                    </div>

                    <MonacoEditor
                      height="60vh"
                      language={language}
                      theme="vs-dark"
                      value={code}
                      onChange={handleCodeChange}
                      onMount={handleEditorDidMount}
                      options={{
                        fontSize: 14,
                        minimap: {
                          enabled: true,
                          side: "right",
                          renderCharacters: false,
                        },
                        scrollbar: {
                          vertical: "auto",
                          horizontal: "auto",
                        },
                        automaticLayout: true,
                        wordWrap: "on",
                        contextmenu: true,
                        formatOnType: true,
                        formatOnPaste: true,
                        smoothScrolling: true,
                      }}
                    />

                    <div className="p-4">
                      <h3 className="mb-4 text-xl font-semibold text-gray-200">
                        Test Cases
                      </h3>
                      {/* {testCases.slice(0, 3).map((testCase, index) => (
                        <div
                          key={testCase._id}
                          className="mb-4 rounded-lg border border-gray-700 bg-gray-800 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-md font-medium text-gray-300">
                              Test Case {index + 1}
                            </h4>
                            {testResults[index] &&
                              (testResults[index].passed ? (
                                <CheckCircle2 className="text-green-500" />
                              ) : (
                                <XCircle className="text-red-500" />
                              ))}
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-semibold text-blue-400">
                                Input:
                              </span>
                              <span className="ml-2 text-gray-300">
                                {testCase.input}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold text-green-400">
                                Expected Output:
                              </span>
                              <span className="ml-2 text-gray-300">
                                {testCase.output}
                              </span>
                            </p>
                            {testResults[index] &&
                              !testResults[index].passed && (
                                <p className="text-sm text-red-400">
                                  Test case failed
                                </p>
                              )}
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="solutions"
                  className="flex-1 space-y-4 overflow-auto p-4"
                >
                  {answers.solutions.map((solution, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-700 bg-gray-800/50"
                    >
                      <div
                        onClick={() =>
                          setExpandedSolution(
                            expandedSolution === index ? null : index,
                          )
                        }
                        className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-800/70"
                      >
                        <div className="flex items-center space-x-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              solution.type === "Optimal"
                                ? "bg-green-900/50 text-green-400"
                                : solution.type === "Brute Force"
                                  ? "bg-rose-700 text-rose-200/80"
                                  : "bg-blue-600 text-blue-200/80"
                            }`}
                          >
                            {solution.type}
                          </span>
                          <h3 className="font-semibold text-gray-300">
                            {solution.heading}
                          </h3>
                        </div>
                        {expandedSolution === index ? (
                          <ChevronDown className="text-gray-400" />
                        ) : (
                          <ChevronRight className="text-gray-400" />
                        )}
                      </div>

                      {expandedSolution === index && (
                        <div className="border-t border-gray-700 bg-gray-800/50 p-4">
                          <div className="mb-6">
                            <div className="mb-2 flex items-center">
                              <CodeIcon className="mr-2 text-blue-400" />
                              <h3 className="text-lg font-semibold text-blue-300">
                                Solution
                              </h3>
                            </div>
                            <div className="relative">
                              <pre className="overflow-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed">
                                {solution.answer}
                              </pre>
                              <button
                                onClick={() => copyToClipboard(solution.answer)}
                                className="absolute right-2 top-2 rounded-lg bg-gray-800 p-2 transition-colors hover:bg-gray-700"
                                aria-label="Copy solution"
                              >
                                <Copy className="h-4 w-4 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {solution.explanation && (
                            <div className="mt-4">
                              <div className="mb-2 flex items-center">
                                <FileText className="mr-2 text-green-400" />
                                <h3 className="text-lg font-semibold text-green-300">
                                  Explanation
                                </h3>
                              </div>
                              <div className="rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-300">
                                {solution.explanation}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-400">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>
                              Contributed by{" "}
                              <span className="cursor-pointer font-bold text-pink-600 transition-colors hover:text-pink-500">
                                {solution.contributedBy.username}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetails;
