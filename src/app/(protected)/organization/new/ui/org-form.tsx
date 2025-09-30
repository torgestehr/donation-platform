"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function OrgForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [mission, setMission] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, mission, description })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Failed to create organization');
            }
            router.push('/organization');
            router.refresh();
        } catch (err: any) {
            setError(err?.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
                <Label htmlFor="name">Organization name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="mission">Mission statement</Label>
                <Input id="mission" value={mission} onChange={(e) => setMission(e.target.value)} required disabled={loading} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? 'Creating…' : 'Create organization'}
            </Button>
        </form>
    );
}


