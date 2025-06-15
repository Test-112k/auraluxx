
import { useState, useEffect } from 'react';
import { callGeminiAPI } from '@/services/chatbotService';
import type { Message } from '@/types/chatbot';

const humorousMessages = [
  "I've seen more plot twists than a pretzel factory! 🥨 What kind of movie are you in the mood for?",
  "Don't know what to watch? I'm your movie GPS, navigating you to your next binge! 🗺️",
  "I'm fluent in over six million forms of communication... and movie genres! Ask me for a recommendation! 🤖",
  "Let's find a movie so good, you'll want to give it a standing ovation from your couch! 👏",
  "Searching for a hidden gem? I'm your treasure map to the best content on Auraluxx! 💎",
  "Why did the TV get glasses? To improve its screen time! 🤓 Let's find you something to watch!",
  "I'm here to help you find something to watch. My services are... *free* of charge. Get it? 😉",
];

const initialMessage: Message = {
  id: 1,
  text: "Hello! 👋 I'm **Auraluxx AI**, your dedicated entertainment assistant for the **Auraluxx** streaming platform.\n\nI can help you with:\n\n🎬 **Movie & TV Show** recommendations\n📺 **How to watch** content from your country\n🌍 **Finding dubbed content** in your language\n🔍 **Searching tips** and navigation help\n📱 **Platform features** and troubleshooting\n💬 **Contact support** via Telegram\n\nWhat would you like to know about Auraluxx today?",
  isBot: true,
  timestamp: new Date()
};

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRandomMessages, setShowRandomMessages] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(humorousMessages[0]);

  useEffect(() => {
    if (!showRandomMessages) return;
    
    const interval = setInterval(() => {
      setCurrentMessage(humorousMessages[Math.floor(Math.random() * humorousMessages.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [showRandomMessages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');
    setIsTyping(true);
    
    try {
      const response = await callGeminiAPI(messageText);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "🤖 I'm having trouble right now. **Join our Telegram** for instant support: https://t.me/auralux1\n\nOur team will help you within **1 hour**! 🚀",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const removeMessage = (messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return {
    messages,
    inputText,
    isTyping,
    showRandomMessages,
    currentMessage,
    setInputText,
    handleSendMessage,
    removeMessage,
    setShowRandomMessages,
  };
};
