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
import { getDashboardMetadata } from "@/actions/analytics";

const COLORS = ["#D97706", "#6B7280", "#16A34A", "#2563EB"];

type AnalyticsData = {
  barData: { label: string; value: number }[];
  pieData: { label: string; value: number }[];
};

export default function UserAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    barData: [],
    pieData: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardMetadata()
      .then((res) => {
        setData({
          barData: Array.isArray(res?.barData) ? res.barData : [],
          pieData: Array.isArray(res?.pieData) ? res.pieData : [],
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load analytics data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="w-11/12 mx-auto mt-6"><Skeleton className="h-96 w-full m-4" /></div>;

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium mt-10">{error}</p>
    );
  }

  const isEmpty =
    data.barData.every((d) => d.value === 0) &&
    data.pieData.every((d) => d.value === 0);

  if (isEmpty) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No activity yet. Join some events to see your analytics!
      </p>
    );
  }

  return (
    <div className="p-1 lg:p-4 w-full mx-auto space-y-10">
      <h1 className="text-2xl font-bold">User Analytics</h1>
      {data.barData.length > 0 && (
        <div className="w-full rounded shadow p-4">
          <h2 className="text-base font-semibold mb-3 text-gray-700">Activity Overview</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data.barData}
              margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
            >
              <XAxis
                dataKey="label"
                angle={-35}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="value" fill="#E98C00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.pieData.length > 0 && (
        <div className="w-full rounded shadow p-1">
          <h2 className="text-base font-semibold mb-3 text-gray-700">Distribution</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data.pieData}
                dataKey="value"
                nameKey="label"
                outerRadius={110}
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={true}
              >
                {data.pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => [value ?? 0, "Count"] as [number, string]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}