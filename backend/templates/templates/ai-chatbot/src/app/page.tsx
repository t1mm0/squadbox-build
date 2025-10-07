/**
 * Ai Chatbot - Main Page
 * Purpose: Entry point for the ai-chatbot template
 * Last Modified: 2025-01-31
 * Completeness: 100/100
 */

import dynamic from 'next/dynamic';

const ChatbotInterface = dynamic(() => import('../components/ChatbotInterface'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading chatbot...</div>
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Ai Chatbot</h1>
        <ChatbotInterface />
      </div>
    </div>
  );
}
