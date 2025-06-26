import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logMood } from "../features/mood/moodSlice";

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

export default function MoodPanel() {
  const dispatch = useDispatch();
  const [currentMood, setCurrentMood] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currentMood");
    if (saved) {
      setCurrentMood(saved);
    } else {
      setEditing(true);
    }
  }, []);

  const handleSave = () => {
    if (!currentMood) return;
    dispatch(logMood(currentMood));
    localStorage.setItem("currentMood", currentMood); // No need to remove first
    setEditing(false);
  };

  return (
    // Container utama dengan styling frosted glass
    <div className="flex flex-col justify-center text-center p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg min-h-[150px]">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        {editing ? "What's Your Mood?" : "Current Mood"}
      </h3>

      {/* Tampilan ketika tidak sedang mengedit */}
      {!editing ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-purple-700 capitalize">
            {currentMood || "Not Set"}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-1 text-sm bg-white/70 rounded-md hover:bg-white transition-colors shadow-sm"
          >
            Change
          </button>
        </div>
      ) : (
        // Tampilan ketika sedang mengedit
        <div className="w-full flex flex-col items-center gap-3">
          <div className="relative w-full">
            <select
              value={currentMood}
              onChange={(e) => setCurrentMood(e.target.value)}
              className="w-full appearance-none p-2.5 bg-white/80 border-2 border-transparent rounded-lg focus:outline-none focus:border-purple-400 capitalize"
            >
              <option value="" disabled>
                Select a mood...
              </option>
              {availableMoods.map((m) => (
                <option key={m} value={m} className="capitalize">
                  {m}
                </option>
              ))}
            </select>
            {/* Icon panah ke bawah untuk select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!currentMood}
            className="w-full py-2 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:bg-gray-500 transition-colors"
          >
            Save Mood
          </button>
        </div>
      )}
    </div>
  );
}
