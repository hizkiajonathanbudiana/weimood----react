import React from "react";
import { Link } from "react-router";
// --- ICONS ---
// A library of SVG icons for a consistent and clean look.
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

// --- LANDING PAGE COMPONENT ---
// This is the standalone landing page template.
function LandingPage() {
  // A reusable card component for features.
  const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-center w-12 h-12 bg-white/70 rounded-full mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{children}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Placeholder for Navbar */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">WeiMood</h1>
          <div>
            {/* Buttons are present for UI demonstration but have no actions */}
            <Link
              to="/auth"
              className="bg-transparent text-gray-700 font-semibold py-2 px-4 rounded-lg mr-2 hover:bg-gray-100 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center p-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-purple-200 rounded-full filter blur-3xl opacity-50 animate-aura-1"></div>
          <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-rose-200 rounded-full filter blur-3xl opacity-50 animate-aura-2"></div>
          <div className="absolute top-[20%] right-[15%] w-64 h-64 lg:w-80 lg:h-80 bg-teal-200 rounded-full filter blur-3xl opacity-40 animate-aura-3"></div>
        </div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
            Your Day, Perfectly Synced with Your Mood.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Harness the power of AI to understand your emotions and receive
            personalized suggestions that brighten your day, every day.
          </p>
          <button className="bg-gray-900 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Discover Your Flow
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">How It Works</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            In three simple steps, transform your daily routine into a
            personalized experience for well-being.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6">
              <div className="flex items-center justify-center h-24 w-24 mx-auto mb-4 bg-rose-100 rounded-full text-rose-500">
                <Icon
                  path="M14.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Track Your Mood</h3>
              <p className="text-gray-600">
                Quickly log how you feel with our intuitive mood tracker. It's
                simple, fast, and insightful.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-24 w-24 mx-auto mb-4 bg-teal-100 rounded-full text-teal-500">
                <Icon
                  path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 20l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 23.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 20l1.035-.259a3.375 3.375 0 002.456-2.456L18 15.75z"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                2. Get AI Suggestions
              </h3>
              <p className="text-gray-600">
                Our smart AI analyzes your mood patterns to suggest activities,
                content, and routines just for you.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-24 w-24 mx-auto mb-4 bg-purple-100 rounded-full text-purple-500">
                <Icon
                  path="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.94-3.94M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  className="w-12 h-12"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                3. See Your Progress
              </h3>
              <p className="text-gray-600">
                Watch your emotional well-being improve over time with
                beautiful, easy-to-understand charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-60"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">A toolkit for a better you.</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
              Explore the features designed to bring clarity and joy to your
              life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Intuitive Mood Logging"
              icon={
                <Icon
                  path="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75h.008v.008H9v-.008zm6 0h.008v.008H15v-.008z"
                  className="w-7 h-7 text-purple-500"
                />
              }
            >
              Log your mood in seconds. Our clean interface makes it effortless
              to capture your emotional state throughout the day.
            </FeatureCard>
            <FeatureCard
              title="AI-Powered Suggestions"
              icon={
                <Icon
                  path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09z"
                  className="w-7 h-7 text-teal-500"
                />
              }
            >
              From a calming playlist to a 10-minute walk, get smart, actionable
              tips based on your current mood and history.
            </FeatureCard>
            <FeatureCard
              title="Personalized Insights"
              icon={
                <Icon
                  path="M3.375 3.375c-1.105 0-2 .895-2 2v13.25c0 1.105.895 2 2 2h17.25c1.105 0 2-.895 2-2V5.375c0-1.105-.895-2-2-2H3.375z"
                  className="w-7 h-7 text-rose-500"
                />
              }
            >
              Discover trends in your mood. Learn what makes you happy, what
              triggers stress, and how to build positive habits.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Testimonial/Quote Section */}
      <section className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-2xl md:text-3xl font-serif italic">
              "This app doesn't just track my mood; it understands me. The AI
              suggestions feel like they're from a friend who truly gets it."
            </p>
            <p className="mt-6 text-lg font-semibold text-gray-300">
              - Hizkia Jonathan Budiana
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-purple-100 rounded-full filter blur-3xl opacity-50 animate-aura-1"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/3 w-[50rem] h-[50rem] bg-rose-100 rounded-full filter blur-3xl opacity-50 animate-aura-2"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to find your rhythm?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Start your journey towards a more mindful and balanced life. Your
            personalized day awaits.
          </p>
          <Link
            to="/auth"
            className="bg-gray-900 text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Sign Up for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} WeiMood. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
// This component now only renders the LandingPage.
export default LandingPage;
