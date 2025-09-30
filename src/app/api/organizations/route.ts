import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const name = (body?.name ?? '').trim();
        const mission = (body?.mission ?? '').trim();
        const description = (body?.description ?? '').trim();

        if (!name || !mission || !description) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Enforce one organization per user at application level (RLS + unique constraint also enforce)
        const { data: existingOrg, error: existingErr } = await supabase
            .from('organizations')
            .select('id')
            .eq('owner_id', user.id)
            .maybeSingle();

        if (existingErr) {
            return NextResponse.json({ error: existingErr.message }, { status: 500 });
        }

        if (existingOrg) {
            return NextResponse.json({ error: 'You already created an organization' }, { status: 409 });
        }

        const { data, error } = await supabase
            .from('organizations')
            .insert({ owner_id: user.id, name, mission, description })
            .select('*')
            .single();

        if (error) {
            // Unique violation or other DB errors
            const status = error.code === '23505' ? 409 : 400;
            return NextResponse.json({ error: error.message }, { status });
        }

        return NextResponse.json({ organization: data }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
    }
}


