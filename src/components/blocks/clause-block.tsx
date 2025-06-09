'use client';

import type { ClauseBlockContent, Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ClauseBlockProps {
  block: Block;
  onChange: (blockId: string, newContent: ClauseBlockContent) => void;
}

export function ClauseBlock({ block, onChange }: ClauseBlockProps) {
  const content = block.content as ClauseBlockContent;

  const handleChange = (field: keyof ClauseBlockContent, value: string) => {
    onChange(block.id, { ...content, [field]: value });
  };

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor={`clauseTitle-${block.id}`}>Clause Title</Label>
        <Input
          id={`clauseTitle-${block.id}`}
          value={content.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Terms and Conditions"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`clauseText-${block.id}`}>Clause Text</Label>
        <Textarea
          id={`clauseText-${block.id}`}
          value={content.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter clause text here..."
          className="mt-1 min-h-[120px]"
          rows={5}
        />
      </div>
    </div>
  );
}
