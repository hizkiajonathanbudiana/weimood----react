import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomQuote } from "../features/chat/chatSlice";

export default function QuotePanel() {
  const dispatch = useDispatch();
  const { quote, quoteStatus } = useSelector((s) => s.chat);

  useEffect(() => {
    dispatch(fetchRandomQuote());
  }, [dispatch]);

  return (
    <div className="relative flex flex-col justify-center text-center p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg h-full">
      <button
        onClick={() => dispatch(fetchRandomQuote())}
        className="absolute top-3 right-3 p-1.5 text-gray-500 rounded-full hover:bg-white/50 hover:text-gray-800 transition-colors"
        aria-label="Get a new quote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h5M20 20v-5h-5M4 4l16 16"
          />
        </svg>
      </button>

      {quoteStatus === "loading" ? (
        <div className="text-gray-500">Loading quote…</div>
      ) : (
        <div>
          <blockquote className="font-semibold text-gray-800">
            "{quote?.content}"
          </blockquote>
          <cite className="block mt-2 text-sm text-gray-600">
            — {quote?.author || "Unknown"}
          </cite>
        </div>
      )}
    </div>
  );
}
