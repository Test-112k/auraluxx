
import React, { useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import type { Message } from '@/types/chatbot';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  removeMessage: (id: number) => void;
}

export const ChatWindow = ({
  messages,
  isTyping,
  inputText,
  setInputText,
  handleSendMessage,
  removeMessage,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-28 left-4 md:left-6 right-4 md:right-auto md:w-80 lg:w-96 h-[70vh] md:h-[28rem] lg:h-[32rem] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 flex flex-col overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 md:p-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-full p-1.5 md:p-2">
              <Bot size={20} className="md:size-6" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">Auraluxx AI</h3>
              <p className="text-xs md:text-sm opacity-90">Platform Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs opacity-75">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} removeMessage={removeMessage} />
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-2">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-1.5 flex-shrink-0">
                <Bot size={14} className="md:size-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-3 md:p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex space-x-2 md:space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about movies, platform help..."
            className="flex-1 px-3 py-2 md:px-4 md:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl px-3 md:px-4 shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
            size="icon"
          >
            <Send size={16} className="md:size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
