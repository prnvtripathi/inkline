"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlockType } from "@/lib/types";
import type { Icon } from "lucide-react";

interface DraggableBlockItemProps {
  type: BlockType;
  name: string;
  icon?: React.ElementType;
}

export function DraggableBlockItem({
  type,
  name,
  icon: IconComponent,
}: DraggableBlockItemProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type }));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      className="cursor-grab select-none rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing active:shadow-lg"
    >
      <div className="flex items-center gap-3">
        {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
        <span className="text-sm font-medium text-card-foreground">{name}</span>
      </div>
    </Card>
  );
}
