import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
            <div className="text-center space-y-6 px-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Welcome to Donation Platform</h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Support your favorite causes and make a difference today</p>
                <div className="flex gap-4 justify-center pt-4">
                    <Button asChild size="lg">
                        <Link href="/signin">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}


