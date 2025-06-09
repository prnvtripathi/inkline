export type BlockType = "header" | "lineItems" | "clause" | "signature";

export interface Block {
  id: string;
  type: BlockType;
  content: any;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface HeaderBlockContent {
  title: string;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
}

export interface LineItemsBlockContent {
  items: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface ClauseBlockContent {
  title: string;
  text: string;
}

export interface SignatureBlockContent {
  signer1Name: string;
  signer1Role: string;
  signer2Name: string;
  signer2Role: string;
}

export interface DocumentModel {
  // Renamed to DocumentModel to avoid conflict with react-pdf Document
  id: string;
  name: string;
  blocks: Block[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon?: React.ElementType; // Optional: For display in template selector
  blocks: Pick<Block, "type" | "content">[]; // Template blocks define type and initial content
}

export const AVAILABLE_BLOCK_TYPES: {
  type: BlockType;
  name: string;
  defaultContent: () => any;
  icon?: React.ElementType;
}[] = [
  {
    type: "header",
    name: "Header",
    defaultContent: (): HeaderBlockContent => ({
      title: "Invoice",
      companyName: "Your Company LLC",
      companyAddress: "123 Main St, Anytown, USA",
      clientName: "Client Name",
      clientAddress: "Client Address",
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 10000)
      ).padStart(4, "0")}`,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }),
  },
  {
    type: "lineItems",
    name: "Line Items",
    defaultContent: (): LineItemsBlockContent => ({
      items: [
        {
          id: crypto.randomUUID(),
          description: "Service or Product",
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
      subtotal: 0,
      taxRate: 0.07, // Default 7% tax
      taxAmount: 0,
      total: 0,
    }),
  },
  {
    type: "clause",
    name: "Clause",
    defaultContent: (): ClauseBlockContent => ({
      title: "Terms and Conditions",
      text: "Enter clause text here...",
    }),
  },
  {
    type: "signature",
    name: "Signature",
    defaultContent: (): SignatureBlockContent => ({
      signer1Name: "Signer 1 Name",
      signer1Role: "Signer 1 Role",
      signer2Name: "Signer 2 Name",
      signer2Role: "Signer 2 Role",
    }),
  },
];
