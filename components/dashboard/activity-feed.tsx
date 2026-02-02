import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActivityItemProps {
    user: {
        name: string
        avatar?: string
        initials: string
    }
    action: string
    target: string
    time: string
}

export function ActivityItem({ user, action, target, time }: ActivityItemProps) {
    return (
        <div className="flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
            <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <p className="text-sm">
                    <span className="font-medium">{user.name}</span>{" "}
                    <span className="text-muted-foreground">{action}</span>{" "}
                    <span className="font-medium text-foreground">{target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{time}</p>
            </div>
        </div>
    )
}

export function ActivityFeed() {
    // Mock Data
    const activities: ActivityItemProps[] = [
        {
            user: { name: "You", initials: "ME" },
            action: "created project",
            target: "Website Redesign",
            time: "2 hours ago"
        },
        {
            user: { name: "System", initials: "SY" },
            action: "generated insight",
            target: "Mobile Traffic Spike",
            time: "5 hours ago"
        },
        {
            user: { name: "You", initials: "ME" },
            action: "completed task",
            target: "Setup Next.js Repo",
            time: "1 day ago"
        }
    ]

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 pb-2">
                <h3 className="font-semibold tracking-tight">Recent Activity</h3>
            </div>
            <div>
                {activities.map((item, i) => (
                    <ActivityItem key={i} {...item} />
                ))}
            </div>
        </div>
    )
}
