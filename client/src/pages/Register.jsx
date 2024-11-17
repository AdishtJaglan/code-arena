/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AccountCircle,
  Lock,
  Email,
  GitHub,
  Code,
  Description,
  NavigateNext,
  NavigateBefore,
  Visibility,
  VisibilityOff,
  PersonAdd,
  AccountBox,
  Link as LinkIcon,
  CloudUpload,
  LinkedIn,
  CheckCircle,
  Error as ErrorIcon,
  Close,
  InfoOutlined,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const steps = [
  {
    id: 1,
    title: "Account Details",
    description: "Create your login credentials",
    icon: <PersonAdd className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Profile Setup",
    description: "Tell us about yourself",
    icon: <AccountBox className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Connections",
    description: "Link your profiles",
    icon: <LinkIcon className="h-6 w-6" />,
  },
];

const PartnerInfoModal = ({ isOpen, onClose, partnerInfo }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
                {partnerInfo.profilePicture ? (
                  <img
                    src={partnerInfo.profilePicture}
                    alt={partnerInfo.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <AccountCircle className="h-8 w-8 text-violet-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100">
                  {partnerInfo.username}
                </h3>
                <p className="text-sm text-gray-400">Accountability Partner</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-300"
            >
              <Close />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <h4 className="text-sm font-medium text-gray-400">Rating</h4>
              <p className="text-gray-100">{partnerInfo.rating}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400">Bio</h4>
              <p className="text-gray-100">
                {partnerInfo.bio || "No bio provided"}
              </p>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Timeline = ({ currentStep }) => {
  return (
    <div className="hidden h-full flex-col space-y-8 p-8 lg:flex">
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex items-start">
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.id ? 1.2 : 1,
              }}
              className={`z-10 mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 ${
                currentStep >= step.id
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {step.icon}
            </motion.div>
            {index !== steps.length - 1 && (
              <motion.div
                initial={false}
                animate={{
                  backgroundColor:
                    currentStep > step.id ? "#8b5cf6" : "#1f2937",
                }}
                className="h-32 w-1 rounded-full"
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
          <div className="ml-4">
            <h3
              className={`font-medium transition-colors duration-300 ${
                currentStep >= step.id ? "text-violet-400" : "text-gray-400"
              }`}
            >
              {step.title}
            </h3>
            <p
              className={`text-sm transition-colors duration-300 ${
                currentStep >= step.id ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Input = ({ icon: Icon, label, error, ...props }) => (
  <div className="relative">
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        {...props}
        className={`w-full rounded-lg border bg-gray-800 py-3 pl-10 pr-4 text-gray-100 placeholder-gray-400 transition-colors duration-200 ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-700 focus:border-violet-500"
        } focus:outline-none focus:ring-1 focus:ring-violet-500`}
      />
      {label && (
        <label className="absolute -top-2 left-2 bg-gray-900 px-1 text-xs text-gray-400">
          {label}
        </label>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Button = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800",
    secondary:
      "border border-gray-700 text-gray-300 hover:bg-gray-800 active:bg-gray-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    isVerifying: false,
    isVerified: false,
    error: null,
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    profilePicture: null,
    accountabilityPartner: "",
    bio: "",
    github: "",
    codeforces: "",
    leetcode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: e.target.files[0],
    }));
  };

  const handleNext = () => {
    if (
      formData.username === "" ||
      formData.password === "" ||
      formData.email === ""
    ) {
      toast.error("All field here are mandatory!");
      return;
    }

    if (
      currentStep === 2 &&
      formData.accountabilityPartner !== "" &&
      verificationStatus.isVerified !== true
    ) {
      toast.error("Please verify partner's email, or leave it empty.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    console.log("Form submitted:", formData);

    try {
      const body = {
        username: formData?.username,
        email: formData?.email,
        password: formData?.password,
        profilePicture: formData?.profilePicture,
        bio: formData?.bio,
        socialLinks: {
          github: formData?.github,
          leetcode: formData?.leetcode,
          codeforces: formData?.codeforces,
        },
      };

      const response = await axios.post(`${API_BASE_URL}/user/register`, body);

      if (response.status === 201) {
        toast.success("User created successfully");
        localStorage.setItem("accessToken", response.data.token);
        navigate("/problems");
      }

      if (response.status === 409) {
        toast.info("User already exists.");
      }

      if (response.status === 400) {
        toast.error("Please enter required fields.");
      }
    } catch (error) {
      console.error("Error creating user:" + error);
      toast.error("Unable to create user. Try again.");
    }
  };

  const handleVerifyPartner = async () => {
    if (!formData.accountabilityPartner) return;

    setVerificationStatus({
      isVerifying: true,
      isVerified: false,
      error: null,
    });

    try {
      const body = {
        email: formData.accountabilityPartner,
      };
      const response = await axios.post(`${API_BASE_URL}/user/email`, body);

      if (response.status === 200) {
        toast.success("Partner verified!");
        setPartnerInfo(response.data.user);
        setVerificationStatus({
          isVerifying: false,
          isVerified: true,
          error: null,
        });
        setFormData((prev) => ({
          ...prev,
          accountabilityPartner: response.data.user._id,
        }));
      }

      if (response.status === 404) {
        toast.info("Partner does not exist.");
        setVerificationStatus({
          isVerifying: false,
          isVerified: false,
          error: "Partner not found",
        });
      }
    } catch (error) {
      toast.error("Unable to verify partner.");
      console.error("Unable to verify email:" + error);
      setPartnerInfo(null);
      setVerificationStatus({
        isVerifying: false,
        isVerified: false,
        error: "Partner not found",
      });
    }
  };

  const slideVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const renderStepContent = () => {
    const content = {
      1: (
        <motion.div className="space-y-6">
          <Input
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleInputChange}
            icon={AccountCircle}
            placeholder="Enter your username"
            required
          />
          <div className="relative">
            <Input
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              icon={Lock}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>
          <Input
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            icon={Email}
            placeholder="Enter your email"
            required
          />
        </motion.div>
      ),
      2: (
        <motion.div className="space-y-6">
          <div className="relative rounded-lg border border-dashed border-gray-700 p-6">
            <input
              type="file"
              hidden
              id="profile-picture"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label
              htmlFor="profile-picture"
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <CloudUpload className="h-8 w-8 text-violet-500" />
              <span className="text-sm text-gray-400">
                {formData.profilePicture
                  ? formData.profilePicture.name
                  : "Upload Profile Picture"}
              </span>
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  name="accountabilityPartner"
                  label="Accountability Partner Email"
                  type="email"
                  value={formData.accountabilityPartner}
                  onChange={handleInputChange}
                  icon={Email}
                  placeholder="partner@example.com"
                  error={verificationStatus.error}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleVerifyPartner}
                  disabled={
                    !formData.accountabilityPartner ||
                    verificationStatus.isVerifying
                  }
                  className={`mt-0.5 flex items-center gap-2 rounded-lg px-12 font-medium transition-all duration-200 ${
                    verificationStatus.isVerified
                      ? "bg-green-500/10 text-green-500"
                      : verificationStatus.error
                        ? "bg-red-500/10 text-red-500"
                        : "bg-violet-500/10 text-violet-500 hover:bg-violet-500/20"
                  } ${(!formData.accountabilityPartner || verificationStatus.isVerifying) && "cursor-not-allowed opacity-50"}`}
                >
                  {verificationStatus.isVerifying ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  ) : verificationStatus.isVerified ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : verificationStatus.error ? (
                    <ErrorIcon className="h-5 w-5" />
                  ) : (
                    "Verify"
                  )}
                </button>
                {verificationStatus.isVerified && partnerInfo && (
                  <button
                    type="button"
                    onClick={() => setIsPartnerModalOpen(true)}
                    className="mt-0.5 flex items-center justify-center rounded-lg bg-gray-800 px-3 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  >
                    <InfoOutlined />
                  </button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {verificationStatus.isVerified && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-green-500"
                >
                  Partner verified successfully!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              className="min-h-[120px] w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-gray-100 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <Description className="absolute right-3 top-3 text-gray-400" />
          </div>
        </motion.div>
      ),
      3: (
        <motion.div className="space-y-6">
          <Input
            name="github"
            label="GitHub Profile"
            value={formData.github}
            onChange={handleInputChange}
            icon={GitHub}
            placeholder="github.com/username"
          />
          <Input
            name="codeforces"
            label="Codeforces Profile"
            value={formData.codeforces}
            onChange={handleInputChange}
            icon={Code}
            placeholder="codeforces.com/profile/username"
          />
          <Input
            name="leetcode"
            label="LeetCode Profile"
            value={formData.leetcode}
            onChange={handleInputChange}
            icon={LinkedIn}
            placeholder="leetcode.com/username"
          />
        </motion.div>
      ),
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {content[currentStep]}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-8">
        <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
          <div className="w-80 border-r border-gray-800">
            <Timeline currentStep={currentStep} />
          </div>

          <div className="flex-1 p-8">
            <div className="flex h-[32.5rem] flex-col">
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-2xl font-bold text-transparent">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="mt-2 text-gray-400">
                    {steps[currentStep - 1].description}
                  </p>
                </motion.div>
              </div>

              <form className="flex-1">{renderStepContent()}</form>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? "opacity-50" : ""}
                >
                  <NavigateBefore />
                  Previous
                </Button>

                {currentStep === steps.length ? (
                  <Button onClick={handleSubmit}>
                    Create Account
                    <NavigateNext />
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Continue
                    <NavigateNext />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PartnerInfoModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        partnerInfo={partnerInfo}
      />
    </>
  );
};

export default Register;
