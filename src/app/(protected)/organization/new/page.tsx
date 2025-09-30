import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgForm } from './ui/org-form';

export default async function NewOrganizationPage() {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/signin');
    }

    // If user already has an org, redirect (UI safeguard; API also enforces)
    const { data: existing } = await supabase.from('organizations').select('id').eq('owner_id', user.id).maybeSingle();
    if (existing) {
        redirect('/organization');
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Create organization</CardTitle>
                        <CardDescription>Provide your org details for review and approval.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrgForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


