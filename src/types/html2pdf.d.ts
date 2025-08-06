declare module 'html2pdf.js' {
  interface Html2PdfOptions {
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

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement): Html2Pdf;
    toPdf(): Html2Pdf;
    toCanvas(): Promise<HTMLCanvasElement>;
    toImg(): Promise<HTMLImageElement>;
    toPdf(): Html2Pdf;
    toCanvas(): Promise<HTMLCanvasElement>;
    toImg(): Promise<HTMLImageElement>;
    save(filename?: string): Promise<void>;
    outputPdf(type: string, options?: any): Promise<Blob>;
  }

  const html2pdf: () => Html2Pdf;
  export default html2pdf;
}
