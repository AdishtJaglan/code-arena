/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import {
  Email,
  Description,
  CloudUpload,
  CheckCircle,
  Error as ErrorIcon,
  InfoOutlined,
} from "@mui/icons-material";
import Input from "../Input";

const StepProfile = ({
  formData,
  handleFileChange,
  verificationStatus,
  handleVerifyPartner,
  partnerInfo,
  setIsPartnerModalOpen,
  handleInputChange,
}) => {
  return (
    <motion.div className="space-y-6">
      <div className="relative rounded-lg border border-dashed border-zinc-800/50 p-6">
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
          <CloudUpload className="h-8 w-8 text-blue-500" />
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
                    : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
              } ${(!formData.accountabilityPartner || verificationStatus.isVerifying) && "cursor-not-allowed opacity-50"}`}
            >
              {verificationStatus.isVerifying ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
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
                className="mt-0.5 flex items-center justify-center rounded-lg bg-black/40 px-3 text-gray-400 hover:bg-zinc-800 hover:text-gray-300"
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

      <div className="relative px-1">
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          className="min-h-[120px] w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Description className="absolute right-3 top-3 text-gray-400" />
      </div>
    </motion.div>
  );
};

export default StepProfile;
