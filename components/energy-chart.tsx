'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from 'next-themes';

const data = [
  {
    date: 'Jan 22',
    Energy: 2400,
  },
  {
    date: 'Feb 22',
    Energy: 1398,
  },
  {
    date: 'Mar 22',
    Energy: 9800,
  },
  {
    date: 'Apr 22',
    Energy: 3908,
  },
  {
    date: 'May 22',
    Energy: 4800,
  },
  {
    date: 'Jun 22',
    Energy: 3800,
  },
  {
    date: 'Jul 22',
    Energy: 4300,
  },
];

export function EnergyChart() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Theme-aware colors
  const axisColor = isDark ? '#a1a1aa' : '#888888'; // gray-400 for dark, gray-500 for light
  const lineColor = isDark ? '#84cc16' : '#65a30d'; // lime-400 for dark, lime-600 for light
  const tooltipBg = isDark ? '#374151' : '#ffffff'; // gray-700 for dark, white for light
  const tooltipBorder = isDark ? '#4b5563' : '#e5e7eb'; // gray-600 for dark, gray-200 for light
  const tooltipText = isDark ? '#f3f4f6' : '#374151'; // gray-100 for dark, gray-700 for light

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} kWh`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: tooltipBg,
            border: `1px solid ${tooltipBorder}`,
            borderRadius: '6px',
            color: tooltipText,
            boxShadow: isDark
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
          labelStyle={{ color: tooltipText }}
        />
        <Line
          type="monotone"
          dataKey="Energy"
          stroke={lineColor}
          strokeWidth={2}
          dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
