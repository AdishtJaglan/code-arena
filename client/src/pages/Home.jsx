import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code, Target, Users, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/GridPattern";
import { MagicCard } from "@/components/MagicCard";
import FixedActionButton from "@/components/ActionButton";
// import IconCloud from "@/components/ui/icon-cloud";
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

  // const slugs = [
  //   "typescript",
  //   "javascript",
  //   "dart",
  //   "java",
  //   "react",
  //   "flutter",
  //   "android",
  //   "html5",
  //   "css3",
  //   "nodedotjs",
  //   "express",
  //   "nextdotjs",
  //   "prisma",
  //   "amazonaws",
  //   "postgresql",
  //   "firebase",
  //   "nginx",
  //   "testinglibrary",
  //   "jest",
  //   "cypress",
  //   "docker",
  //   "git",
  //   "jira",
  //   "github",
  //   "gitlab",
  //   "visualstudiocode",
  //   "androidstudio",
  //   "sonarqube",
  //   "figma",
  // ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-neutral-200">
      <div className="absolute inset-0 bg-neutral-900/50 opacity-50 blur-3xl"></div>

      <Navbar />
      <FixedActionButton />

      <div className="container relative z-10 mx-auto px-4">
        <div className="pt-24 text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-6xl font-black leading-tight text-neutral-100"
          >
            Code Arena
          </motion.h1>
          <GridPattern
            squares={[
              [10, 10],
              [12, 15],
              [15, 10],
              [10, 15],
              [24, 12],
              [32, 12],
              [12, 18],
              [18, 18],
              [21, 19],
              [21, 12],
            ]}
            className={cn(
              "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-60%] -z-50 h-[200%] skew-y-12",
            )}
          />
          {/* 
          <div className="absolute inset-x-0 inset-y-[-20%] -z-50 h-[200%] skew-y-12">
            <IconCloud iconSlugs={slugs} />
          </div> */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-xl text-neutral-500"
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
              className="flex transform items-center space-x-2 rounded-lg bg-neutral-800 px-6 py-3 text-neutral-200 transition-all hover:bg-neutral-700 active:scale-95"
            >
              <span>Start Coding</span>
              <ArrowRight className="h-5 w-5 text-neutral-400" />
            </Link>
            <Link
              to="/learn"
              className="flex transform items-center space-x-2 rounded-lg border border-neutral-800 px-6 py-3 text-neutral-400 transition-all hover:bg-neutral-900 active:scale-95"
            >
              <Zap className="h-5 w-5 text-neutral-600" />
              <span>Learn More</span>
            </Link>
          </motion.div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={featureVariants}
            >
              <MagicCard className="flex transform cursor-pointer flex-col items-center rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 py-8 text-center shadow-2xl hover:bg-neutral-900/80">
                <div className="mb-4 flex justify-center">
                  <feature.icon
                    className="h-12 w-12 text-neutral-600"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-200">
                  {feature.title}
                </h3>
                <p className="text-md text-neutral-500">
                  {feature.description}
                </p>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
