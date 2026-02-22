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

// DELETE a list
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.list.deleteMany({ where: { id, userId } });
    return NextResponse.json({ success: true });
}

// PATCH add/remove company from list
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: listId } = await params;
    const { companyId, action } = await request.json();

    // Verify list belongs to user
    const list = await prisma.list.findFirst({ where: { id: listId, userId } });
    if (!list) return NextResponse.json({ error: 'List not found' }, { status: 404 });

    if (action === 'add') {
        await prisma.listCompany.upsert({
            where: { listId_companyId: { listId, companyId } },
            create: { listId, companyId },
            update: {},
        });
    } else if (action === 'remove') {
        await prisma.listCompany.deleteMany({ where: { listId, companyId } });
    }

    return NextResponse.json({ success: true });
}
