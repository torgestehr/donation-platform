import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Donation Platform',
    description: 'Support your favorite causes'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
