import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatHistory,
  sendChatMessage,
  saveChat,
  deleteChat,
  logDailyMood,
  fetchRandomQuote,
} from "../features/chat/chatSlice";
import { fetchProfile } from "../features/profile/profileSlice";

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

const QuoteDisplay = () => {
  const dispatch = useDispatch();
  const { quote, quoteStatus } = useSelector((state) => state.chat);

  const handleNewQuote = () => {
    dispatch(fetchRandomQuote());
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow text-center relative">
      {quoteStatus === "loading" ? (
        <p className="text-gray-500 italic">Memuat quote...</p>
      ) : (
        <>
          <blockquote className="text-lg italic text-gray-800">
            "{quote.content}"
          </blockquote>
          <cite className="block text-right mt-2 not-italic text-gray-600">
            - {quote.author}
          </cite>
        </>
      )}
      <button
        onClick={handleNewQuote}
        title="Get new quote"
        className="absolute top-2 right-2 text-xl text-gray-400 hover:text-indigo-600 transition-transform duration-200 ease-in-out active:scale-90"
      >
        &#x21bb;
      </button>
    </div>
  );
};

function ChatPage() {
  const dispatch = useDispatch();
  const { dbHistory, unsavedChats, status, error } = useSelector(
    (state) => state.chat
  );
  const { profile, status: profileStatus } = useSelector(
    (state) => state.profile
  );

  const [chatInput, setChatInput] = useState({
    mood: availableMoods[0],
    message: "",
  });
  const [currentMood, setCurrentMood] = useState(availableMoods[0]);

  useEffect(() => {
    dispatch(fetchChatHistory());
    dispatch(fetchRandomQuote());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleGenerateChat = (e) => {
    e.preventDefault();
    if (!profile) {
      alert("Harap lengkapi profil Anda terlebih dahulu sebelum memulai chat.");
      return;
    }
    if (chatInput.message.trim()) {
      dispatch(sendChatMessage(chatInput));
      setChatInput((prev) => ({ ...prev, message: "" }));
    }
  };

  const handleSaveChat = (id, text) => {
    dispatch(saveChat({ id, text }));
  };

  const handleDeleteChat = (id) => {
    if (window.confirm("Yakin mau hapus chat ini dari riwayat?")) {
      dispatch(deleteChat(id));
    }
  };

  const handleLogMood = () => {
    dispatch(logDailyMood(currentMood));
    alert(`Mood "${currentMood}" berhasil dicatat untuk hari ini!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 bg-white rounded-lg shadow">
          {profileStatus === "loading" && (
            <p className="text-gray-500">Memuat profil...</p>
          )}
          {profile && (
            <h1 className="text-2xl font-bold text-gray-800">
              Halo, {profile.displayName}!
            </h1>
          )}
          {profileStatus === "succeeded" && !profile && (
            <p className="text-gray-600">
              Selamat datang! Sepertinya Anda belum membuat profil.
            </p>
          )}
        </div>

        <QuoteDisplay />

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">Catat Mood Harian</h2>
          <div className="flex items-center gap-4">
            <select
              value={currentMood}
              onChange={(e) => setCurrentMood(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md"
            >
              {availableMoods.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleLogMood}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              Simpan Mood
            </button>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">
            Generate Chat dengan WeiMood AI
          </h2>
          <form onSubmit={handleGenerateChat} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Pilih Mood Kamu:
              </label>
              <select
                value={chatInput.mood}
                onChange={(e) =>
                  setChatInput((prev) => ({ ...prev, mood: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {availableMoods.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Apa yang ingin kamu ceritakan?
              </label>
              <textarea
                value={chatInput.message}
                onChange={(e) =>
                  setChatInput((prev) => ({ ...prev, message: e.target.value }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Ceritakan apa saja..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === "generating"}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {status === "generating"
                ? "AI sedang berpikir..."
                : "Kirim ke AI"}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-3 text-red-700 bg-red-100 rounded-md">
            Error: {error}
          </div>
        )}

        {unsavedChats.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-xl">Sesi Belum Tersimpan</h3>
            {unsavedChats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm"
              >
                <p className="whitespace-pre-wrap">{chat.text}</p>
                <button
                  onClick={() => handleSaveChat(chat.id, chat.text)}
                  disabled={status === "saving"}
                  className="mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 disabled:bg-green-300"
                >
                  {status === "saving" ? "Menyimpan..." : "Simpan ke Riwayat"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-bold text-xl">Riwayat Chat</h3>
          {status === "loading" && <div>Memuat riwayat...</div>}
          {dbHistory.length === 0 && status !== "loading" && (
            <p className="text-gray-500">
              Belum ada riwayat chat yang tersimpan.
            </p>
          )}
          {dbHistory.map((chat) => (
            <div
              key={chat.id}
              className="p-4 bg-white rounded-lg shadow-sm relative"
            >
              <p className="whitespace-pre-wrap">{chat.text}</p>
              <button
                onClick={() => handleDeleteChat(chat.id)}
                disabled={status === "deleting"}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 disabled:bg-red-300"
              >
                X
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Disimpan pada:{" "}
                {new Date(chat.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
