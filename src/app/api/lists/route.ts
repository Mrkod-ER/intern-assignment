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
    } catch {
        return null;
    }
}

// GET all lists for user
export async function GET() {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const lists = await prisma.list.findMany({
        where: { userId },
        include: { companies: true },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(lists.map(l => ({
        id: l.id,
        name: l.name,
        createdAt: l.createdAt.getTime(),
        companyIds: l.companies.map(c => c.companyId),
    })));
}

// POST create a new list
export async function POST(request: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const list = await prisma.list.create({
        data: { name: name.trim(), userId },
        include: { companies: true },
    });

    return NextResponse.json({
        id: list.id,
        name: list.name,
        createdAt: list.createdAt.getTime(),
        companyIds: [],
    });
}
