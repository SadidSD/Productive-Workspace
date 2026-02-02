import { Project } from "@/lib/services/projects"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Clock, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export function ProjectCard({ project }: { project: Project }) {
    const statusColor = {
        planning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200",
        active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200",
        paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200",
        completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
    }

    // Mock progress calculation
    const progress = project.status === 'completed' ? 100 : project.status === 'planning' ? 10 : 45

    return (
        <Link href={`/dashboard/projects/${project.id}`}>
            <Card className="group hover:scale-[1.01] transition-all duration-300 cursor-pointer h-full border hover:border-primary/20 shadow-sm hover:shadow-md bg-card">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className={`text-[10px] font-semibold tracking-wide border px-2 py-0.5 rounded-full uppercase ${statusColor[project.status]}`}>
                            {project.status}
                        </Badge>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="text-xl font-semibold tracking-tight text-foreground/90">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[40px] text-sm mt-1.5 font-light">
                        {project.description || "No description provided."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-3 space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-secondary" indicatorClassName="bg-primary/80" />
                    </div>
                </CardContent>

                <CardFooter className="pt-3 border-t bg-muted/10 flex justify-between items-center px-6 py-4">
                    <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-background/50">
                            <AvatarFallback className="text-[9px] bg-slate-200 text-slate-600 font-bold">ME</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background ring-1 ring-background/50">
                            <AvatarFallback className="text-[9px] bg-indigo-100 text-indigo-600 font-bold">JD</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground font-medium">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(new Date(project.created_at))} ago
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
