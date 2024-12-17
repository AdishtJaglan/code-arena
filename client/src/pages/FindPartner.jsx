/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GitHub } from "@mui/icons-material";
import { Star, Code, CheckCircle, Send, Activity } from "lucide-react";
import { API_BASE_URL } from "@/configs/env-config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Particles from "@/components/Particles";
import axios from "axios";
import Navbar from "@/components/Navbar";

const PartnerCard = ({ partner }) => {
  const [isRequestSent, setIsRequestSent] = useState(false);

  const onSendRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${API_BASE_URL}/partner/request`,
        {
          receiverId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success("Request send successfully.");
        setIsRequestSent(true);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        "An unexpected error occurred";

      console.error("Error sending request: ", errorMessage);
      toast.error(`Error sending partner request: ${errorMessage}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center space-x-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-neutral-700"
    >
      <div className="relative">
        <img
          src={partner.profilePicture}
          alt={partner.username}
          className="h-24 w-24 rounded-full border-4 border-neutral-800 object-cover"
        />
        <div className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-600">
          <Activity className="h-3 w-3 text-white" />
        </div>
      </div>

      <div className="flex-grow space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center space-x-2 text-2xl font-bold text-neutral-100">
              <span>{partner.username}</span>
              <span className="flex items-center text-yellow-500">
                <Star className="ml-2 h-4 w-4" />
                <span className="ml-1 text-sm">{partner.rating}</span>
              </span>
            </h3>
            <p className="text-sm text-neutral-500">{partner.bio}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-neutral-600" />
            <span className="text-neutral-300">
              {partner.questionContributions} Questions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-neutral-600" />
            <span className="text-neutral-300">
              {partner.questionsSolved} Solved
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {partner.socialLinks?.github && (
              <a
                href={partner.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 transition-colors hover:text-neutral-300"
              >
                <GitHub className="h-6 w-6" />
              </a>
            )}
            {partner.socialLinks?.leetcode && (
              <a
                href={partner.socialLinks.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 transition-colors hover:text-neutral-300"
              >
                <Code className="h-6 w-6" />
              </a>
            )}
          </div>

          <button
            onClick={() => onSendRequest(partner._id)}
            className="flex items-center space-x-2 rounded-lg bg-neutral-800 px-6 py-2 text-neutral-300 hover:bg-neutral-700"
          >
            <Send className="h-4 w-4" />
            <span>Send Request</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FindPartner = () => {
  const [partners, setPartners] = useState(null);

  useEffect(() => {
    const fetchPartnerList = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${API_BASE_URL}/user/potential-partners`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPartners(response?.data?.data?.potentialPartners);
      } catch (error) {
        console.error("Unable to fetch partner list: " + error);
      }
    };

    fetchPartnerList();
  }, []);

  return (
    <>
      <Particles
        className="fixed inset-0 h-screen w-screen"
        quantity={150}
        ease={80}
        color={"#ffffff"}
        refresh
      />
      <div className="min-h-screen bg-black text-gray-200">
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

        <Navbar />

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          {/* Page Header */}
          <div className="pt-12 text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="text-6xl font-black leading-tight text-neutral-200"
            >
              Code Partners
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl text-xl text-gray-400"
            >
              Connect with skilled developers, collaborate on challenges, and
              grow together
            </motion.p>
          </div>

          {/* Partners List */}
          <div className="mt-16 space-y-6">
            {partners === null ? (
              <div className="text-center text-gray-500">
                Loading partners...
              </div>
            ) : (
              partners.map((partner, index) => (
                <PartnerCard key={index} partner={partner} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FindPartner;
