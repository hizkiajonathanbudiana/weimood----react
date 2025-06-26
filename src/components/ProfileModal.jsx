import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CloseIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ProfileDataItem = ({ label, value }) => (
  <div className="text-sm border-b border-gray-200/80 pb-1">
    <strong className="capitalize text-gray-500">
      {label.replace(/([A-Z])/g, " $1")}:
    </strong>
    <span className="ml-2 text-gray-800">{String(value)}</span>
  </div>
);

export default function ProfileModal({ profile, onClose, onEdit, onDelete }) {
  if (!profile) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl m-4 flex flex-col"
        >
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-200/50"
            >
              <CloseIcon />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.displayName || "Profile"}
            </h2>
          </div>

          <div className="px-6 pb-4 max-h-[50vh] overflow-y-auto space-y-2">
            {Object.entries(profile).map(
              ([key, val]) =>
                val && <ProfileDataItem key={key} label={key} value={val} />
            )}
          </div>

          <div className="p-4 mt-auto border-t border-gray-200/80 bg-white/30 rounded-b-2xl space-y-2">
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="w-full text-center py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="w-full text-center py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full text-center py-2 font-semibold text-gray-700 bg-gray-200/80 rounded-lg hover:bg-gray-300/90"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
