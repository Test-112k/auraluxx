
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatButtonProps {
  isOpen: boolean;
  toggleChat: () => void;
  showSuggestions: boolean;
  hideSuggestions: () => void;
  currentSuggestion: string;
}

const formatMessage = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

export const ChatButton = ({
  isOpen,
  toggleChat,
  showSuggestions,
  hideSuggestions,
  currentSuggestion,
}: ChatButtonProps) => (
  <div className="fixed bottom-6 left-4 md:left-6 z-50">
    <div className="flex flex-col items-start space-y-3">
      {showSuggestions && (
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white px-4 py-3 md:px-5 md:py-4 rounded-2xl text-xs md:text-sm opacity-95 max-w-72 md:max-w-80 shadow-2xl border border-white/20 relative backdrop-blur-sm">
          <button
            onClick={hideSuggestions}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs shadow-lg transition-all duration-200 hover:scale-110"
            title="Stop suggestions"
          >
            <X size={12} className="md:hidden" />
            <X size={14} className="hidden md:block" />
          </button>
          <div
            className="font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMessage(currentSuggestion) }}
          />
          <div className="mt-2 text-xs opacity-75">
            💡 Click me to start chatting!
          </div>
        </div>
      )}
      <Button
        onClick={toggleChat}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full w-14 h-14 md:w-16 md:h-16 shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm relative"
        size="icon"
      >
        {isOpen ? <X size={24} className="md:size-7" /> : <MessageCircle size={24} className="md:size-7" />}
        {!isOpen && showSuggestions && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        )}
      </Button>
    </div>
  </div>
);
