/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import {
  AccountCircle,
  Lock,
  Email,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Input from "../Input";

const StepDetails = ({
  formData,
  handleInputChange,
  showPassword,
  setShowPassword,
}) => {
  return (
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
  );
};

export default StepDetails;
