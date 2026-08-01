"use client";

import { InstagramPost } from "@/lib/services/instagram";
import { Film, Images, CircleDot, Radio } from "lucide-react";
import { PillarBadge } from "./pillar-badge";
import { StatusBadge } from "./status-badge";
import { FormulaBadge } from "./formula-badge";

interface PostCardProps {
  post: InstagramPost;
  onClick?: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "reel":
        return <Film className="h-3.5 w-3.5" />;
      case "carousel":
        return <Images className="h-3.5 w-3.5" />;
      case "story":
        return <CircleDot className="h-3.5 w-3.5" />;
      case "live":
        return <Radio className="h-3.5 w-3.5" />;
      default:
        return <Film className="h-3.5 w-3.5" />;
    }
  };

  // Graceful fallback for post title representation
  const title = (post as any).title || (post as any).hook || "Untitled Post";
  const scheduledTime = (post as any).scheduledFor 
    ? new Date((post as any).scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : null;

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2 rounded-lg border bg-card p-2 text-card-foreground transition-colors hover:bg-accent cursor-pointer"
    >
      <div className="flex items-center gap-1.5 overflow-hidden">
        <span className="text-muted-foreground flex-shrink-0">
          {getFormatIcon(post.format)}
        </span>
        <span className="truncate text-sm font-medium">
          {title}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <StatusBadge status={post.status} />
        <PillarBadge pillar={post.pillar} />
        <FormulaBadge formula={post.script_formula} />
      </div>

      {scheduledTime && (
        <div className="text-xs text-muted-foreground">
          {scheduledTime}
        </div>
      )}
    </div>
  );
}
