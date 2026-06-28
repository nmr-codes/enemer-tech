"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

interface GrowthDataPoint {
  date: string
  users: number
}

interface AuthDataPoint {
  name: string
  value: number
  color: string
}

interface UserAnalyticsChartsProps {
  growthData: GrowthDataPoint[]
  authData: AuthDataPoint[]
}

export function UserAnalyticsCharts({ growthData, authData }: UserAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* User Growth Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-neutral-900 dark:text-white">User Growth (Last 30 Days)</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Total registered users over time</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005fe8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#005fe8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="currentColor" 
                className="text-neutral-500"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                stroke="currentColor" 
                className="text-neutral-500"
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: '#171717'
                }}
                itemStyle={{ color: '#005fe8', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#005fe8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Auth Methods Chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm flex flex-col">
        <div className="mb-2">
          <h3 className="font-semibold text-neutral-900 dark:text-white">Authentication</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Methods breakdown</p>
        </div>
        <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={authData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {authData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: '#171717'
                }}
                itemStyle={{ fontWeight: 600 }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
