'use client';

import type { LineItemsBlockContent, LineItem, Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { format } from 'date-fns';

interface LineItemBlockProps {
  block: Block;
  onChange: (blockId: string, newContent: LineItemsBlockContent) => void;
}

export function LineItemBlock({ block, onChange }: LineItemBlockProps) {
  const content = block.content as LineItemsBlockContent;

  const updateItem = (itemId: string, field: keyof LineItem, value: string | number) => {
    const newItems = content.items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    });
    updateTotals(newItems, content.taxRate);
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    updateTotals([...content.items, newItem], content.taxRate);
  };

  const removeItem = (itemId: string) => {
    const newItems = content.items.filter((item) => item.id !== itemId);
    updateTotals(newItems, content.taxRate);
  };
  
  const handleTaxRateChange = (newTaxRateStr: string) => {
    const newTaxRate = parseFloat(newTaxRateStr);
    if (!isNaN(newTaxRate) && newTaxRate >= 0 && newTaxRate <=1) { // Ensure tax rate is between 0 and 1 (0% to 100%)
      updateTotals(content.items, newTaxRate);
    } else if (newTaxRateStr === "") { // Allow clearing the field
      updateTotals(content.items, 0);
    }
  }

  const updateTotals = (items: LineItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;
    onChange(block.id, { items, subtotal, taxRate, taxAmount, total });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Description</TableHead>
            <TableHead className="w-[15%] text-right">Quantity</TableHead>
            <TableHead className="w-[20%] text-right">Unit Price</TableHead>
            <TableHead className="w-[20%] text-right">Total</TableHead>
            <TableHead className="w-[5%]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Service or product name"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  className="text-right"
                  min="0"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="text-right"
                  min="0"
                  step="0.01"
                />
              </TableCell>
              <TableCell className="text-right font-medium">
                {item.total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-right font-semibold">Subtotal</TableCell>
            <TableCell className="text-right font-semibold">
              {content.subtotal.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className="text-right">Tax Rate (%)</TableCell>
            <TableCell>
              <Input
                type="number"
                value={(content.taxRate * 100).toFixed(2)} // Display as percentage
                onChange={(e) => handleTaxRateChange((parseFloat(e.target.value) / 100).toString())}
                className="text-right"
                min="0"
                step="0.01"
                placeholder="e.g. 7 for 7%"
              />
            </TableCell>
            <TableCell className="text-right">
              {content.taxAmount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow className="border-t-2 border-primary">
            <TableCell colSpan={3} className="text-right text-lg font-bold">Total</TableCell>
            <TableCell className="text-right text-lg font-bold">
              {content.total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
      <Button onClick={addItem} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
      </Button>
    </div>
  );
}
