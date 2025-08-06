'use client';

import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { HTMLAttributes, ReactNode } from 'react';

interface DragHandleProps extends HTMLAttributes<HTMLButtonElement> {
  'aria-label'?: string;
  'aria-pressed'?: boolean | 'false' | 'true';
  'aria-describedby'?: string;
  'data-key'?: string;
  'data-id'?: string;
  'data-sortable-handle'?: string;
  'data-testid'?: string;
  role?: string;
  tabIndex?: number;
}

interface BlockWrapperProps {
  title: string;
  blockId: string;
  onRemove: (id: string) => void;
  children: ReactNode;
  dragHandleProps?: DragHandleProps;
  isDragging?: boolean;
  className?: string;
  // onConfigure?: (id: string) => void; // For future configuration options
}

export const BlockWrapper = forwardRef<HTMLDivElement, BlockWrapperProps>(({ 
  title, 
  blockId, 
  onRemove, 
  children, 
  dragHandleProps = {},
  isDragging = false,
  className,
  /* onConfigure */ 
}, ref) => {
  return (
    <Card 
      ref={ref}
      className={cn(
        'mb-4 shadow-lg transition-all bg-card',
        isDragging ? 'opacity-50' : 'hover:shadow-xl',
        className
      )}
    >
      <CardHeader className="group flex flex-row items-center justify-between space-y-0 border-b p-3 pr-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-6 w-6 cursor-grab p-0 opacity-0 group-hover:opacity-100',
              'transition-opacity duration-200',
              'focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring',
              'active:cursor-grabbing',
              'touch-none' // Improve touch device handling
            )}
            {...dragHandleProps}
            aria-label={`Drag ${title} block`}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <CardTitle className="text-base font-medium text-card-foreground">
            {title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1">
          {/* {onConfigure && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onConfigure(blockId)}
              aria-label={`Configure ${title} block`}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          )} */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive" 
            onClick={() => onRemove(blockId)} 
            aria-label={`Remove ${title} block`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
});

BlockWrapper.displayName = 'BlockWrapper';

// Sortable version of BlockWrapper
export function SortableBlockWrapper(props: BlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.blockId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BlockWrapper
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}
