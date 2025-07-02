
import { useState, useEffect } from 'react';
import { callGeminiAPI } from '@/services/chatbotService';
import type { Message } from '@/types/chatbot';

const engagingMessages = [
  // Movie & TV Show Suggestions - Enhanced
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
  
  // New Enhanced Movie Recommendations
  "🎭 **I'm in the mood for a psychological thriller** - recommend something that will mess with my mind!",
  "🌍 **Show me the best foreign films** that won major awards recently!",
  "🔥 **What are the most underrated movies** that deserve more recognition?",
  "🎪 **Suggest some quirky indie comedies** that are completely off the beaten path!",
  "🌙 **I want to watch something dark and atmospheric** - what do you recommend?",
  "🎸 **Find me movies about music** that will give me all the feels!",
  "🚗 **Recommend action movies with incredible car chases** - I need some adrenaline!",
  "🎯 **What are the best plot twist movies** that no one sees coming?",
  "🏰 **Show me epic fantasy movies** with amazing world-building!",
  "🤖 **Suggest AI/robot movies** that explore what it means to be human!",
  "🌊 **I love ocean/water-themed movies** - what are your favorites?",
  "🎪 **Find me movies about circuses or carnivals** - I love that eerie atmosphere!",
  "🍕 **What are the best food movies** that will make me hungry?",
  "🎮 **Recommend movies based on video games** that actually don't suck!",
  "🚀 **Show me space movies** with stunning visuals and great stories!",
  "🕷️ **I want superhero movies** that are darker and more mature!",
  "🎨 **Find me visually stunning movies** that are works of art!",
  "🏃 **Suggest movies about sports** that inspire and motivate!",
  "🎪 **What are the weirdest movies** you can recommend? I love strange cinema!",
  "🌟 **Show me coming-of-age movies** that capture the essence of growing up!",

  // Auraluxx Platform Help - Enhanced
  "🎭 **Help me find movies** from my country - I want to watch local content!",
  "🔍 **How do I search** for movies with subtitles in my language?",
  "💡 **Did you know?** You can find movies from your home country in the **Regional** section. **Ask me how!**",
  "⚙️ **Having trouble with a video?** Try switching the server in the player. **Ask me for other troubleshooting tips!**",
  "💬 **Need to report an issue or get fast help?** Join our Telegram channel! **Ask me for the link!**",
  "🎯 **Find me something to watch** - I'm feeling adventurous today!",
  "🌍 **Want to explore world cinema?** I can guide you through different countries' best films!",
  "🔥 **Looking for what's trending?** Ask me about the hottest releases right now!",
  "📱 **New to Auraluxx?** Let me show you all the cool features you might have missed!",
  "🎬 **Can't decide what to watch?** Tell me your mood and I'll find the perfect match!",

  // Fun & Interactive Prompts - Enhanced
  "😂 Why did the movie go to therapy? Because it had too many plot twists! **Ask me anything!**",
  "😂 Why don't scientists trust atoms? Because they make up everything! ...Just like a good movie plot. **Ask me for a recommendation!**",
  "😂 What do you call a fake noodle? An Impasta! Speaking of which, want to find a movie that's the real deal? **Just ask!**",
  "🎪 I've got more movie recommendations than Netflix has categories! **What's your mood?**",
  "🤖 I'm basically a movie encyclopedia with a sense of humor! **Try me with a year and genre!**",
  "🎲 **Let's play a game!** Give me three random words and I'll find a movie that connects them all!",
  "🧙 **I'm your movie genie!** Make three wishes for different genres and I'll grant them!",
  "🎯 **Movie trivia time!** Ask me about any actor and I'll tell you their most underrated film!",
  "🍿 **Popcorn ready?** Tell me your favorite snack and I'll match it with the perfect movie!",
  "🎬 **Director's cut or theatrical?** Ask me about any filmmaker and their best work!",
  "🌟 **Star power!** Name any celebrity crush and I'll find their most swoon-worthy movies!",
  "🎪 **Feeling like a movie critic?** Let's discuss what makes a film truly great!",
  "🎭 **Method acting or natural talent?** Let's chat about the best performances ever!",
  "🏆 **Oscar worthy!** Want to know which films deserved awards but didn't get them?**",
  "🎨 **Cinematography magic!** Ask me about the most visually stunning films ever made!**",
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
