"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  Block,
  BlockType,
  HeaderBlockContent,
  LineItemsBlockContent,
  ClauseBlockContent,
  SignatureBlockContent,
  AVAILABLE_BLOCK_TYPES as AvailableBlockTypesType,
} from "@/lib/types";
import { AVAILABLE_BLOCK_TYPES } from "@/lib/types";
import { BlockPalette } from "@/components/builder/block-palette";
import { DocumentCanvas } from "@/components/builder/document-canvas";
import { Toolbar } from "@/components/builder/toolbar";
import { defaultTemplates } from "@/data/templates";

interface Template {
  id: string;
  name: string;
  description?: string;
  type: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [documentName, setDocumentName] = useState<string>("Untitled Document");
  const [isClient, setIsClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  // Load templates from API
  const loadTemplates = async () => {
    if (!session) return;

    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  // Load default template or empty state
  useEffect(() => {
    setIsClient(true);

    // If user is authenticated, load their templates
    if (status === 'authenticated') {
      loadTemplates();
    } else if (status === 'unauthenticated') {
      // If not authenticated, load default template
      const initialTemplate = defaultTemplates.find(
        (t) => t.id === "invoice-template"
      );

      if (initialTemplate) {
        setDocumentName(initialTemplate.name);
        const initialBlocks = initialTemplate.blocks.map((block) => ({
          ...block,
          id: crypto.randomUUID(),
        }));
        setBlocks(initialBlocks);
      }
      setIsLoadingTemplates(false);
    }
  }, [status, session]);

  // Save current document as a template
  const saveAsTemplate = async () => {
    if (!documentName.trim()) {
      toast.error('Please enter a name for the template');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: documentName,
          type: 'contract', // Default type, can be made configurable
          blocks: blocks,
        }),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplates(prev => [newTemplate, ...prev]);
        toast.success('Template saved successfully!');
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  // Load a template
  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setDocumentName(template.name);
      setBlocks(JSON.parse(JSON.stringify(template.blocks))); // Deep copy
    }
  };

  const handleDropBlock = (type: BlockType) => {
    const blockDefinition = AVAILABLE_BLOCK_TYPES.find((b) => b.type === type);
    if (blockDefinition) {
      const newBlock: Block = {
        id: crypto.randomUUID(),
        type: type,
        content: blockDefinition.defaultContent(),
      };
      setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    }
  };

  const handleUpdateBlock = (blockId: string, newContent: any) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    );
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== blockId)
    );
  };

  const handleBlocksReordered = (reorderedBlocks: Block[]) => {
    setBlocks(reorderedBlocks);
  };

  if (!isClient || status === 'loading' || isLoadingTemplates) {
    // Render a loading state or null during server-side rendering & pre-hydration
    return (
      <div className="flex h-screen w-full flex-col">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-muted-foreground">
            Loading Inkline Editor...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      <Toolbar
        blocks={blocks}
        setBlocks={setBlocks}
        documentName={documentName}
        setDocumentName={setDocumentName}
        onSaveTemplate={saveAsTemplate}
        isSaving={isSaving}
        templates={templates}
        onLoadTemplate={loadTemplate}
      />
      <main className="flex flex-1 overflow-hidden">
        <BlockPalette />
        <DocumentCanvas
          blocks={blocks}
          onDropBlock={handleDropBlock}
          onUpdateBlock={handleUpdateBlock}
          onRemoveBlock={handleRemoveBlock}
          onBlocksReordered={handleBlocksReordered}
          availableBlockTypes={AVAILABLE_BLOCK_TYPES}
        />
      </main>
    </div>
  );
}
