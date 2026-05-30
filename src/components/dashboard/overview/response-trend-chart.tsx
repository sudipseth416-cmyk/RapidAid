"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const responseTrend = [
  { hour: "06:00", min: 8.2 },
  { hour: "09:00", min: 7.1 },
  { hour: "12:00", min: 6.8 },
  { hour: "15:00", min: 6.2 },
  { hour: "18:00", min: 5.9 },
];

export function ResponseTrendChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-40 min-h-[160px] w-full min-w-0" aria-hidden />;
  }

  return (
    <div className="h-40 min-h-[160px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minHeight={160}>
        <LineChart data={responseTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} unit="m" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#E24B4A"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
