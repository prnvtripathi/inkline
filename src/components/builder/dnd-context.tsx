"use client";

import { useState } from "react";
import { createContext, useContext, ReactNode } from "react";
import { DndContext as DndKitContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";

type Block = {
  id: string;
  type: string;
  content: any;
};

type DndContextType = {
  activeId: string | null;
  items: Block[];
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  activeItem: Block | null;
};

const DndContext = createContext<DndContextType | undefined>(undefined);

export function DndProvider({
  children,
  items,
  onItemsChange,
}: {
  children: ReactNode;
  items: Block[];
  onItemsChange: (items: Block[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<Block | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    setActiveItem(items.find((item) => item.id === active.id) || null);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        onItemsChange(newItems);
      }
    }
    
    setActiveId(null);
    setActiveItem(null);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    if (active.id === over.id) return;
    
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    const newItems = arrayMove(items, oldIndex, newIndex);
    onItemsChange(newItems);
  };

  return (
    <DndContext.Provider
      value={{
        activeId,
        items,
        onDragEnd,
        onDragStart,
        onDragOver,
        activeItem,
      }}
    >
      <DndKitContext
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
        <DragOverlay>
          {activeItem ? (
            <div className="opacity-50">
              {/* Render a preview of the dragged item */}
              {activeItem.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndKitContext>
    </DndContext.Provider>
  );
}

export function useDnd() {
  const context = useContext(DndContext);
  if (context === undefined) {
    throw new Error("useDnd must be used within a DndProvider");
  }
  return context;
}
