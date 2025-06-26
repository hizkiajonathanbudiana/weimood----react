import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, isAfter } from "date-fns";

// --- Chart Configuration & Helpers ---

// We map moods to a numerical score to plot them on a chart.
const moodScore = {
  excited: 5,
  happy: 4,
  calm: 3,
  bored: 2,
  sad: 1,
  overwhelmed: 0,
  fear: 0, // Example: mapping fear as low
  lonely: 1, // Example: mapping lonely as low
};

// We use the inverse mapping to display readable labels on the Y-Axis.
const scoreToMood = {
  5: "Excited",
  4: "Happy",
  3: "Calm",
  2: "Bored",
  1: "Sad",
  0: "Stressed", // "Overwhelmed" or a general negative term
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Find the closest mood name for the average score
    const avgScore = payload[0].value;
    const closestMood = scoreToMood[Math.round(avgScore)] || "Neutral";

    return (
      <div className="bg-white/70 backdrop-blur-lg rounded-lg border border-white/20 shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-800">{`Date: ${label}`}</p>
        <p className="text-purple-700">{`Avg. Mood: ${closestMood}`}</p>
      </div>
    );
  }
  return null;
};

// --- Main Chart Panel Component ---

export default function ChartPanel() {
  const { moodHistory, status } = useSelector((state) => state.mood);

  // useMemo will re-calculate the chart data only when moodHistory changes.
  const chartData = useMemo(() => {
    const sevenDaysAgo = subDays(new Date(), 7);

    // 1. Filter for the last 7 days & group moods by date
    const dailyMoods = moodHistory
      .filter((log) => isAfter(new Date(log.createdAt), sevenDaysAgo))
      .reduce((acc, log) => {
        const date = format(new Date(log.createdAt), "yyyy-MM-dd");
        if (!acc[date]) {
          acc[date] = [];
        }
        const score = moodScore[log.mood];
        if (typeof score === "number") {
          acc[date].push(score);
        }
        return acc;
      }, {});

    // 2. Calculate the average score for each day
    const processedData = Object.entries(dailyMoods).map(([date, scores]) => {
      const averageScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return {
        name: format(new Date(date), "MMM d"), // Format for X-Axis, e.g., "Jun 25"
        score: averageScore,
      };
    });

    // 3. Sort by date to ensure the line connects correctly
    return processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [moodHistory]);

  const isLoading = status === "loading";
  const hasEnoughData = chartData.length >= 2;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse flex items-end justify-between h-full pb-4 px-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{ height: `${20 + Math.random() * 60}%` }}
              className="w-4 bg-gray-300/60 rounded-t-full"
            ></div>
          ))}
        </div>
      );
    }

    if (!hasEnoughData) {
      return (
        <div className="flex items-center justify-center h-full text-center text-gray-500">
          <div>
            <p className="font-semibold">Not enough data yet.</p>
            <p className="text-sm">
              Log your mood for a couple of days to see your trend!
            </p>
          </div>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: -20, bottom: -5 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            stroke="#e5e7eb"
            dy={10}
          />
          <YAxis
            domain={[0, 5]}
            tickCount={6}
            tickFormatter={(value) => scoreToMood[value] || ""}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            stroke="#e5e7eb"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#c084fc",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6" // purple-500
            strokeWidth={2}
            dot={{ r: 4, fill: "#8b5cf6" }}
            activeDot={{
              r: 6,
              fill: "#a78bfa",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="h-64 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-4 sm:p-6 flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 text-center flex-shrink-0 mb-4">
        7-Day Mood Trend
      </h2>
      <div className="flex-grow">{renderContent()}</div>
    </div>
  );
}
