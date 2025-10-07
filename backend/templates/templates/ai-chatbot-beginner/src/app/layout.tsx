import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ai Chatbot Beginner',
  description: 'Ai Chatbot Beginner template for SquadBox',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
