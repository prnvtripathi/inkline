import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Define DocumentType enum to match Prisma schema
const DocumentType = {
  INVOICE: 'invoice',
  CONTRACT: 'contract',
  SOW: 'SOW',
  NDA: 'NDA'
} as const;

type DocumentType = typeof DocumentType[keyof typeof DocumentType];

type TemplateData = {
  name: string;
  description?: string;
  type: DocumentType;
  blocks: any[];
};

// GET /api/templates - List all templates for the current user
export async function GET() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const templates = await prisma.template.findMany({
      where: { 
        user: { 
          email: session.user.email as string 
        } 
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// POST /api/templates - Create a new template
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, type, blocks } = body as TemplateData;
    
    if (!name || !type || !blocks) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Validate document type
    if (!Object.values(DocumentType).includes(type as DocumentType)) {
      return new NextResponse('Invalid document type', { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        name,
        description: description || null,
        type: type as DocumentType,
        blocks,
        userId: user.id,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}