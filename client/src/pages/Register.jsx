/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AccountCircle,
  NavigateNext,
  NavigateBefore,
  PersonAdd,
  AccountBox,
  Link as LinkIcon,
  Close,
} from "@mui/icons-material";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../configs/env-config";
import axios from "axios";
import Button from "../components/Button";
import StepDetails from "../components/register/StepDetails";
import StepProfile from "../components/register/StepProfile";
import StepConnections from "../components/register/StepConnections";
import StepRequest from "../components/register/StepRequest";
import "react-toastify/dist/ReactToastify.css";

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
  {
    id: 4,
    title: "Send Request",
    description: "Reach out to your parnter!",
    icon: <ForwardToInboxIcon className="h-6 w-6" />,
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
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 via-zinc-950 to-blue-950 p-6 shadow-xl"
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
    <div className="hidden h-full flex-col space-y-4 p-8 lg:flex">
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex items-start">
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.id ? 1.1 : 1,
              }}
              className={`z-10 mb-2 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-blue-900 text-blue-300 shadow-lg"
                  : "border border-zinc-800/50 bg-black/40 text-gray-600"
              }`}
            >
              {`${step.id}`}
            </motion.div>
            {index !== steps.length - 1 && (
              <motion.div
                initial={{ backgroundColor: "#111827" }}
                animate={{
                  backgroundColor:
                    currentStep > step.id ? "#1e40af" : "#111827",
                  height: currentStep > step.id ? "4rem" : "4rem",
                }}
                className="w-1 rounded-full"
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
          <div className="ml-4">
            <h3
              className={`font-medium transition-colors duration-300 ${
                currentStep >= step.id ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {step.title}
            </h3>
            <p
              className={`text-sm transition-colors duration-300 ${
                currentStep >= step.id ? "text-gray-400" : "text-gray-600"
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

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
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

  const handleSkip = () => {
    navigate("/home");
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("username", formData?.username);
      formDataToSend.append("email", formData?.email);
      formDataToSend.append("password", formData?.password);
      formDataToSend.append("bio", formData?.bio);

      formDataToSend.append("socialLinks[github]", formData?.github);
      formDataToSend.append("socialLinks[leetcode]", formData?.leetcode);
      formDataToSend.append("socialLinks[codeforces]", formData?.codeforces);

      if (formData?.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 201) {
        toast.success("User created successfully");
        localStorage.setItem("accessToken", response.data?.data?.accessToken);
        localStorage.setItem("refreshToken", response.data?.data?.refreshToken);
        handleNext();
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
        setPartnerInfo(response.data.data.user);
        setVerificationStatus({
          isVerifying: false,
          isVerified: true,
          error: null,
        });
        setFormData((prev) => ({
          ...prev,
          accountabilityPartner: response.data.data.user.username,
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

  const handlePartnerRequest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_BASE_URL}/partner/request/`,
        {
          receiverId: partnerInfo?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("Request sent successfully.");
        setIsRequestSent(true);
      }
    } catch (error) {
      console.error("Unable to send request:" + error);
      toast.error("Unable to send request at this time.");
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
        <StepDetails
          formData={formData}
          handleInputChange={handleInputChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      ),
      2: (
        <StepProfile
          formData={formData}
          handleFileChange={handleFileChange}
          verificationStatus={verificationStatus}
          handleVerifyPartner={handleVerifyPartner}
          partnerInfo={partnerInfo}
          setIsPartnerModalOpen={setIsPartnerModalOpen}
          handleInputChange={handleInputChange}
        />
      ),
      3: (
        <StepConnections
          formData={formData}
          handleInputChange={handleInputChange}
        />
      ),
      4: (
        <StepRequest
          partnerData={partnerInfo}
          onSendRequest={handlePartnerRequest}
        />
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
          className="overflow-y-auto"
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-blue-950 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/70 shadow-2xl backdrop-blur-lg"
        >
          <div className="w-80 border-r border-zinc-800/50">
            <Timeline currentStep={currentStep} />
          </div>

          <div className="flex-1 p-8">
            <div className="flex h-[32.5rem] flex-col">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-blue-500">
                  {steps[currentStep - 1].title}
                </h1>
                <p className="mt-2 text-gray-500">
                  {steps[currentStep - 1].description}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {renderStepContent()}
              </div>

              <div className="mt-8 flex items-center justify-between space-x-4">
                {currentStep !== 1 && currentStep !== 4 && (
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
                )}

                {currentStep === 3 && (
                  <Button onClick={handleSubmit}>
                    Create Account
                    <NavigateNext />
                  </Button>
                )}
                {currentStep < 3 && (
                  <Button type="button" onClick={handleNext}>
                    Continue
                    <NavigateNext />
                  </Button>
                )}
                {currentStep === 4 && (
                  <Button onClick={handleSkip}>
                    {isRequestSent ? "Home" : "Skip"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
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
