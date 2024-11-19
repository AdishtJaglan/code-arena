/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { GitHub, Code, LinkedIn } from "@mui/icons-material";
import Input from "../Input";

const StepConnections = ({ formData, handleInputChange }) => {
  return (
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
  );
};

export default StepConnections;
