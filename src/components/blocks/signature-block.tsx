'use client';

import type { SignatureBlockContent, Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface SignatureBlockProps {
  block: Block;
  onChange: (blockId: string, newContent: SignatureBlockContent) => void;
}

export function SignatureBlock({ block, onChange }: SignatureBlockProps) {
  const content = block.content as SignatureBlockContent;

  const handleChange = (field: keyof SignatureBlockContent, value: string) => {
    onChange(block.id, { ...content, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <Label htmlFor={`signer1Name-${block.id}`}>Signer 1 Name</Label>
          <Input
            id={`signer1Name-${block.id}`}
            value={content.signer1Name}
            onChange={(e) => handleChange('signer1Name', e.target.value)}
            placeholder="Full Name"
            className="mt-1"
          />
        </div>
        <div className="mt-2 h-12 border-b border-foreground/50"></div> {/* Signature line */}
        <div>
          <Label htmlFor={`signer1Role-${block.id}`}>Signer 1 Role/Title</Label>
          <Input
            id={`signer1Role-${block.id}`}
            value={content.signer1Role}
            onChange={(e) => handleChange('signer1Role', e.target.value)}
            placeholder="e.g., CEO, Authorized Signatory"
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-4">
         <div>
          <Label htmlFor={`signer2Name-${block.id}`}>Signer 2 Name (Optional)</Label>
          <Input
            id={`signer2Name-${block.id}`}
            value={content.signer2Name}
            onChange={(e) => handleChange('signer2Name', e.target.value)}
            placeholder="Full Name"
            className="mt-1"
          />
        </div>
        <div className="mt-2 h-12 border-b border-foreground/50"></div> {/* Signature line */}
        <div>
          <Label htmlFor={`signer2Role-${block.id}`}>Signer 2 Role/Title</Label>
          <Input
            id={`signer2Role-${block.id}`}
            value={content.signer2Role}
            onChange={(e) => handleChange('signer2Role', e.target.value)}
            placeholder="e.g., Client Representative"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
