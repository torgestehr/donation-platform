import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function OrganizationPage() {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/signin');
    }

    const { data: org } = await supabase
        .from('organizations')
        .select('id, name, mission, description, is_approved, created_at, updated_at')
        .eq('owner_id', user.id)
        .maybeSingle();

    if (!org) {
        redirect('/organization/new');
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl">{org.name}</CardTitle>
                                <CardDescription className="mt-1">Created {new Date(org.created_at!).toLocaleString()}</CardDescription>
                            </div>
                            <span
                                className={
                                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ' +
                                    (org.is_approved
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200')
                                }
                            >
                                {org.is_approved ? 'Approved' : 'Pending approval'}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="text-sm text-muted-foreground">Mission</div>
                            <p className="mt-1 whitespace-pre-wrap">{org.mission}</p>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Description</div>
                            <p className="mt-1 whitespace-pre-wrap">{org.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Last updated {new Date(org.updated_at!).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


