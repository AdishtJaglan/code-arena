/* eslint-disable no-unsafe-optional-chaining */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageCircleCode,
  Trophy,
  MessageCircle,
  Home,
  LogIn,
  UserPlus,
  User,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { API_BASE_URL } from "@/configs/env-config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [partnerRequests, setPartnerRequests] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { email, username, profilePicture, rating } =
          response?.data?.data?.user;
        setUserData({ email, username, profilePicture, rating });
      } catch (error) {
        console.error("Error fetching user data: " + error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    const getPartnerRequests = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(`${API_BASE_URL}/partner/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPartnerRequests(response?.data?.data?.requests);
      } catch (error) {
        console.error("Error getting partner request: " + error);
      }
    };

    if (localStorage.getItem("accessToken")) {
      getUserData();
      getPartnerRequests();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserData(null);
  };

  const handleRequestStatus = async (senderId, status) => {
    try {
      const token = localStorage.getItem("accessToken");
      const statusBody = {
        senderId,
        status,
      };

      const response = await axios.post(
        `${API_BASE_URL}/partner/status`,
        statusBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const updatePartnerRequest = partnerRequests.filter(
          (req) => req._id !== senderId,
        );

        setPartnerRequests(updatePartnerRequest);
        toast.success(`${status} request successfully.`);
      }
    } catch (error) {
      console.error("Error changing request status: " + error);
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
      <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center space-x-2">
            <MessageCircleCode className="h-8 w-8 text-indigo-500" />
            <span className="text-2xl font-bold text-white">Code Arena</span>
          </Link>

          <div className="flex items-center space-x-6">
            {[
              { icon: Home, label: "Home", path: "/" },
              { icon: MessageCircleCode, label: "Problems", path: "/problems" },
              { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
              { icon: MessageCircle, label: "Discuss", path: "/discuss" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="group relative flex items-center space-x-2 text-gray-400 transition-colors duration-300 hover:text-white"
              >
                <item.icon className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100" />
                <span className="text-sm font-medium">{item.label}</span>
                <span className="absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-indigo-500 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 space-x-4">
            {partnerRequests && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Bell className="h-5 w-5 text-gray-400 transition-colors hover:text-white" />
                    {partnerRequests.length > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {partnerRequests.length}
                      </span>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Accountability Partner Requests</span>
                    <span className="text-xs text-gray-400">
                      {partnerRequests.length} new
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {partnerRequests.length === 0 ? (
                    <div className="py-4 text-center text-gray-500">
                      No new follow requests
                    </div>
                  ) : (
                    partnerRequests.map((request) => (
                      <DropdownMenuItem
                        key={request._id}
                        className="flex items-center justify-between p-2"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={request.profilePicture}
                              alt={request.username}
                            />
                            <AvatarFallback>
                              {request.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="cursor-pointer text-sm font-medium transition-colors duration-300 hover:text-indigo-500">
                              {request.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              Rating: {request.rating}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <CheckCircle
                            className="h-5 w-5 cursor-pointer text-green-500 transition-colors hover:text-green-600"
                            onClick={() =>
                              handleRequestStatus(request._id, "Accepted")
                            }
                          />
                          <XCircle
                            className="h-5 w-5 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                            onClick={() =>
                              handleRequestStatus(request._id, "Rejected")
                            }
                          />
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 w-24 rounded bg-gray-700"></div>
              </div>
            ) : userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={userData.profilePicture || undefined}
                        alt={userData.username}
                      />
                      <AvatarFallback>
                        {userData.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {userData.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        Rating: {userData.rating}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-400 transition-all hover:bg-gray-800 hover:text-white"
                  asChild
                >
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button
                  className="bg-indigo-700 transition-colors hover:bg-indigo-600"
                  asChild
                >
                  <Link to="/register">
                    <UserPlus className="mr-2 h-4 w-4" /> Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
