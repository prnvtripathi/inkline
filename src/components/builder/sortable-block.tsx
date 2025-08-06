"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableBlockProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dragHandle?: boolean;
}

export function SortableBlock({
  id,
  children,
  className,
  dragHandle = true,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative group", className)}
    >
      {dragHandle && (
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "absolute -left-8 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            "transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}
