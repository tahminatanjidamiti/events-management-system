"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Skeleton from "@/components/ui/Skeleton";
import { getDashboardMetadata } from "@/services/AnalyticsServices";


const COLORS = ["#D97706", "#6B7280", "#16A34A", "#2563EB"];

export default function UserAnalyticsPage() {
  const [data, setData] = useState<{
    barData: { label: string; value: number }[];
    pieData: { label: string; value: number }[];
  }>({
    barData: [],
    pieData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardMetadata()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load analytics data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton className="h-96 w-full m-4" />;

  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-10">
        {error}
      </p>
    );

  if (!data.barData.length && !data.pieData.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        No analytics data available
      </p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">User Analytics</h1>

      {/* BAR CHART */}
      {data.barData.length > 0 && (
        <div className="h-72 w-full bg-white rounded shadow p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.barData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* PIE CHART */}
      {data.pieData.length > 0 && (
        <div className="h-72 w-full bg-white rounded shadow p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.pieData}
                dataKey="value"
                nameKey="label"
                outerRadius={90}
                label
              >
                {data.pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}