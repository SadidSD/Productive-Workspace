'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InstagramPost, IgContentPillar } from '@/lib/services/instagram'

interface PillarBalanceProps {
  posts: InstagramPost[]
}

const PILLARS: { id: IgContentPillar; label: string; colorClass: string }[] = [
  { id: 'platform_pain', label: 'Platform Pain', colorClass: 'bg-rose-500' },
  { id: 'solution', label: 'Solution', colorClass: 'bg-blue-500' },
  { id: 'education', label: 'Education', colorClass: 'bg-amber-500' },
  { id: 'comparison', label: 'Comparison', colorClass: 'bg-purple-500' },
  { id: 'case_study', label: 'Case Study', colorClass: 'bg-green-500' },
]

export function PillarBalance({ posts }: PillarBalanceProps) {
  const totalPosts = posts.length

  const counts: Record<IgContentPillar, number> = {
    platform_pain: 0,
    solution: 0,
    education: 0,
    comparison: 0,
    case_study: 0,
  }

  posts.forEach((post) => {
    if (post.pillar) {
      counts[post.pillar] = (counts[post.pillar] || 0) + 1
    }
  })

  const maxCount = Math.max(...Object.values(counts), 1)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Pillar Balance
          <span className="text-sm font-normal text-muted-foreground">{totalPosts} posts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {PILLARS.map((pillar) => {
          const count = counts[pillar.id]
          const percentage = (count / maxCount) * 100

          return (
            <div key={pillar.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{pillar.label}</span>
                <span className="text-muted-foreground">
                  {count > 0 ? (
                    count
                  ) : (
                    <span className="text-amber-500 font-medium text-xs">No posts</span>
                  )}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${pillar.colorClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
