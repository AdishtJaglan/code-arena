import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../configs/env-config";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        password: formData?.password,
        username: formData?.username,
      });

      if (response.status === 200) {
        toast.success("Logged in successfully.");
        localStorage.setItem("accessToken", response?.data?.data?.accessToken);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:" + error);
      toast.error("Error logging in.");
    }
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
          className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-lg"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-500">Welcome Back</h1>
            <p className="mt-2 text-gray-500">
              Login to continue your coding journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="text-gray-600" size={20} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
                className="w-full rounded-lg border border-zinc-800/50 bg-black/40 py-3 pl-10 pr-4 text-gray-200 placeholder-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="text-gray-600" size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full rounded-lg border border-zinc-800/50 bg-black/40 py-3 pl-10 pr-12 text-gray-200 placeholder-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="hover:bg-blue-850 w-full transform rounded-lg bg-blue-900 py-3 text-blue-300 transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-700 active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-blue-500 transition-colors hover:text-blue-400 hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
