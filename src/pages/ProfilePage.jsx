import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Toastify from "toastify-js";

import {
  fetchProfile,
  createProfile,
  updateProfile,
  resetProfileState,
} from "../features/profile/profileSlice";

// --- OPTIONS & CONSTANTS ---
const activityLevels = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
];
const relationshipStatuses = [
  "Single",
  "In a relationship",
  "Married",
  "Complicated",
  "Prefer not to say",
];
const personalityTypes = [
  "Introvert",
  "Extrovert",
  "Ambivert",
  "Optimist",
  "Pessimist",
  "Realist",
  "Prefer not to say",
];

// --- STYLES & ICONS ---
const AuraStyles = () => (
  <style>{`
      @keyframes move-aura-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10vw, -15vh) scale(1.3); } }
      @keyframes move-aura-2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-15vw, 10vh) scale(1.2); } }
      .animate-aura-1 { animation: move-aura-1 22s infinite ease-in-out; }
      .animate-aura-2 { animation: move-aura-2 28s infinite ease-in-out; }
    `}</style>
);

// --- NOTIFICATION SERVICE ---
const showToast = (message, type = "info") => {
  const backgrounds = {
    success: "linear-gradient(135deg, #dcfce7, #ccfbf1)",
    error: "linear-gradient(135deg, #fee2e2, #ffedd5)",
    info: "linear-gradient(135deg, #f3e8ff, #fecaca)",
  };
  const borders = {
    success: "rgb(74 222 128)",
    error: "rgb(248 113 113)",
    info: "rgb(192 132 252)",
  };
  Toastify({
    text: message,
    duration: 4000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: backgrounds[type] || backgrounds.info,
      color: "#374151",
      fontFamily: "sans-serif",
      fontSize: "15px",
      fontWeight: "600",
      padding: "14px 24px",
      borderRadius: "1rem",
      border: `1px solid ${borders[type] || borders.info}`,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
  }).showToast();
};

// --- REUSABLE FORM COMPONENTS ---
const InputField = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-white/50 border-2 border-transparent rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 transition-all duration-300"
    />
  </div>
);

const SelectField = ({ name, label, value, onChange, children }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 bg-white/50 border-2 border-transparent rounded-lg text-gray-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-200 transition-all duration-300 appearance-none"
    >
      {children}
    </select>
  </div>
);

// --- SKELETON LOADER ---
const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-gray-300/50 rounded-md w-3/4 mx-auto"></div>
    <div className="space-y-4 border-t border-gray-200/50 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-14 bg-gray-300/50 rounded-lg"></div>
        <div className="h-14 bg-gray-300/50 rounded-lg"></div>
      </div>
      <div className="h-14 bg-gray-300/50 rounded-lg"></div>
    </div>
    <div className="space-y-4 border-t border-gray-200/50 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-14 bg-gray-300/50 rounded-lg"></div>
        <div className="h-14 bg-gray-300/50 rounded-lg"></div>
      </div>
    </div>
    <div className="h-12 bg-gray-400/50 rounded-lg w-full mt-6"></div>
  </div>
);

// --- MAIN PROFILE PAGE COMPONENT ---
function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, status, error } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({
    displayName: "",
    age: "",
    country: "",
    city: "",
    hobbies: "",
    interests: "",
    favMusic: "",
    favGenreMusic: "",
    activityLevel: activityLevels[0],
    status: relationshipStatuses[0],
    field: "",
    personality: personalityTypes[0], // Added personality
  });

  useEffect(() => {
    dispatch(fetchProfile());
    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || "",
        age: profile.age || "",
        country: profile.country || "",
        city: profile.city || "",
        hobbies: profile.hobbies || "",
        interests: profile.interests || "",
        favMusic: profile.favMusic || "",
        favGenreMusic: profile.favGenreMusic || "",
        activityLevel: profile.activityLevel || activityLevels[0],
        status: profile.status || relationshipStatuses[0],
        field: profile.field || "",
        personality: profile.personality || personalityTypes[0], // Added personality
      });
    }
  }, [profile]);

  useEffect(() => {
    if (status === "failed" && error) {
      showToast(error, "error");
    }
  }, [status, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionToDispatch = profile
      ? updateProfile(formData)
      : createProfile(formData);
    const resultAction = await dispatch(actionToDispatch);

    if (
      updateProfile.fulfilled.match(resultAction) ||
      createProfile.fulfilled.match(resultAction)
    ) {
      showToast("Profile saved successfully!", "success");
      navigate("/dashboard");
    }
  };

  const isLoading = status === "loading";

  return (
    <>
      <AuraStyles />
      <main className="relative min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 py-10 overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-purple-200 rounded-full filter blur-3xl opacity-50 animate-aura-1"></div>
          <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-rose-200 rounded-full filter blur-3xl opacity-50 animate-aura-2"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg">
            {isLoading && !profile ? (
              <ProfileSkeleton />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {profile ? "Edit Your Profile" : "Create Your Profile"}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    This helps us personalize your experience.
                  </p>
                </div>

                {/* --- Section: About You --- */}
                <fieldset className="space-y-4 border-t border-gray-200/60 pt-6">
                  <legend className="text-lg font-semibold text-gray-800 -translate-y-6 bg-white/0 px-2">
                    About You
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      name="displayName"
                      label="Display Name"
                      value={formData.displayName}
                      onChange={handleChange}
                    />
                    <InputField
                      name="age"
                      label="Age"
                      value={formData.age}
                      onChange={handleChange}
                      type="number"
                    />
                    <InputField
                      name="country"
                      label="Country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                    <InputField
                      name="city"
                      label="City"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>

                {/* --- Section: Your Vibe --- */}
                <fieldset className="space-y-4 border-t border-gray-200/60 pt-6">
                  <legend className="text-lg font-semibold text-gray-800 -translate-y-6 bg-white/0 px-2">
                    Your Vibe
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      name="hobbies"
                      label="Hobbies"
                      value={formData.hobbies}
                      onChange={handleChange}
                      placeholder="e.g., Reading, Hiking"
                    />
                    <InputField
                      name="interests"
                      label="Interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="e.g., Tech, Wellness"
                    />
                    <InputField
                      name="favMusic"
                      label="Favorite Artist/Band"
                      value={formData.favMusic}
                      onChange={handleChange}
                    />
                    <InputField
                      name="favGenreMusic"
                      label="Favorite Music Genre"
                      value={formData.favGenreMusic}
                      onChange={handleChange}
                    />
                    {/* --- New Personality Field --- */}
                    <SelectField
                      name="personality"
                      label="Personality"
                      value={formData.personality}
                      onChange={handleChange}
                    >
                      {personalityTypes.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                </fieldset>

                {/* --- Section: Lifestyle --- */}
                <fieldset className="space-y-4 border-t border-gray-200/60 pt-6">
                  <legend className="text-lg font-semibold text-gray-800 -translate-y-6 bg-white/0 px-2">
                    Lifestyle
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      name="activityLevel"
                      label="Activity Level"
                      value={formData.activityLevel}
                      onChange={handleChange}
                    >
                      {activityLevels.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </SelectField>
                    <SelectField
                      name="status"
                      label="Relationship Status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {relationshipStatuses.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <InputField
                    name="field"
                    label="Field of Work/Study"
                    value={formData.field}
                    onChange={handleChange}
                  />
                </fieldset>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 font-semibold text-white bg-gray-800 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transform active:scale-[0.98] transition-all duration-200 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Saving..."
                    : profile
                    ? "Update Profile"
                    : "Create Profile"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default ProfilePage;
