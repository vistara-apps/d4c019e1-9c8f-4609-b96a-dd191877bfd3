'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraphProps } from '../../types';

export const Graph: React.FC<GraphProps> = ({
  data,
  variant = 'large',
  color = '#2563eb',
}) => {
  const formatTooltipValue = (value: number) => {
    return [`$${value.toFixed(value < 1 ? 6 : 2)}`, 'Price'];
  };

  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    if (variant === 'small') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
    });
  };

  const height = variant === 'small' ? 200 : 300;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxisLabel}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis
            tickFormatter={(value) => `$${value.toFixed(value < 1 ? 4 : 2)}`}
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

