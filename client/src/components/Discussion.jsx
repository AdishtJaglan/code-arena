/* eslint-disable react/prop-types */
import { useState } from "react";
import { MessageCircle, ThumbsUp, ThumbsDown, Send, Edit2 } from "lucide-react";

const Discussion = ({ disc }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    // Handler implementation
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/60">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-800/20 to-zinc-900/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="space-y-4">
        <p className="text-lg font-medium leading-relaxed text-zinc-200">
          {disc.comment}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <img
                src={disc?.user?.profilePicture}
                alt=""
                className="rounded-full border-2 border-zinc-700/50 object-cover"
              />
              <div className="absolute -right-1 -top-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-300">
                  {disc?.user?.rating}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-zinc-300">
                {disc?.user?.username}
              </span>
              {disc.isEdited && (
                <span className="flex items-center text-xs text-zinc-500">
                  <Edit2 size={12} className="mr-1" /> Edited
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <MessageCircle size={16} />
              <span className="text-sm">Reply</span>
            </button>

            <div className="flex items-center gap-3">
              <button className="group/btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-zinc-400 transition-all hover:bg-zinc-800">
                <ThumbsUp
                  size={16}
                  className="transition-colors group-hover/btn:text-blue-400"
                />
                <span className="text-sm transition-colors group-hover/btn:text-blue-400">
                  {disc?.reactions?.likes?.length}
                </span>
              </button>

              <button className="group/btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-zinc-400 transition-all hover:bg-zinc-800">
                <ThumbsDown
                  size={16}
                  className="transition-colors group-hover/btn:text-red-400"
                />
                <span className="text-sm transition-colors group-hover/btn:text-red-400">
                  {disc?.reactions?.dislikes?.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {showReplyInput && (
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-zinc-200 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-600 focus:bg-zinc-800"
            />
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
              className="rounded-lg bg-zinc-800 p-2.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200 disabled:opacity-50 disabled:hover:bg-zinc-800 disabled:hover:text-zinc-400"
            >
              <Send size={16} />
            </button>
          </div>
        )}

        {disc.replies?.length > 0 && (
          <div className="mt-6 space-y-4 border-l-2 border-zinc-800 pl-6">
            {disc.replies.map((reply, index) => (
              <div
                key={index}
                className="rounded-lg bg-zinc-900/30 p-4 text-sm text-zinc-400"
              >
                {reply}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;
