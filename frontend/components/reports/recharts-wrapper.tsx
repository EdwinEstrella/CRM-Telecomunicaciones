"use client";

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RechartsWrapperProps {
  ticketsData: Array<{ name: string; value: number }>;
  kpiData: Array<{ name: string; value: number }>;
  colors: string[];
  showPie?: boolean;
  showBar?: boolean;
}

export function RechartsWrapper({ ticketsData, kpiData, colors, showPie = false, showBar = false }: RechartsWrapperProps) {
  return (
    <>
      {showPie && ticketsData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ticketsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {ticketsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}

      {showBar && kpiData.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={kpiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
}

