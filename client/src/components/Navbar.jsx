/* eslint-disable react/prop-types */
/* eslint-disable no-unsafe-optional-chaining */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  UserCheck,
  UserX,
  Star,
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

const EndPartnershipModal = ({ isOpen, onOpenChange, setPartnerData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEndPartnerShip = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`${API_BASE_URL}/partner/end`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Accountability partner removed successfully.");
        onOpenChange(false);
        setPartnerData(null);
      }
    } catch (error) {
      console.error("Unable to end partnership: ", error);
      toast.error("Failed to end partnership. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-black/90 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-500">
            End Accountability Partnership
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you absolutely sure you want to end your accountability
            partnership? This action cannot be undone and will permanently
            remove your current partner.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleEndPartnerShip}
            disabled={isLoading}
          >
            {isLoading ? "Ending..." : "End Partnership"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Navbar = ({ isQuestionDetail = false }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [partnerRequests, setPartnerRequests] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEndPartnershipModalOpen, setIsEndPartnershipModalOpen] =
    useState(false);

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

        const { email, username, profilePicture, rating, user_id } =
          response?.data?.data?.user;
        setUserData({ email, username, profilePicture, rating, user_id });
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

    const getPartnerData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${API_BASE_URL}/user/partner`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPartnerData(response?.data?.data?.partner);
      } catch (error) {
        console.error("Error fetching partner data: " + error);
      }
    };

    if (localStorage.getItem("accessToken")) {
      getUserData();
      getPartnerRequests();
      getPartnerData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserData(null);
    window.location.reload();
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

        setPartnerData(response?.data?.data?.partner);
        setPartnerRequests(updatePartnerRequest);
        toast.success(`${status} request successfully.`);
      }
    } catch (error) {
      console.error(
        "Error changing request status: " + error.response?.data?.message ||
          error.response?.statusText,
      );
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
      <nav
        className={`sticky ${isQuestionDetail ? "just flex items-center justify-center" : ""} top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md`}
      >
        <div
          className={`${isQuestionDetail ? "w-full" : "container mx-auto"} grid grid-cols-12 items-center px-4 py-3`}
        >
          <div className="col-span-3 flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <MessageCircleCode className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-100">
                Code Arena
              </span>
            </Link>
          </div>

          <div className="col-span-6 flex items-center justify-center space-x-6">
            {[
              { icon: Home, label: "Home", path: "/" },
              { icon: MessageCircleCode, label: "Problems", path: "/problems" },
              { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
              { icon: MessageCircle, label: "Discuss", path: "/discuss" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="group relative flex items-center space-x-2 text-gray-400 transition-colors duration-300 hover:text-gray-200"
              >
                <item.icon className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100" />
                <span className="text-sm font-medium">{item.label}</span>
                <span className="absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 bg-blue-500 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </div>

          <div className="col-span-3 flex items-center justify-end space-x-4">
            {partnerData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="group flex cursor-pointer items-center space-x-3 rounded-lg p-2 hover:bg-zinc-900">
                    <div className="relative">
                      <UserCheck className="h-6 w-6 text-green-500 transition-transform group-hover:scale-110" />
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-400 transition-colors group-hover:text-green-500">
                        Partner Active
                      </span>
                      <span className="text-xs text-gray-400">
                        {partnerData.username}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 space-y-2 border border-neutral-800 bg-black p-2 shadow-xl"
                >
                  <div className="flex items-center space-x-4 rounded-lg bg-[#0a0a0a] p-3">
                    <Avatar className="h-12 w-12 border border-black">
                      <AvatarImage
                        src={partnerData.profilePicture}
                        alt={partnerData.username}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-[#1a1a1a] text-neutral-300">
                        {partnerData.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-semibold text-neutral-200">
                          {partnerData.username}
                        </h3>
                        <span className="text-sm font-medium text-neutral-600">
                          Rating: {partnerData.rating}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-700">
                        {partnerData.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-[#0a0a0a] p-3">
                    {[
                      {
                        icon: Trophy,
                        label: "Solved",
                        value: partnerData.questionsSolved?.length || 0,
                      },
                      {
                        icon: MessageCircleCode,
                        label: "Contrib",
                        value:
                          (partnerData.questionContributions?.length || 0) +
                          (partnerData.answerContributions?.length || 0),
                      },
                      {
                        icon: Star,
                        label: "Achieve",
                        value: partnerData.achievements?.length || 0,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col items-center rounded-md bg-black p-2"
                      >
                        <stat.icon className="mb-1 h-5 w-5 text-neutral-600" />
                        <span className="text-sm font-semibold text-neutral-200">
                          {stat.value}
                        </span>
                        <span className="text-xs text-neutral-700">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <DropdownMenuSeparator className="bg-[#1a1a1a]" />

                  <div className="grid grid-cols-3 gap-2">
                    <DropdownMenuItem
                      asChild
                      className="group relative col-span-1 flex cursor-pointer justify-center rounded-lg"
                    >
                      <Link to={`/profile/${partnerData?.user_id}`}>
                        <div className="flex flex-col items-center p-1">
                          <User className="mb-1 h-6 w-6 text-neutral-600 transition-transform group-hover:scale-110" />
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 transform">
                          <span className="invisible -translate-y-2 whitespace-nowrap rounded bg-[#0a0a0a] px-2 py-1 text-xs text-neutral-200 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                            View Profile
                          </span>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="group relative col-span-1 flex cursor-pointer justify-center rounded-lg">
                      <div className="flex flex-col items-center p-1">
                        <MessageCircle className="mb-1 h-6 w-6 text-neutral-600 transition-transform group-hover:scale-110" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 transform">
                        <span className="invisible -translate-y-2 whitespace-nowrap rounded bg-[#0a0a0a] px-2 py-1 text-xs text-neutral-200 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                          Start Challenge
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="group relative col-span-1 flex cursor-pointer justify-center rounded-lg"
                      onClick={() => setIsEndPartnershipModalOpen(true)}
                    >
                      <div className="flex flex-col items-center p-1 text-neutral-600 hover:text-neutral-200">
                        <UserX className="mb-1 h-6 w-6 transition-transform group-hover:scale-110" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 transform">
                        <span className="invisible -translate-y-2 whitespace-nowrap rounded bg-[#0a0a0a] px-2 py-1 text-xs text-neutral-200 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                          End Partnership
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/find-partner"
                className="group flex items-center space-x-2 rounded-lg p-2 text-blue-400 transition-all hover:bg-zinc-900 hover:text-blue-500"
              >
                <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-sm font-medium">Find Partner</span>
              </Link>
            )}

            {partnerRequests && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Bell className="h-5 w-5 text-gray-400 transition-colors hover:text-gray-200" />
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
                        key={request.user_id}
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
                            <div
                              onClick={() =>
                                navigate(`/profile/${request?.user_id}`)
                              }
                              className="cursor-pointer text-sm font-medium transition-colors duration-300 hover:text-indigo-500"
                            >
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
                <div className="h-10 w-24 rounded bg-zinc-800"></div>
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
                      <span className="text-sm font-medium text-gray-100">
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
                    <Link
                      to={`/profile/${userData?.user_id}`}
                      className="cursor-pointer"
                    >
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
                  className="text-gray-400 transition-all hover:bg-zinc-900 hover:text-gray-200"
                  asChild
                >
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button
                  className="hover:bg-blue-850 bg-blue-900 text-blue-300 transition-colors"
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

      <EndPartnershipModal
        isOpen={isEndPartnershipModalOpen}
        onOpenChange={setIsEndPartnershipModalOpen}
        setPartnerData={setPartnerData}
      />
    </>
  );
};

export default Navbar;
