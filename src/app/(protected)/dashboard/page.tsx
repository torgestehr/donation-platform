import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome back, {user.user_metadata?.full_name || user.email}!</p>
                    </div>
                    <form action="/api/auth/signout" method="post">
                        <Button type="submit" variant="outline">
                            Sign Out
                        </Button>
                    </form>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Donations</CardTitle>
                            <CardDescription>Your donation history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">$0.00</div>
                            <p className="text-sm text-muted-foreground mt-2">No donations yet</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Campaigns</CardTitle>
                            <CardDescription>Campaigns you're supporting</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0</div>
                            <p className="text-sm text-muted-foreground mt-2">Start supporting causes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Impact</CardTitle>
                            <CardDescription>Your contribution impact</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0</div>
                            <p className="text-sm text-muted-foreground mt-2">Lives impacted</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <span className="font-medium">Email:</span> {user.email}
                        </div>
                        <div>
                            <span className="font-medium">User ID:</span> {user.id}
                        </div>
                        <div>
                            <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


