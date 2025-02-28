"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Jan 22",
    Energy: 2400,
  },
  {
    date: "Feb 22",
    Energy: 1398,
  },
  {
    date: "Mar 22",
    Energy: 9800,
  },
  {
    date: "Apr 22",
    Energy: 3908,
  },
  {
    date: "May 22",
    Energy: 4800,
  },
  {
    date: "Jun 22",
    Energy: 3800,
  },
  {
    date: "Jul 22",
    Energy: 4300,
  },
]

export function EnergyChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} kWh`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="Energy" stroke="#adfa1d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

