"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Block, Template as TemplateType } from "@/lib/types";
import { FilePlus, Loader2, Save, Trash2, X, LayoutTemplate, Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";

interface Template {
  id: string;
  name: string;
  description?: string;
  type: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

interface ToolbarProps {
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
  documentName: string;
  setDocumentName: Dispatch<SetStateAction<string>>;
  onSaveTemplate?: () => Promise<void>;
  isSaving?: boolean;
  templates?: Template[];
  onLoadTemplate?: (templateId: string) => void;
}

export function Toolbar({
  blocks,
  setBlocks,
  documentName,
  setDocumentName,
  onSaveTemplate,
  isSaving,
  templates,
  onLoadTemplate,
}: ToolbarProps) {
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(documentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  const saveName = () => {
    if (editingName.trim()) {
      setDocumentName(editingName);
    } else {
      setEditingName(documentName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      setEditingName(documentName);
      setIsEditing(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    // Check if it's a default template
    const defaultTemplate = defaultTemplates.find((t) => t.id === templateId);
    if (defaultTemplate) {
      setDocumentName(defaultTemplate.name);
      const newBlocks = defaultTemplate.blocks.map((block) => ({
        ...block,
        id: crypto.randomUUID(),
      }));
      setBlocks(newBlocks);
    } else if (onLoadTemplate) {
      // It's a user template
      onLoadTemplate(templateId);
    }
    setIsTemplateOpen(false);
  };

  const clearDocument = () => {
    setBlocks([]);
    setDocumentName("Untitled Document");
  };

  const handleUpdateBlock = (blockId: string, newContent: any) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content: newContent } : block
    );
    setBlocks(updatedBlocks);
  };

  return (
    <div className="flex items-center justify-between gap-4 border-b bg-background/80 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Input
              ref={inputRef}
              value={editingName}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className="h-8 w-64 text-base font-semibold"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={saveName}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setEditingName(documentName);
                setIsEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <h2
            className="cursor-pointer rounded-md px-2 py-1 text-xl font-semibold text-foreground hover:bg-accent/50"
            onClick={() => setIsEditing(true)}
          >
            {documentName}
          </h2>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Select
            onValueChange={handleTemplateSelect}
            open={isTemplateOpen}
            onOpenChange={setIsTemplateOpen}
          >
            <SelectTrigger className="w-[200px]">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Load Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Default Templates</SelectLabel>
                <SelectSeparator />
                {defaultTemplates.map((template) => (
                  <SelectItem key={`default-${template.id}`} value={template.id}>
                    <div className="flex items-center">
                      {template.icon && (
                        <template.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      {template.name}
                    </div>
                  </SelectItem>
                ))}

                {templates && templates.length > 0 && (
                  <>
                    <SelectSeparator />
                    <SelectLabel>My Templates</SelectLabel>
                    <SelectSeparator />
                    {templates.map((template) => (
                      <SelectItem key={`user-${template.id}`} value={template.id}>
                        <div className="flex items-center">
                          <LayoutTemplate className="mr-2 h-4 w-4 text-muted-foreground" />
                          {template.name}
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {onSaveTemplate && (
            <Button
              variant="outline"
              onClick={onSaveTemplate}
              disabled={isSaving || blocks.length === 0}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Template
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={clearDocument}
            title="Clear Document"
            disabled={blocks.length === 0}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
