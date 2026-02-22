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

    const thesis = await prisma.thesis.findUnique({ where: { userId } });
    return NextResponse.json(thesis ? JSON.parse(thesis.dataJson) : {});
}

export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    await prisma.thesis.upsert({
        where: { userId },
        create: { userId, dataJson: JSON.stringify(data) },
        update: { dataJson: JSON.stringify(data) },
    });

    return NextResponse.json({ success: true });
}
