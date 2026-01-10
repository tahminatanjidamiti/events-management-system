/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getDashboardMetadata } from "@/services/AnalyticsServices";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Skeleton from "@/components/ui/Skeleton";

export default function HostAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardMetadata()
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ["#D97706", "#6B7280"]; 

  if (loading) return <Skeleton className="h-96 w-full m-4" />;

  if (!data) return <p className="text-center text-gray-500">No analytics data found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">User Analytics</h1>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.barData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#D97706" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data.pieData} dataKey="value" nameKey="label" outerRadius={80} label>
              {data.pieData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}