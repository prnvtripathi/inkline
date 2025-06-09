"use client";

import React, { useState, useEffect } from "react";
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

export default function DashboardPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [documentName, setDocumentName] = useState<string>("Untitled Document");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load default template or empty state
    const initialTemplate = defaultTemplates.find(
      (t) => t.id === "invoice-template"
    ); // Or any other default
    if (initialTemplate) {
      setDocumentName(initialTemplate.name);
      const initialBlocks = initialTemplate.blocks.map((block) => ({
        ...block,
        id: crypto.randomUUID(),
      }));
      setBlocks(initialBlocks);
    }
  }, []);

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

  if (!isClient) {
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

  return (
    <div className="flex w-full flex-col overflow-hidden">
      <Toolbar
        blocks={blocks}
        setBlocks={setBlocks}
        documentName={documentName}
        setDocumentName={setDocumentName}
      />
      <main className="flex flex-1 overflow-hidden">
        <BlockPalette />
        <DocumentCanvas
          blocks={blocks}
          onDropBlock={handleDropBlock}
          onUpdateBlock={handleUpdateBlock}
          onRemoveBlock={handleRemoveBlock}
          availableBlockTypes={
            AVAILABLE_BLOCK_TYPES as typeof AvailableBlockTypesType
          } // Pass as const
        />
      </main>
    </div>
  );
}
