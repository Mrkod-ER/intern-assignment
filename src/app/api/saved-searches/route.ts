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
        return (payload.id || payload.userId) as string;
    } catch { return null; }
}

export async function GET() {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searches = await prisma.savedSearch.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(searches.map((s: any) => ({
        id: s.id,
        query: s.query,
        filters: JSON.parse(s.filtersJson),
        createdAt: s.createdAt.getTime(),
    })));
}

export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { query, filters } = await request.json();

    const search = await prisma.savedSearch.create({
        data: {
            userId,
            query: query || '',
            filtersJson: JSON.stringify(filters || {}),
        },
    });

    return NextResponse.json({
        id: search.id,
        query: search.query,
        filters: JSON.parse(search.filtersJson),
        createdAt: search.createdAt.getTime(),
    });
}

export async function DELETE(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();
    await prisma.savedSearch.deleteMany({ where: { id, userId } });
    return NextResponse.json({ success: true });
}
