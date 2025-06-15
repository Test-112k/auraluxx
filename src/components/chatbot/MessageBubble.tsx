
import { X, Bot, User } from 'lucide-react';
import type { Message } from '@/types/chatbot';

interface MessageBubbleProps {
  message: Message;
  removeMessage: (id: number) => void;
}

const formatMessage = (text: string) => {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/\n/g, '<br>');
  return formatted;
};

export const MessageBubble = ({ message, removeMessage }: MessageBubbleProps) => (
  <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
    <div
      className={`max-w-[85%] p-3 md:p-4 rounded-2xl relative group shadow-lg transition-all duration-200 hover:shadow-xl ${
        message.isBot
          ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
          : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
      }`}
    >
      <div className="flex items-start space-x-2 md:space-x-3">
        {message.isBot && (
          <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-1 mt-1 flex-shrink-0">
            <Bot size={12} className="md:size-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
        <div 
          className="text-xs md:text-sm leading-relaxed flex-1"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
        />
        {!message.isBot && (
          <div className="bg-white/20 rounded-full p-1 mt-1 flex-shrink-0">
            <User size={12} className="md:size-3.5" />
          </div>
        )}
      </div>
      <button
        onClick={() => removeMessage(message.id)}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
        title="Remove message"
      >
        <X size={10} className="md:size-3" />
      </button>
    </div>
  </div>
);
