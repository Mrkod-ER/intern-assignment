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

export async function GET(_req: Request, { params }: { params: Promise<{ companyId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { companyId } = await params;
    const note = await prisma.note.findUnique({
        where: { userId_companyId: { userId, companyId } },
    });

    return NextResponse.json({ content: note?.content || '' });
}

export async function POST(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { companyId } = await params;
    const { content } = await request.json();

    await prisma.note.upsert({
        where: { userId_companyId: { userId, companyId } },
        create: { userId, companyId, content: content || '' },
        update: { content: content || '' },
    });

    return NextResponse.json({ success: true });
}
