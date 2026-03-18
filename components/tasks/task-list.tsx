"use client"

import { useState, useEffect } from "react"
import { Task, updateTask, deleteTask } from "@/lib/services/tasks"
import { getWorkspaceMembers, WorkspaceMember } from "@/lib/services/members"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreVertical, Edit2, Trash2, Loader2, UserCircle2 } from "lucide-react"

interface TaskListProps {
    initialTasks: Task[]
    workspaceId: string
}

export function TaskList({ initialTasks, workspaceId }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
    
    // Edit Dialog State
    const [editTask, setEditTask] = useState<Task | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [members, setMembers] = useState<WorkspaceMember[]>([])
    
    // Delete State
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    useEffect(() => {
        setTasks(initialTasks)
    }, [initialTasks])

    useEffect(() => {
        if (editTask) {
            getWorkspaceMembers(workspaceId).then(setMembers)
        }
    }, [editTask, workspaceId])

    const handleDelete = async (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to delete this task?")) return
        
        setIsDeleting(taskId)
        try {
            await deleteTask(taskId)
            setTasks(tasks.filter(t => t.id !== taskId))
        } catch (error) {
            console.error("Failed to delete task:", error)
        } finally {
            setIsDeleting(null)
        }
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editTask) return

        setIsEditing(true)
        try {
            const updates = {
                title: editTask.title,
                description: editTask.description,
                priority: editTask.priority,
                status: editTask.status,
                assignee_id: editTask.assignee_id === 'unassigned' ? null : editTask.assignee_id
            }
            
            const updatedTask = await updateTask(editTask.id, updates)
            setTasks(tasks.map(t => t.id === editTask.id ? updatedTask : t))
            setEditTask(null)
        } catch (error) {
            console.error("Failed to update task:", error)
        } finally {
            setIsEditing(false)
        }
    }

    const handleToggleDone = async (task: Task, e: React.MouseEvent | React.FormEvent) => {
        if ('stopPropagation' in e) e.stopPropagation()
        const newStatus = task.status === 'done' ? 'todo' : 'done'
        
        // Optimistic UI update
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
        
        try {
            await updateTask(task.id, { status: newStatus })
        } catch (error) {
            console.error("Failed to toggle status:", error)
            // Revert on failure
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: task.status } : t))
        }
    }

    const toggleExpand = (taskId: string) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
    }

    const statusColors = {
        todo: "bg-slate-100 text-slate-700",
        in_progress: "bg-blue-100 text-blue-700",
        review: "bg-purple-100 text-purple-700",
        done: "bg-green-100 text-green-700",
    }

    return (
        <div className="space-y-4">
            {tasks.map(task => {
                const isExpanded = expandedTaskId === task.id
                return (
                    <Card 
                        key={task.id} 
                        className={`cursor-pointer transition-all ${isExpanded ? 'shadow-md ring-1 ring-border border-primary/20' : 'hover:bg-muted/50'}`}
                        onClick={() => toggleExpand(task.id)}
                    >
                        <CardContent className={`p-4 ${isExpanded ? 'pb-6' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="mt-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox 
                                            checked={task.status === 'done'} 
                                            onCheckedChange={() => handleToggleDone(task, { stopPropagation: () => {} } as React.MouseEvent)} 
                                            className="h-5 w-5 rounded-md"
                                        />
                                    </div>
                                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-orange-300' : 'bg-slate-300'}`} />
                                    <div className={`flex-1 mr-4 ${task.status === 'done' ? 'opacity-50 line-through' : ''}`}>
                                        <div className="font-medium text-lg leading-tight mb-1">{task.title}</div>
                                        {task.description && (
                                            <div className={`text-sm text-muted-foreground whitespace-pre-wrap ${!isExpanded && 'line-clamp-1'}`}>
                                                {task.description}
                                            </div>
                                        )}
                                        {isExpanded && task.priority && (
                                            <div className="mt-4 flex gap-4 text-xs font-medium text-muted-foreground">
                                                <span>Priority: <span className="uppercase text-foreground">{task.priority}</span></span>
                                                {task.due_date && <span>Due: <span className="text-foreground">{new Date(task.due_date).toLocaleDateString()}</span></span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge variant="outline" className={statusColors[task.status] || ""}>
                                        {task.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                    
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                {isDeleting === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditTask({...task, assignee_id: task.assignee_id || 'unassigned'}) }}>
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                Edit Task
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer" onClick={(e) => handleDelete(task.id, e)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Task
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

            {tasks.length === 0 && (
                <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                    No active tasks. Create one above!
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editTask} onOpenChange={(open) => !open && setEditTask(null)}>
                <DialogContent className="sm:max-w-[500px]" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Update the details of your task.</DialogDescription>
                    </DialogHeader>
                    {editTask && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Task Title</Label>
                                <Input
                                    id="edit-title"
                                    value={editTask.title}
                                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                        value={editTask.status}
                                        onValueChange={(value: any) => setEditTask({ ...editTask, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-priority">Priority</Label>
                                    <Select
                                        value={editTask.priority}
                                        onValueChange={(value: any) => setEditTask({ ...editTask, priority: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-assignee">Assignee</Label>
                                    <Select
                                        value={editTask.assignee_id || 'unassigned'}
                                        onValueChange={(value) => setEditTask({ ...editTask, assignee_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {members.map(member => (
                                                <SelectItem key={member.user_id} value={member.user_id}>
                                                    <div className="flex items-center gap-2">
                                                        <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                                        <span>{member.user?.full_name || member.user?.email || 'Unknown'}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-due-date">Due Date</Label>
                                    <Input
                                        id="edit-due-date"
                                        type="date"
                                        value={editTask.due_date ? new Date(editTask.due_date).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value.length ? e.target.value : null })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editTask.description || ''}
                                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isEditing}>
                                    {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
