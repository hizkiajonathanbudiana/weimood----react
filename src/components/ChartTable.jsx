import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMoods } from "../features/mood/moodSlice";

export default function ChartTable() {
  const dispatch = useDispatch();
  const { moodHistory, status } = useSelector((state) => state.mood);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllMoods());
    }
  }, [status, dispatch]);

  const moodsObj = moodHistory.length > 0 ? moodHistory[0].moods : {};

  const moodKeys = [
    "happy",
    "sad",
    "overwhelmed",
    "fear",
    "calm",
    "bored",
    "excited",
    "lonely",
  ];

  return (
    <div className="h-full bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-4 sm:p-6 flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 text-center flex-shrink-0 mb-4">
        Mood Summary
      </h2>
      <div className="flex-grow overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="bg-white/40">
              {moodKeys.map((key) => (
                <th
                  key={key}
                  className="p-3 text-sm font-semibold text-gray-700 capitalize"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {status === "loading" ? (
                <td
                  colSpan={moodKeys.length}
                  className="text-center p-4 text-gray-500"
                >
                  Loading Summary...
                </td>
              ) : (
                moodKeys.map((key) => (
                  <td
                    key={key}
                    className="text-center p-3 border-t border-gray-200/50"
                  >
                    <span className="font-mono font-bold text-2xl text-purple-700">
                      {moodsObj[key] ?? 0}
                    </span>
                  </td>
                ))
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
