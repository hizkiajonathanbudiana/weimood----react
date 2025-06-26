import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../features/chat/chatSlice";

const availableMoods = [
  "happy",
  "sad",
  "overwhelmed",
  "fear",
  "calm",
  "bored",
  "excited",
  "lonely",
];

export default function ChatUI() {
  const dispatch = useDispatch();
  const { status: requestStatus } = useSelector((s) => s.chat);

  const [phase, setPhase] = useState("input");
  const [inputText, setInputText] = useState("");
  const [lastReply, setLastReply] = useState("");

  const currentMood = localStorage.getItem("currentMood") || availableMoods[0];

  const handleSend = () => {
    if (!inputText.trim()) return;
    setPhase("loading");
    dispatch(sendChatMessage({ mood: currentMood, message: inputText }))
      .then((action) => {
        const reply =
          action.payload?.text ||
          "Sorry, I encountered an error. Please try again.";
        setLastReply(reply);
        setPhase("response");
      })
      .catch(() => {
        setLastReply("Failed to get a response from the server.");
        setPhase("response");
      })
      .finally(() => setInputText(""));
  };

  const handleAnother = () => {
    setPhase("input");
    setLastReply("");
  };

  const isGenerating = requestStatus === "generating";

  return (
    <div className="flex flex-col justify-center gap-4 p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg min-h-[250px]">
      {phase === "input" && (
        <div className="w-full flex flex-col items-center gap-4">
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Tell me anything... (Your current mood is ${currentMood})`}
            className="w-full p-3 bg-white/80 border-2 border-transparent rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isGenerating}
            className="px-8 py-2 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:bg-gray-500 transition-colors"
          >
            {isGenerating ? "Thinking..." : "Send Message"}
          </button>
        </div>
      )}

      {phase === "loading" && (
        <div className="text-center text-gray-600 font-semibold animate-pulse">
          Writing a response for you...
        </div>
      )}

      {phase === "response" && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full p-4 bg-gray-100/50 rounded-lg text-gray-800">
            <p className="text-left">{lastReply}</p>
          </div>
          <button
            onClick={handleAnother}
            className="px-6 py-2 font-semibold text-gray-800 bg-white/80 rounded-lg hover:bg-white transition-colors shadow-sm"
          >
            Ask Something Else
          </button>
        </div>
      )}
    </div>
  );
}
