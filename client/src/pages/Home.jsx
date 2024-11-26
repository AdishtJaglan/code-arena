import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, Target, Users, Zap, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const LandingPage = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      icon: Code,
      title: "Diverse Challenges",
      description:
        "Wide range of coding problems across multiple difficulty levels",
    },
    {
      icon: Target,
      title: "Skill Tracking",
      description:
        "Comprehensive progress monitoring and performance analytics",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Connect with developers, share solutions, learn together",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950 text-gray-200">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-indigo-900/10 to-purple-900/20 opacity-50 blur-3xl"></div>

      <Navbar />
      <div className="container relative z-10 mx-auto px-4">
        <div className="pt-24 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-6xl font-black leading-tight text-transparent"
          >
            Code Arena
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-xl text-gray-400"
          >
            Elevate your coding skills through challenging problems, real-time
            progress tracking, and collaborative learning
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-10 flex justify-center space-x-4"
          >
            <Link
              to="/problems"
              className="flex transform items-center space-x-2 rounded-lg bg-violet-700 px-6 py-3 text-white transition-all hover:scale-105 hover:bg-violet-600 active:scale-95"
            >
              <span>Start Coding</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/learn"
              className="flex transform items-center space-x-2 rounded-lg border border-gray-700 px-6 py-3 text-gray-300 transition-all hover:scale-105 hover:bg-gray-800 active:scale-95"
            >
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>Learn More</span>
            </Link>
          </motion.div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              animate="visible"
              variants={featureVariants}
              transition={{ delay: index * 0.2 }}
              className="transform rounded-xl border border-gray-800 bg-gray-900/60 p-6 text-center transition-all hover:scale-105 hover:bg-gray-900/80"
            >
              <div className="mb-4 flex justify-center">
                <feature.icon
                  className="h-12 w-12 text-violet-500"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
