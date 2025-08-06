// This interface is used to type the html2pdf options
interface PdfOptions {
  margin?: number | [number, number, number, number];
  filename?: string;
  image?: {
    type?: string;
    quality?: number;
  };
  html2canvas?: {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
  };
  jsPDF?: {
    unit?: string;
    format?: string | number[];
    orientation?: 'portrait' | 'landscape';
  };
}

import { pdf, DocumentProps as ReactPdfDocumentProps } from '@react-pdf/renderer';

type ReactElement = React.ReactElement<ReactPdfDocumentProps>;

export const generatePdf = async (element: ReactElement): Promise<Blob> => {
  try {
    // Generate the PDF blob
    const pdfInstance = pdf(element);
    const pdfBlob = await pdfInstance.toBlob();
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

// Utility function to download a blob as a file
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const openPdfInNewTab = async (element: ReactElement): Promise<void> => {
  try {
    // Generate the PDF blob
    const pdfInstance = pdf(element);
    const pdfBlob = await pdfInstance.toBlob();
    
    // Open in new tab
    const blobUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(blobUrl, '_blank');
    
    // Revoke the blob URL after the window is closed
    if (newWindow) {
      newWindow.onbeforeunload = () => {
        URL.revokeObjectURL(blobUrl);
      };
    } else {
      // Fallback in case window.open is blocked
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    }
  } catch (error) {
    console.error('Error opening PDF in new tab:', error);
    throw new Error('Failed to open PDF in new tab');
  }
};
