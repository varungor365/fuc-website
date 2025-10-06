import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fashun Profile',
  description: 'Your link in bio page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
