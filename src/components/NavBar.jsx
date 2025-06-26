import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, deleteProfile } from "../features/profile/profileSlice";
import { logoutUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router";
import Toastify from "toastify-js";

function ProfileModal({ profile, onClose, onEdit, onDelete }) {
  if (!profile) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {profile.displayName || "Profile"}
          </h2>
        </div>

        <div className="px-6 pb-4 max-h-[50vh] overflow-y-auto space-y-2">
          {Object.entries(profile)
            .filter(
              ([key]) =>
                ![
                  "id",
                  "UserId",
                  "createdAt",
                  "updatedAt",
                  "password",
                ].includes(key)
            )
            .map(
              ([key, val]) =>
                val && (
                  <div
                    key={key}
                    className="text-sm border-b border-gray-200/80 pb-1"
                  >
                    <strong className="capitalize text-gray-500">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </strong>
                    <span className="ml-2 text-gray-800">{String(val)}</span>
                  </div>
                )
            )}
        </div>

        <div className="p-4 mt-auto border-t border-gray-200/80 bg-white/30 rounded-b-2xl space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="w-full text-center py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="w-full text-center py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full text-center py-2 font-semibold text-gray-700 bg-gray-200/80 rounded-lg hover:bg-gray-300/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.profile);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  const handleShowProfile = () => {
    if (profile) {
      setModalOpen(true);
    } else {
      Toastify({
        text: "No profile data found. Please create one.",
        duration: 3000,
        style: { background: "linear-gradient(to right, #ffcc00, #ff5f5f)" },
      }).showToast();
    }
  };

  const handleEdit = () => {
    navigate("/profile");
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      dispatch(deleteProfile())
        .unwrap()
        .then(() => {
          Toastify({
            text: "Profile deleted successfully",
            duration: 3000,
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
          setModalOpen(false);
        })
        .catch((error) => {
          Toastify({
            text: `Failed to delete profile: ${error.message || "Error"}`,
            duration: 3000,
            style: {
              background: "linear-gradient(to right, #ff5f5f, #ffcc00)",
            },
          }).showToast();
        });
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .finally(() => navigate("/"));
  };

  const NavButton = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-white/50 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <>
      <header className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-md flex items-center justify-between px-4 py-2">
        <Link to="/dashboard" className="text-2xl font-bold text-gray-800">
          Wei<span className="text-purple-600">Mood</span>
        </Link>
        <div className="flex items-center gap-2">
          <NavButton onClick={() => navigate("/dashboard")}>Home</NavButton>
          <NavButton onClick={handleShowProfile}>Profile</NavButton>
          <NavButton onClick={handleLogout}>Logout</NavButton>
        </div>
      </header>

      {isModalOpen && (
        <ProfileModal
          profile={profile}
          onClose={() => setModalOpen(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
