'use client';

import React, { useState } from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    PDFViewer,
    type DocumentProps
} from '@react-pdf/renderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Download, Eye } from 'lucide-react';
import { generatePdf, openPdfInNewTab, downloadBlob } from '@/lib/pdf-utils';
import type { Block } from '@/lib/types';
import { HeaderBlock } from '../blocks/header-block';
import { LineItemBlock } from '../blocks/line-item-block';
import { ClauseBlock } from '../blocks/clause-block';
import { SignatureBlock } from '../blocks/signature-block';

// Register fonts
Font.register({
    family: 'Inter',
    src: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2',
});

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
    },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottom: '1px solid #e2e8f0',
        width: '100%',
    },
    content: {
        flex: 1,
        width: '100%',
    },
    block: {
        marginBottom: 16,
        padding: 12,
        border: '1px solid #e2e8f0',
        borderRadius: 4,
        backgroundColor: '#ffffff',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1a202c',
    },
    viewer: {
        width: '100%',
        height: '80vh',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
} as const);

interface DocumentPdfProps extends DocumentProps {
    title: string;
    blocks: Block[];
    onUpdateBlock: (blockId: string, newContent: any) => void;
}

// Type for block component props
interface BlockComponentProps {
    block: Omit<Block, 'id'> & { id: string };
    onChange: (content: any) => void;
    className?: string;
    style?: React.CSSProperties;
}

// Simple block renderer component
export const BlockRenderer = ({
    block,
    onUpdateBlock,
}: {
    block: Block;
    onUpdateBlock: (id: string, content: any) => void;
}) => {
    // Return null for invalid blocks
    if (!block?.id) {
        console.warn('BlockRenderer received an invalid block:', block);
        return null;
    }

    const commonProps: BlockComponentProps = {
        block: {
            ...block,
            id: block.id.toString(),
        },
        onChange: (content: any) => onUpdateBlock(block.id, content),
    };

    // Render the appropriate block component based on type
    try {
        const blockProps = {
            ...commonProps,
            block: {
                ...commonProps.block,
                // Ensure required fields are present
                content: commonProps.block.content || {},
            },
        };

        switch (block.type) {
            case 'header':
                return <HeaderBlock {...blockProps} />;
            case 'lineItems':
                return <LineItemBlock {...blockProps} />;
            case 'clause':
                return <ClauseBlock {...blockProps} />;
            case 'signature':
                return <SignatureBlock {...blockProps} />;
            default:
                console.warn(`Unknown block type: ${(block as Block).type}`);
                return null;
        }
    } catch (error) {
        console.error(`Error rendering block type ${block?.type}:`, error);
        return null;
    }
};

export const PdfDocument: React.FC<DocumentPdfProps> = ({
    title = 'Untitled Document',
    blocks = [],
    onUpdateBlock = () => { },
    ...restProps
}) => {
    // Filter out any invalid blocks with proper type safety
    const validBlocks = React.useMemo(() =>
        blocks.filter((block): block is Block =>
            block != null &&
            typeof block === 'object' &&
            'id' in block &&
            'type' in block
        ),
        [blocks]
    );

    // Log any filtered out invalid blocks
    React.useEffect(() => {
        if (validBlocks.length !== blocks.length) {
            console.warn(
                'Some blocks were filtered out during PDF rendering. ' +
                `Total blocks: ${blocks.length}, Valid blocks: ${validBlocks.length}`
            );
        }
    }, [blocks.length, validBlocks.length]);

    return (
        <Document {...restProps}>
            <Page size="A4" style={styles.page} wrap>
                <View style={styles.container}>
                    {/* Document Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    {/* Document Content */}
                    <View style={styles.content}>
                        {validBlocks.length > 0 ? (
                            validBlocks.map((block) => (
                                <View key={block.id} style={styles.block}>
                                    <BlockRenderer
                                        block={block}
                                        onUpdateBlock={onUpdateBlock}
                                    />
                                </View>
                            ))
                        ) : (
                            <View style={{ padding: 20, textAlign: 'center' }}>
                                <Text>No content to display</Text>
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

// This is the main component that will be used in the app
export const DocumentPdf: React.FC<DocumentPdfProps> = ({
    title = 'Untitled Document',
    blocks = [],
    onUpdateBlock = () => { },
    ...props
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Handle PDF preview
    const handlePreview = React.useCallback(async () => {
        try {
            setIsGenerating(true);
            setError(null);
            await openPdfInNewTab(
                <PdfDocument
                    title={title}
                    blocks={blocks}
                    onUpdateBlock={onUpdateBlock}
                    {...props}
                />
            );
        } catch (err) {
            console.error('Failed to generate PDF preview:', err);
            setError('Failed to generate PDF preview. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }, [blocks, onUpdateBlock, props, title]);

    // Handle PDF download
    const handleDownload = React.useCallback(async () => {
        try {
            setIsGenerating(true);
            setError(null);
            const pdfBlob = await generatePdf(
                <PdfDocument
                    title={title}
                    blocks={blocks}
                    onUpdateBlock={onUpdateBlock}
                    {...props}
                />
            );
            downloadBlob(pdfBlob, `${title}.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            setError('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }, [blocks, onUpdateBlock, props, title]);

    // Don't render anything during SSR
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                    {error}
                </div>
            )}

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Generating...' : 'Preview PDF'}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Generating...' : 'Download PDF'}
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl h-[80vh] p-0">
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle>PDF Preview: {title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                        <PDFViewer style={styles.viewer}>
                            <PdfDocument
                                title={title}
                                blocks={blocks}
                                onUpdateBlock={onUpdateBlock}
                                {...props}
                            />
                        </PDFViewer>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export const PdfPreviewButton = ({
    title,
    blocks,
    onUpdateBlock,
}: DocumentPdfProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(true)}
                disabled={blocks.length === 0}
            >
                <Eye className="mr-2 h-4 w-4" />
                Preview PDF
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>PDF Preview</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-0">
                        <ScrollArea className="h-full w-full">
                            <div className="p-4">
                                <PDFViewer width="100%" height="100%" className="h-[70vh]">
                                    <PdfDocument
                                        title={title}
                                        blocks={blocks}
                                        onUpdateBlock={onUpdateBlock}
                                    />
                                </PDFViewer>
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
