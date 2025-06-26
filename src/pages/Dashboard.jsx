import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Toastify from "toastify-js";

// Actions
import { fetchChatHistory, fetchRandomQuote } from "../features/chat/chatSlice";
import { fetchProfile, deleteProfile } from "../features/profile/profileSlice";
import { fetchAllMoods } from "../features/mood/moodSlice";

// Components
import NavBar from "../components/NavBar";
import ChatListPanel from "../components/ChatListPanel";
import QuotePanel from "../components/QuotePanel";
import MoodPanel from "../components/MoodPanel";
import ChartTable from "../components/ChartTable";
import ChatUI from "../components/ChatUI";
import ProfileModal from "../components/ProfileModal";

const AuraStyles = () => (
  <style>{`
      @keyframes move-aura-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10vw, -15vh) scale(1.3); } }
      @keyframes move-aura-2 { 0%, 100% { transform: translate(-15vw, 10vh) scale(1.2); } }
      .animate-aura-1 { animation: move-aura-1 22s infinite ease-in-out; }
      .animate-aura-2 { animation: move-aura-2 28s infinite ease-in-out; }
    `}</style>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.profile);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchChatHistory());
    dispatch(fetchRandomQuote());
    dispatch(fetchProfile());
    dispatch(fetchAllMoods());
  }, [dispatch]);

  const handleEdit = () => {
    navigate("/profile");
    setProfileModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      dispatch(deleteProfile())
        .unwrap()
        .then(() => {
          Toastify({
            text: "Profile deleted successfully.",
            style: { background: "#10B981" },
          }).showToast();
          setProfileModalOpen(false);
        })
        .catch((error) => {
          Toastify({
            text: `Failed to delete profile: ${error.message || "Error"}`,
            style: { background: "#EF4444" },
          }).showToast();
        });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans text-gray-800">
      <AuraStyles />
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-purple-200 rounded-full filter blur-3xl opacity-40 animate-aura-1"></div>
        <div className="absolute bottom-[-5%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-rose-200 rounded-full filter blur-3xl opacity-50 animate-aura-2"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6">
        <NavBar
          onProfileClick={() =>
            profile
              ? setProfileModalOpen(true)
              : Toastify({
                  text: "No profile found. Create one first!",
                  style: { background: "orange" },
                }).showToast()
          }
        />

        {/* --- LAYOUT GRID FINAL - LEBIH LEGA --- */}
        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM KIRI (1/3 LEBAR) UNTUK WIDGET-WIDGET */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <QuotePanel />
            <MoodPanel />
            <ChartTable />
          </div>

          {/* KOLOM KANAN (2/3 LEBAR) UNTUK KONTEN UTAMA */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ChatUI />
            <ChatListPanel />
          </div>
        </main>
      </div>

      {isProfileModalOpen && (
        <ProfileModal
          profile={profile}
          onClose={() => setProfileModalOpen(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
