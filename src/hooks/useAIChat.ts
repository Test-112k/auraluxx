
import { useState, useEffect } from 'react';
import { callGeminiAPI } from '@/services/chatbotService';
import type { Message } from '@/types/chatbot';

const engagingMessages = [
  // Movie & TV Show Suggestions
  "🎬 **Suggest 10 horror movies** that will keep me awake tonight! I dare you...",
  "🍿 **What are the best comedy movies from 2023** to watch when I need a good laugh?",
  "💕 **Recommend romantic movies** perfect for a cozy date night!",
  "🚀 **Show me action-packed movies** with epic fight scenes and explosions!",
  "🇰🇷 **What K-dramas** are trending right now? I'm ready to binge!",
  "🍜 **Suggest anime series** that will make me question reality!",
  "✨ **Tell me your favorite actor**, and I'll find their best movies for you!",
  "🤔 **Feeling indecisive?** Give me a genre and a decade, and I'll find a hidden gem!",
  "🎉 **Planning a movie night?** Let me know who you're watching with, and I'll suggest the perfect film!",
  "🌟 **What are the top-rated movies of all time** everyone's talking about?",
  "🎨 **Recommend indie films from the 90s** that will expand my artistic horizons!",
  "🎊 **Show me feel-good movies** that will brighten my day!",
  "🕰️ **What were the best movies of 2010?** Let's take a trip down memory lane!",
  "👽 **Find me the best sci-fi movies** with mind-bending plots.",
  "🏆 **Show me some award-winning dramas** that are critically acclaimed.",
  "🕵️ **Suggest a mystery movie** with a twist I won't see coming.",
  "📜 **What are some good historical dramas from the last 5 years?**",

  // Auraluxx Platform Help
  "🎭 **Help me find movies** from my country - I want to watch local content!",
  "🔍 **How do I search** for movies with subtitles in my language?",
  "💡 **Did you know?** You can find movies from your home country in the **Regional** section. **Ask me how!**",
  "⚙️ **Having trouble with a video?** Try switching the server in the player. **Ask me for other troubleshooting tips!**",
  "💬 **Need to report an issue or get fast help?** Join our Telegram channel! **Ask me for the link!**",
  "🎯 **Find me something to watch** - I'm feeling adventurous today!",

  // Jokes & Fun Prompts
  "😂 Why did the movie go to therapy? Because it had too many plot twists! **Ask me anything!**",
  "😂 Why don't scientists trust atoms? Because they make up everything! ...Just like a good movie plot. **Ask me for a recommendation!**",
  "😂 What do you call a fake noodle? An Impasta! Speaking of which, want to find a movie that's the real deal? **Just ask!**",
  "🎪 I've got more movie recommendations than Netflix has categories! **What's your mood?**",
  "🤖 I'm basically a movie encyclopedia with a sense of humor! **Try me with a year and genre!**",
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
  const [currentMessage, setCurrentMessage] = useState(engagingMessages[0]);

  useEffect(() => {
    if (!showRandomMessages) return;
    
    const interval = setInterval(() => {
      setCurrentMessage(engagingMessages[Math.floor(Math.random() * engagingMessages.length)]);
    }, 5000); // Changed to 5 seconds for more variety
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
