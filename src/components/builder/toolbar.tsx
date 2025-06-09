"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from "@/components/ui/select";
import { defaultTemplates } from "@/data/templates";
import type { Template, Block } from "@/lib/types";
import { FileDown, LayoutTemplate, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect } from "react";

interface ToolbarProps {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
  documentName: string;
  setDocumentName: Dispatch<SetStateAction<string>>;
}

export function Toolbar({
  blocks,
  setBlocks,
  documentName,
  setDocumentName,
}: ToolbarProps) {
  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = defaultTemplates.find((t) => t.id === templateId);
    if (selectedTemplate) {
      setDocumentName(selectedTemplate.name);
      const newBlocks = selectedTemplate.blocks.map((block) => ({
        ...block,
        id: crypto.randomUUID(),
      }));
      setBlocks(newBlocks);
    }
  };

  const clearDocument = () => {
    setBlocks([]);
    setDocumentName("Untitled Document");
  };

  const currentTemplateId =
    defaultTemplates.find((t) => t.name === documentName)?.id || "";

  return (
    <div className="flex items-center justify-between gap-4 border-b bg-background/80 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h2 className="text-xl font-semibold text-foreground">{documentName}</h2>
      <div className="flex items-center gap-2">
        <Select onValueChange={handleTemplateSelect} value={currentTemplateId}>
          <SelectTrigger className="w-[200px]">
            <LayoutTemplate className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Load Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Choose a Template</SelectLabel>
              <SelectSeparator />
              {defaultTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center">
                    {template.icon && (
                      <template.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    {template.name}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={clearDocument}
          aria-label="Clear Document"
          disabled={blocks.length === 0}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
