import { useState } from "react";
import {
  Sun,
  Eye,
  EyeOff,
  Bug,
  Code,
  Moon,
  WandSparkles,
  LoaderCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

const FixedActionButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApiDialogOpen, setIsApiDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey"));
  const [apiKeySubmitting, setApiKeySubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const menuItems = [
    {
      icon: Code,
      tooltip: "Configure API",
      onClick: () => setIsApiDialogOpen(true),
      className: "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800",
    },
    {
      icon: isDarkMode ? Sun : Moon,
      tooltip: "Toggle theme",
      onClick: () => setIsDarkMode(!isDarkMode),
      className: "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800",
    },
    {
      icon: Bug,
      tooltip: "Report bug",
      onClick: () => setIsBugReportOpen(true),
      className: "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800",
    },
  ];

  const handleApiDialogSubmit = async () => {
    setApiKeySubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (apiKey === "") {
      toast.error("API key must not be an empty string", {
        className: "border-rose-600 bg-rose-900 text-zinc-200",
        duration: 2000,
      });
    } else {
      localStorage.setItem("apiKey", apiKey);
      toast.success("API key saved successfully", {
        className: "border-zinc-800 bg-zinc-900 text-zinc-300",
        duration: 2000,
      });
    }

    setIsApiDialogOpen(false);
    setApiKeySubmitting(false);
  };

  return (
    <TooltipProvider>
      <Toaster position="bottom-left" theme="dark" />
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-3"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className={`${item.className} shadow-lg shadow-black/20`}
                        onClick={item.onClick}
                      >
                        <item.icon className="h-5 w-5 text-zinc-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="border-zinc-800 bg-zinc-900 text-zinc-400"
                    >
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="icon"
          className="relative border border-zinc-800 bg-zinc-900 shadow-lg shadow-black/20 hover:bg-zinc-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-rose-500"></span>
          <motion.div
            animate={{ rotate: isMenuOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <WandSparkles className="h-5 w-5 text-zinc-400" />
          </motion.div>
        </Button>

        <Dialog open={isApiDialogOpen} onOpenChange={setIsApiDialogOpen}>
          <DialogContent className="max-w-md rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-zinc-200">
                API Configuration
              </DialogTitle>
              <DialogDescription className="text-zinc-500">
                Enter your openAI API key to access additional features
              </DialogDescription>
            </DialogHeader>

            <Alert className="border border-zinc-800 bg-zinc-900">
              <AlertDescription className="text-zinc-400">
                Your API key is stored locally in your browser and is never
                transmitted to our servers.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-zinc-400">
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    placeholder="sk-..."
                    className="border-zinc-800 bg-zinc-900 pr-10 text-zinc-300 placeholder:text-zinc-600"
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-300"
                  >
                    {showApiKey ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsApiDialogOpen(false)}
                className="border-rose-600 bg-rose-900 text-zinc-400 hover:bg-red-900 hover:text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleApiDialogSubmit()}
                className="w-20 border border-emerald-600 bg-emerald-800 text-zinc-300 hover:bg-emerald-700"
              >
                {apiKeySubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isBugReportOpen} onOpenChange={setIsBugReportOpen}>
          <DialogContent className="max-w-md rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-zinc-200">Report Issue</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Help us improve by reporting any issues
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-zinc-400">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description"
                  className="border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-zinc-400">
                  Description
                </Label>
                <textarea
                  id="description"
                  className="h-32 w-full rounded-md border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 placeholder:text-zinc-600"
                  placeholder="Steps to reproduce the issue..."
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBugReportOpen(false)}
                className="border-rose-600 bg-rose-900 text-zinc-400 hover:bg-red-900 hover:text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsBugReportOpen(false)}
                className="border border-emerald-600 bg-emerald-800 text-zinc-300 hover:bg-emerald-700"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default FixedActionButton;
