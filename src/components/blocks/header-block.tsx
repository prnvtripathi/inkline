'use client';

import type { HeaderBlockContent, Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HeaderBlockProps {
  block: Block;
  onChange: (blockId: string, newContent: HeaderBlockContent) => void;
}

export function HeaderBlock({ block, onChange }: HeaderBlockProps) {
  const content = block.content as HeaderBlockContent;

  const handleChange = (field: keyof HeaderBlockContent, value: string) => {
    onChange(block.id, { ...content, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor={`title-${block.id}`}>Document Title</Label>
        <Input
          id={`title-${block.id}`}
          value={content.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Invoice, Contract"
          className="mt-1"
        />
      </div>
       <div>
        <Label htmlFor={`invoiceNumber-${block.id}`}>Invoice/Doc Number</Label>
        <Input
          id={`invoiceNumber-${block.id}`}
          value={content.invoiceNumber}
          onChange={(e) => handleChange('invoiceNumber', e.target.value)}
          placeholder="e.g., INV-2024-001"
          className="mt-1"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor={`companyName-${block.id}`}>Your Company Name</Label>
        <Input
          id={`companyName-${block.id}`}
          value={content.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          placeholder="Your Company LLC"
          className="mt-1"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor={`companyAddress-${block.id}`}>Your Company Address</Label>
        <Textarea
          id={`companyAddress-${block.id}`}
          value={content.companyAddress}
          onChange={(e) => handleChange('companyAddress', e.target.value)}
          placeholder="123 Main St, Anytown, USA"
          className="mt-1"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor={`clientName-${block.id}`}>Client Name</Label>
        <Input
          id={`clientName-${block.id}`}
          value={content.clientName}
          onChange={(e) => handleChange('clientName', e.target.value)}
          placeholder="Client Inc."
          className="mt-1"
        />
      </div>
      <div className="md:col-span-1"> {/* Keep this on same line as Client Name on larger screens */}
        <Label htmlFor={`clientAddress-${block.id}`}>Client Address</Label>
        <Textarea
          id={`clientAddress-${block.id}`}
          value={content.clientAddress}
          onChange={(e) => handleChange('clientAddress', e.target.value)}
          placeholder="456 Client Ave, Otherville, USA"
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor={`date-${block.id}`}>Date</Label>
        <Input
          id={`date-${block.id}`}
          type="date"
          value={content.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`dueDate-${block.id}`}>Due Date</Label>
        <Input
          id={`dueDate-${block.id}`}
          type="date"
          value={content.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
}
