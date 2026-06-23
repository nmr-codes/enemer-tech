import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between pb-2 space-y-0">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {title}
          </span>
          <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 text-neutral-600 dark:text-neutral-300">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold tracking-tight">
            {value}
          </span>
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
