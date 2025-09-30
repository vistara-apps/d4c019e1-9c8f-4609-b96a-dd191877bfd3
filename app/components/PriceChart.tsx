'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PricePoint } from '../types'

interface PriceChartProps {
  data: PricePoint[]
  height?: number
}

export function PriceChart({ data, height = 300 }: PriceChartProps) {
  const formattedData = data.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    price: point.price,
    timestamp: point.timestamp
  }))

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--text-secondary))" opacity={0.1} />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--text-secondary))"
            fontSize={12}
          />
          <YAxis
            stroke="hsl(var(--text-secondary))"
            fontSize={12}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--surface))',
              border: '1px solid hsl(var(--text-secondary))',
              borderRadius: '8px',
              color: 'hsl(var(--text-primary))'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

