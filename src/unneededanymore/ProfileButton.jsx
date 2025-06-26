import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, deleteProfile } from "../features/profile/profileSlice"; // Impor action delete
import { useNavigate } from "react-router";
// Komponen Modal untuk menampilkan detail profil
function ProfileModal({ profile, onClose, onEdit, onDelete }) {
  if (!profile) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "8px",
          display: "grid",
          gap: "0.75rem",
          width: "320px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Profile</h2>
        {Object.entries(profile).map(([key, val]) => (
          <div key={key}>
            <strong>{key}:</strong> {String(val)}
          </div>
        ))}

        {/* Tombol Aksi (Edit & Delete) */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button onClick={onEdit} style={{ flex: 1, padding: "8px" }}>
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              flex: 1,
              padding: "8px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "white",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>

        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          style={{ marginTop: "0.5rem", padding: "8px" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Komponen Utama yang merender tombol dan mengelola state modal
export default function ProfileButton() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const [isModalOpen, setModalOpen] = useState(false);

  // Ambil data profil saat komponen pertama kali dimuat
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Handler untuk membuka modal
  const handleShowProfile = () => {
    // Jika profil tidak ada, jangan buka modal.
    // Atau bisa juga diganti dengan membuka form 'Create Profile'
    if (profile) {
      setModalOpen(true);
    } else {
      alert("No profile data found. Please create a profile first.");
    }
  };

  // Handler untuk tombol edit (placeholder)
  const handleEdit = () => {
    navigate("/profile");
    // Contoh: tutup modal ini dan buka modal/halaman form edit
    setModalOpen(false);
  };

  // Handler untuk tombol delete
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      dispatch(deleteProfile())
        .unwrap() // .unwrap() akan melempar error jika action rejected
        .then(() => {
          console.log("Profile deleted successfully");
          setModalOpen(false); // Tutup modal setelah berhasil
        })
        .catch((error) => {
          console.error("Failed to delete profile:", error);
          alert("Failed to delete profile. Please try again.");
        });
    }
  };
  return (
    <>
      <div style={{ gridArea: "profile" }}>
        <button onClick={handleShowProfile}>Show Profile</button>
      </div>
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
