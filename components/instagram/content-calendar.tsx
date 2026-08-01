"use client"

import * as React from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  getDay
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostCard } from "./post-card"
import type { InstagramPost } from "@/lib/services/instagram"
import { cn } from "@/lib/utils"

interface ContentCalendarProps {
  posts: InstagramPost[]
  onPostClick: (post: InstagramPost) => void
  onDateClick: (date: string) => void
}

export function ContentCalendar({ posts, onPostClick, onDateClick }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const dateFormat = "MMMM yyyy"
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  })

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          {format(currentDate, dateFormat)}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-md bg-border/50 overflow-hidden border border-border/50">
        {weekDays.map(day => (
          <div key={day} className="bg-background py-2 text-center text-xs font-medium text-muted-foreground uppercase">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const dayPosts = posts.filter(p => p.scheduled_date === dateKey)
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isCurrentDay = isToday(day)
          const dayOfWeek = getDay(day) // 0 is Sunday, 1 is Monday, 3 is Wed, 5 is Fri
          const isPostingDay = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5

          return (
            <div
              key={day.toString()}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  onDateClick(dateKey)
                }
              }}
              className={cn(
                "min-h-[100px] bg-background p-1 cursor-pointer transition-colors hover:bg-muted/50 flex flex-col",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isPostingDay && "bg-primary/[0.03]",
                isCurrentDay && "ring-2 ring-primary/20 ring-inset relative z-10"
              )}
            >
              <div className="flex justify-end p-1 pointer-events-none">
                <span className={cn(
                  "text-sm",
                  isCurrentDay && "bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium"
                )}>
                  {format(day, "d")}
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1 flex-1 pointer-events-none">
                {dayPosts.map(post => (
                  <div key={post.id} onClick={() => onPostClick(post)} className="pointer-events-auto">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
