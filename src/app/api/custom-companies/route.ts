import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

async function getUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, encodedKey);
        return payload.id as string;
    } catch { return null; }
}

export async function GET() {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const companies = await prisma.customCompany.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(companies.map(c => ({
        id: c.id,
        name: c.name,
        website: c.website,
        description: c.description,
        industry: c.industry,
        stage: c.stage,
        hq: c.hq,
        founded: c.founded,
        status: c.status as 'new' | 'viewed' | 'contacted',
        tags: JSON.parse(c.tagsJson),
    })));
}

export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { company, enrichmentData } = await request.json();

    const created = await prisma.customCompany.upsert({
        where: { id: company.id },
        create: {
            id: company.id,
            userId,
            name: company.name,
            website: company.website,
            description: company.description || '',
            industry: company.industry || 'Unknown',
            stage: company.stage || 'Unknown',
            hq: company.hq || 'Unknown',
            founded: company.founded || 'Unknown',
            tagsJson: JSON.stringify(company.tags || []),
            enrichmentJson: JSON.stringify(enrichmentData || {}),
            status: company.status || 'new',
        },
        update: {
            enrichmentJson: JSON.stringify(enrichmentData || {}),
        },
    });

    return NextResponse.json({ id: created.id });
}

export async function DELETE(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    await prisma.customCompany.deleteMany({ where: { id, userId } });
    return NextResponse.json({ success: true });
}
