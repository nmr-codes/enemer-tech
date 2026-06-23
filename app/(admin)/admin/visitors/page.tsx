"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Globe, Smartphone } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface AnalyticsData {
  stats: {
    totalViews: number
  }
  viewsOverTime: Array<{ date: string; views: number }>
  topPaths: Array<{ path: string; count: number }>
  devices: Array<{ name: string; value: number }>
  countries: Array<{ name: string; value: number }>
  referrers: Array<{ name: string; value: number }>
}

export default function VisitorsAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics")
        if (!res.ok) {
          throw new Error("Failed to load analytics data")
        }
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          setError(json.error || "Failed to fetch analytics")
        }
      } catch (err) {
        setError(
          "Could not connect to the database. Make sure you set your DATABASE_URL in the .env file and run migrations."
        )
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 w-48 rounded" />
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visitor Analytics</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Monitor traffic metrics and page view statistics.
          </p>
        </div>
        <div className="p-6 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl max-w-xl">
          <h3 className="font-semibold text-lg">Analytics Unavailable</h3>
          <p className="text-sm mt-1">{error || "Ensure your database migrations are complete."}</p>
        </div>
      </div>
    )
  }

  const totalViews = data.stats.totalViews || 1

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Visitor Analytics</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Monitor your website traffic, user devices, and page performance.
        </p>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-brand" /> 30-Day Traffic Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-100 dark:stroke-neutral-800" />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#005fe8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand" /> Top Visited Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-xs text-neutral-400 font-bold uppercase">
                  <th className="pb-3">Path</th>
                  <th className="pb-3 text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
                {data.topPaths.map((item, i) => (
                  <tr key={item.path + i} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/20">
                    <td className="py-2.5 font-mono text-xs text-neutral-700 dark:text-neutral-300">{item.path}</td>
                    <td className="py-2.5 text-right font-bold text-brand">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-brand" /> Devices Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.devices.map((device, i) => {
                const pct = Math.round((device.value / totalViews) * 100)
                return (
                  <div key={device.name + i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="capitalize">{device.name}</span>
                      <span className="text-neutral-500">
                        {device.value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-brand to-brand-hover"
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand" /> Top Traffic Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.countries.map((country, i) => (
                  <Badge
                    key={country.name + i}
                    variant="outline"
                    className="flex items-center gap-1.5 py-1 px-3 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    <span>{country.name}</span>
                    <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">
                      {country.value}
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
