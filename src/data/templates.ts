import type { Template } from "@/lib/types";
import { FileText, Briefcase } from "lucide-react";

export const defaultTemplates: Template[] = [
  {
    id: "invoice-template",
    name: "Standard Invoice",
    description: "A basic invoice template for services or products.",
    icon: FileText,
    blocks: [
      {
        type: "header",
        content: {
          title: "Invoice",
          companyName: "Your Company Name",
          companyAddress: "123 Business Rd, Suite 456, Your City, ST 12345",
          clientName: "[Client Company Name]",
          clientAddress: "[Client Address]",
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(
            Math.floor(Math.random() * 10000)
          ).padStart(4, "0")}`,
          date: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      },
      {
        type: "lineItems",
        content: {
          items: [
            {
              id: crypto.randomUUID(),
              description: "Example Item 1",
              quantity: 2,
              unitPrice: 50,
              total: 100,
            },
            {
              id: crypto.randomUUID(),
              description: "Example Item 2",
              quantity: 1,
              unitPrice: 75,
              total: 75,
            },
          ],
          subtotal: 175,
          taxRate: 0.08, // 8%
          taxAmount: 14,
          total: 189,
        },
      },
      {
        type: "clause",
        content: {
          title: "Payment Terms",
          text: "Payment is due within 30 days of the invoice date. Late payments may incur a fee of 1.5% per month.",
        },
      },
      {
        type: "signature",
        content: {
          signer1Name: "[Your Name/Company Representative]",
          signer1Role: "[Your Title/Role]",
          signer2Name: "", // Optional second signer
          signer2Role: "",
        },
      },
    ],
  },
  {
    id: "nda-template",
    name: "Non-Disclosure Agreement (NDA)",
    description: "A standard template for a mutual non-disclosure agreement.",
    icon: Briefcase,
    blocks: [
      {
        type: "header",
        content: {
          title: "Mutual Non-Disclosure Agreement",
          companyName: "[Party A Name]",
          companyAddress: "[Party A Address]",
          clientName: "[Party B Name]",
          clientAddress: "[Party B Address]",
          invoiceNumber: `NDA-${new Date().getFullYear()}-${String(
            Math.floor(Math.random() * 1000)
          ).padStart(3, "0")}`,
          date: new Date().toISOString().split("T")[0],
          dueDate: "", // Not applicable for NDA typically
        },
      },
      {
        type: "clause",
        content: {
          title: "1. Definition of Confidential Information",
          text: "Confidential Information means any data or information that is proprietary to the Disclosing Party and not generally known to the public, whether in tangible or intangible form, whenever and however disclosed, including, but not limited to: (i) any marketing strategies, plans, financial information, or projections, operations, sales estimates, business plans and performance results relating to the past, present or future business activities of such Party, its affiliates, subsidiaries and affiliated companies; (ii) plans for products or services, and customer or supplier lists; (iii) any scientific or technical information, invention, design, process, procedure, formula, improvement, technology or method; (iv) any concepts, reports, data, know-how, works-in-progress, designs, development tools, specifications, computer software, source code, object code, flow charts, databases, inventions, information and trade secrets; and (v) any other information that should reasonably be recognized as Confidential Information by the Disclosing Party.",
        },
      },
      {
        type: "clause",
        content: {
          title: "2. Obligations of Receiving Party",
          text: "The Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party. The Receiving Party shall carefully restrict access to Confidential Information to employees, contractors and third parties as is reasonably required and shall require those persons to sign nondisclosure restrictions at least as protective as those in this Agreement. The Receiving Party shall not, without prior written approval of the Disclosing Party, use for Receiving Party's own benefit, publish, copy, or otherwise disclose to others, or permit the use by others for their benefit or to the detriment of Disclosing Party, any Confidential Information.",
        },
      },
      {
        type: "clause",
        content: {
          title: "3. Term",
          text: "The nondisclosure provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until Disclosing Party sends Receiving Party written notice releasing Receiving Party from this Agreement, whichever occurs first.",
        },
      },
      {
        type: "signature",
        content: {
          signer1Name: "[Party A Signatory Name]",
          signer1Role: "[Party A Signatory Title]",
          signer2Name: "[Party B Signatory Name]",
          signer2Role: "[Party B Signatory Title]",
        },
      },
    ],
  },
];
