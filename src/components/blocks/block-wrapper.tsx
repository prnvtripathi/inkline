'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Settings2 } from 'lucide-react';

interface BlockWrapperProps {
  title: string;
  blockId: string;
  onRemove: (id: string) => void;
  children: React.ReactNode;
  // onConfigure?: (id: string) => void; // For future configuration options
}

export function BlockWrapper({ title, blockId, onRemove, children /*, onConfigure*/ }: BlockWrapperProps) {
  return (
    <Card className="mb-4 shadow-lg transition-shadow hover:shadow-xl bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4">
        <CardTitle className="text-base font-medium text-card-foreground">{title}</CardTitle>
        <div className="flex items-center gap-1">
          {/* Placeholder for drag handle and configure button */}
          {/* <Button variant="ghost" size="icon" className="cursor-grab">
            <GripVertical className="h-4 w-4" />
          </Button>
          {onConfigure && (
            <Button variant="ghost" size="icon" onClick={() => onConfigure(blockId)}>
              <Settings2 className="h-4 w-4" />
            </Button>
          )} */}
          <Button variant="ghost" size="icon" onClick={() => onRemove(blockId)} aria-label={`Remove ${title} block`}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}
