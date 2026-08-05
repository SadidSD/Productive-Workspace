"use client";

import { InstagramPost } from "@/lib/services/instagram";
import { Film, Images, CircleDot, Radio, FileText } from "lucide-react";
import { PillarBadge } from "./pillar-badge";
import { QuickStatusSelector } from "./quick-status-selector";
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

  const title = post.title || "Untitled Post";

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2 rounded-lg border bg-card p-2 text-card-foreground transition-colors hover:border-primary/50 cursor-pointer shadow-2xs group"
    >
      <div className="flex items-center justify-between gap-1 overflow-hidden">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-muted-foreground flex-shrink-0">
            {getFormatIcon(post.format)}
          </span>
          <span className="truncate text-xs font-semibold group-hover:text-primary transition-colors">
            {title}
          </span>
        </div>
        {post.full_script && (
          <span title="Script written">
            <FileText className="h-3 w-3 text-indigo-500 flex-shrink-0" />
          </span>
        )}
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <QuickStatusSelector postId={post.id} currentStatus={post.status} />
        <PillarBadge pillar={post.pillar} />
      </div>
    </div>
  );
}
