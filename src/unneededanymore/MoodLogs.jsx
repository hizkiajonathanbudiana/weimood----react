import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMoods,
  logMood,
  resetMoodState,
} from "../features/mood/moodSlice";

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
const moodEmojis = {
  happy: "😄",
  sad: "😢",
  overwhelmed: "🤯",
  fear: "😨",
  calm: "😌",
  bored: "😑",
  excited: "🤩",
  lonely: "😔",
};

function MoodTrackerPage() {
  const dispatch = useDispatch();
  const { moodHistory, status, error } = useSelector((state) => state.mood);

  useEffect(() => {
    dispatch(fetchAllMoods());
    return () => {
      dispatch(resetMoodState());
    };
  }, [dispatch]);

  const handleLogMood = (moodName) => {
    dispatch(logMood(moodName));
  };

  if (status === "loading") {
    return <div>Memuat Riwayat Mood...</div>;
  }

  if (status === "failed") {
    return <div className="p-4 text-red-800 bg-red-100">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bagaimana Perasaanmu Hari Ini?
          </h1>
          <p className="text-gray-600 mb-6">
            Catat mood harianmu dengan menekan tombol di bawah.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {availableMoods.map((mood) => (
              <button
                key={mood}
                onClick={() => handleLogMood(mood)}
                className="flex flex-col items-center justify-center p-4 bg-indigo-100 text-indigo-800 rounded-lg shadow-sm hover:bg-indigo-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="text-4xl">{moodEmojis[mood]}</span>
                <span className="mt-2 text-sm font-medium capitalize">
                  {mood}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Riwayat Mood</h2>
          {moodHistory.length > 0 ? (
            moodHistory
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((log) => (
                <div key={log.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-gray-700 mb-2">
                    {new Date(log.createdAt).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {availableMoods.map(
                      (mood) =>
                        log[mood] > 0 && (
                          <div
                            key={mood}
                            className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full"
                          >
                            <span className="text-lg">{moodEmojis[mood]}</span>
                            <span className="text-sm font-medium text-gray-600">
                              {log[mood]}x
                            </span>
                          </div>
                        )
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="bg-white p-6 text-center rounded-lg shadow-sm">
              <p className="text-gray-500">
                Belum ada riwayat mood yang tercatat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoodTrackerPage;
