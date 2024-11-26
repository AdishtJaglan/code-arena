import { Code, Settings, Save, Cpu } from "lucide-react";

const LANGUAGE_CONFIGS = {
  python: {
    language: "python",
    theme: "vs-dark",
    icon: Cpu,
  },
  javascript: {
    language: "javascript",
    theme: "vs-dark",
    icon: Code,
  },
  cpp: {
    language: "cpp",
    theme: "vs-dark",
    icon: Settings,
  },
  java: {
    language: "java",
    theme: "vs-dark",
    icon: Save,
  },
};

export default LANGUAGE_CONFIGS;
