/* eslint-disable react/prop-types */
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "Invalid Date";

  const formatedDate = new Date(date);
  if (isNaN(formatedDate)) return "Invalid Date";

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  return formatedDate.toLocaleDateString("en-US", options);
};

const DiscussionCard = ({ disc }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replies, setReplies] = useState(disc?.replies || []);

  const handleAddReply = () => {
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now(),
      user: disc.user,
      comment: newReply,
      createdAt: new Date(),
      reactions: { likes: [], dislikes: [] },
    };

    setReplies([...replies, reply]);
    setNewReply("");
  };

  return (
    <div className="space-y-3 border-b border-zinc-800 py-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={disc?.user?.profilePicture}
            className="h-8 w-8 rounded-full"
          />
          <div>
            <p className="font-medium">{disc?.user?.username}</p>
            <Badge className="text-xs">{disc?.user?.rating}</Badge>
          </div>
        </div>
        <span className="text-xs text-zinc-400">
          {formatDate(disc?.createdAt)}
        </span>
      </div>

      <p className="text-sm leading-relaxed">{disc?.comment}</p>

      <div className="flex items-center justify-between">
        <div className="flex space-x-6">
          <button className="flex items-center space-x-2 text-xs hover:text-blue-400">
            <span>{disc?.reactions?.likes?.length}</span>
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button className="flex items-center space-x-2 text-xs hover:text-blue-400">
            <span>{disc?.reactions?.dislikes?.length}</span>
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center space-x-2 text-xs hover:text-blue-400"
        >
          <span>replies</span>
          <MessageCircle className="h-3.5 w-3.5" />
        </button>
      </div>

      {showReplies && (
        <div className="space-y-2 pl-8">
          {disc?.replies?.map((reply) => (
            <div key={reply.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <img
                  src={reply.user?.profilePicture}
                  className="h-6 w-6 rounded-full"
                />
                <span className="text-sm font-medium">
                  {reply.user?.username}
                </span>
                <span className="text-xs text-zinc-400">
                  {formatDate(reply.createdAt)}
                </span>
              </div>
              <p className="text-sm">{reply.comment}</p>
            </div>
          ))}

          <input
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-4/5 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1 placeholder:text-sm placeholder:text-zinc-600"
            onKeyDown={(e) => e.key === "Enter" && handleAddReply()}
          />
        </div>
      )}
    </div>
  );
};

export default DiscussionCard;
