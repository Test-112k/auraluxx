
import { useState } from 'react';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatWindow } from './ChatWindow';
import { ChatButton } from './ChatButton';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    isTyping,
    inputText,
    setInputText,
    handleSendMessage,
    removeMessage,
    showRandomMessages,
    setShowRandomMessages,
    currentMessage,
  } = useAIChat();

  return (
    <>
      <ChatButton
        isOpen={isOpen}
        toggleChat={() => setIsOpen(!isOpen)}
        showSuggestions={showRandomMessages}
        hideSuggestions={() => setShowRandomMessages(false)}
        currentSuggestion={currentMessage}
      />

      {isOpen && (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
          removeMessage={removeMessage}
        />
      )}
    </>
  );
};

export default AIChatbot;
