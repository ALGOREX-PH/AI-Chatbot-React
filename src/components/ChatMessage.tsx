import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  onPlay?: () => void;
}

export function ChatMessage({ message, isBot, onPlay }: ChatMessageProps) {
  return (
    <div
      className={`flex gap-3 p-4 ${
        isBot ? 'bg-gray-50' : 'bg-white'
      } rounded-lg`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {isBot ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
      {isBot && onPlay && (
        <button
          onClick={onPlay}
          className="text-blue-600 hover:text-blue-700 transition-colors"
          title="Play message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>
      )}
    </div>
  );
}