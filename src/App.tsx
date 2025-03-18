import React, { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { chat } from './lib/gemini';
import { textToSpeech } from './lib/elevenlabs';
import { ChatMessage } from './components/ChatMessage';

interface Message {
  text: string;
  isBot: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await chat(userMessage);
      setMessages((prev) => [...prev, { text: response, isBot: true }]);

      // Generate audio for the response
      const audioBuffer = await textToSpeech(response);
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrls((prev) => ({ ...prev, [response]: url }));
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, there was an error processing your request.',
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (message: string) => {
    if (audioRef.current && audioUrls[message]) {
      audioRef.current.src = audioUrls[message];
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Meer Chat Assistant</h1>
          <p className="text-gray-600">Powered by Gemini AI and ElevenLabs</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isBot={message.isBot}
                onPlay={message.isBot ? () => playAudio(message.text) : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 p-4 flex gap-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={20} />
              Send
            </button>
          </form>
        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}

export default App;