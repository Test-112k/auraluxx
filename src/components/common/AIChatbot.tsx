import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { searchMulti, getTrending, getPopular, getTopRated } from '@/services/tmdbApi';
import { encryptKey, decryptKey } from '@/utils/encryption';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRandomMessages, setShowRandomMessages] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 I'm **Auraluxx AI**, your dedicated entertainment assistant for the **Auraluxx** streaming platform.\n\nI can help you with:\n\n🎬 **Movie & TV Show** recommendations\n📺 **How to watch** content from your country\n🌍 **Finding dubbed content** in your language\n🔍 **Searching tips** and navigation help\n📱 **Platform features** and troubleshooting\n💬 **Contact support** via Telegram\n\nWhat would you like to know about Auraluxx today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Encrypted Gemini API key
  const encryptedApiKey = encryptKey('AIzaSyAo42hUfi5ZwJSidDaC92OqbAqZQL4Egh4');

  const humorousMessages = [
    "I've seen more plot twists than a pretzel factory! 🥨 What kind of movie are you in the mood for?",
    "Don't know what to watch? I'm your movie GPS, navigating you to your next binge! 🗺️",
    "I'm fluent in over six million forms of communication... and movie genres! Ask me for a recommendation! 🤖",
    "Let's find a movie so good, you'll want to give it a standing ovation from your couch! 👏",
    "Searching for a hidden gem? I'm your treasure map to the best content on Auraluxx! 💎",
    "Why did the TV get glasses? To improve its screen time! 🤓 Let's find you something to watch!",
    "I'm here to help you find something to watch. My services are... *free* of charge. Get it? 😉",
  ];

  const [currentMessage, setCurrentMessage] = useState(humorousMessages[0]);

  useEffect(() => {
    if (!showRandomMessages) return;
    
    const interval = setInterval(() => {
      setCurrentMessage(humorousMessages[Math.floor(Math.random() * humorousMessages.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [showRandomMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isWebsiteOrEntertainmentRelated = (message: string): boolean => {
    const websiteKeywords = [
      // Entertainment keywords
      'movie', 'movies', 'film', 'films', 'cinema',
      'tv', 'television', 'series', 'show', 'shows',
      'anime', 'manga', 'animation',
      'kdrama', 'k-drama', 'korean drama', 'korean',
      'watch', 'streaming', 'netflix', 'recommend',
      'horror', 'comedy', 'romance', 'action', 'thriller',
      'drama', 'sci-fi', 'fantasy', 'documentary',
      'trending', 'popular', 'best', 'top rated',
      'actor', 'actress', 'director', 'cast',
      'trailer', 'review', 'rating', 'imdb',
      // Website-specific keywords
      'auraluxx', 'website', 'platform', 'site',
      'search', 'find', 'country', 'regional', 'language',
      'dubbed', 'subtitle', 'server', 'flowcast', 'asiacloud',
      'telegram', 'support', 'help', 'how to', 'guide',
      'category', 'filter', 'player', 'video',
      'issue', 'problem', 'error', 'bug', 'report'
    ];
    
    const lowerMessage = message.toLowerCase();
    return websiteKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const getWebsiteResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // FAQ responses
    if (lowerMessage.includes('country') || lowerMessage.includes('regional') || lowerMessage.includes('local')) {
      return "🌍 **How to watch movies from your country:**\n\n**Method 1:** Try searching the movie directly in the **search bar** at the top\n\n**Method 2:** Go to **Regional category** and select your **country** to view local titles\n\n💡 **Tip:** Make sure your spelling is accurate for better search results!";
    }
    
    if (lowerMessage.includes('dubbed') || lowerMessage.includes('language') || lowerMessage.includes('subtitle')) {
      return "🎭 **How to watch dubbed content:**\n\n**Step 1:** Go to the **Regional category**\n**Step 2:** Select your **country**\n**Step 3:** Use **filters** to select your preferred **language**\n\n**Alternative:** Change the **server** in the video player:\n• **Flowcast**\n• **Asiacloud**\n• Other available servers\n\n🎯 This will show movies with your preferred language options!";
    }
    
    if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('cant find') || lowerMessage.includes("can't find")) {
      return "🔍 **Can't find the movie you want?**\n\n**Common solutions:**\n\n✅ **Check spelling** - Make sure it's accurate\n✅ **Try different search terms** - Use alternative titles\n✅ **Search directly** in the search bar\n✅ **Browse categories** - Movies, TV Series, Anime, K-Drama, Regional\n\n💡 **Pro tip:** Try searching by actor names or director if you can't find by title!";
    }
    
    if (lowerMessage.includes('telegram') || lowerMessage.includes('support') || lowerMessage.includes('contact')) {
      return "💬 **Get support via Telegram:**\n\n🔗 **Channel Link:** https://t.me/auralux1\n\n**What we offer:**\n• 🚀 **Quick support** - Issues fixed within 1 hour\n• 📢 **Latest updates** and announcements\n• 🎬 **New content** notifications\n• 💬 **Community discussions**\n\n**Stay with us forever!** 💜";
    }
    
    if (lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('report')) {
      return "🚨 **Facing issues? We're here to help!**\n\n**Quick fix steps:**\n1. **Refresh** the page\n2. **Clear browser cache**\n3. **Try different server** in video player\n4. **Check internet connection**\n\n**Still not working?**\n📱 **Report immediately** on Telegram: https://t.me/auralux1\n⚡ **We'll fix it within 1 hour!**\n\nOur team is always ready to help! 💪";
    }
    
    if (lowerMessage.includes('how') || lowerMessage.includes('guide') || lowerMessage.includes('help')) {
      return "🚀 **Auraluxx Platform Guide:**\n\n**🏠 Navigation:**\n• **Home** - Trending content\n• **Movies** - Latest films\n• **TV Series** - Binge-worthy shows\n• **Anime** - Japanese animation\n• **K-Drama** - Korean dramas\n• **Regional** - Local content by country\n\n**🔍 Search Tips:**\n• Use the **search bar** at the top\n• Try **exact movie titles**\n• Search by **actor/director names**\n\n**🎬 Watching:**\n• Click any title to **watch**\n• Change **servers** if needed\n• Use **filters** for language preferences\n\nNeed specific help? Just ask! 😊";
    }
    
    // Default website response
    return "🎬 **Welcome to Auraluxx!** I'm here to help you navigate our platform.\n\n**Popular questions:**\n• How to find movies from my country?\n• How to watch dubbed content?\n• Can't find a specific movie?\n• Need platform support?\n\n**Quick links:**\n📱 **Telegram Support:** https://t.me/auralux1\n🔍 **Search:** Use the search bar above\n🌍 **Regional Content:** Check the Regional category\n\nWhat specifically would you like help with?";
  };

  const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      const lowerMessage = message.toLowerCase();
      // Prioritize website-specific FAQ responses for quick, accurate answers.
      const faqKeywords = ['country', 'regional', 'dubbed', 'language', 'subtitle', 'find', 'search', "can't find", 'telegram', 'support', 'contact', 'issue', 'problem', 'error', 'bug', 'report', 'how', 'guide', 'auraluxx'];
      if (faqKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return getWebsiteResponse(message);
      }

      // For all other queries, use Gemini for a dynamic response.
      const apiKey = decryptKey(encryptedApiKey);
      const isEntertainmentQuery = isWebsiteOrEntertainmentRelated(message);

      const prompt = isEntertainmentQuery
        ? `You are Auraluxx AI, the expert assistant for the Auraluxx streaming platform. You help users with entertainment recommendations and platform navigation. Always mention Auraluxx when relevant. Be enthusiastic and format responses with **bold** for emphasis and bullet points. User request: ${message}`
        : `You are Auraluxx AI, a helpful and friendly assistant from the Auraluxx streaming platform. While your main focus is movies and entertainment, you are capable of answering general knowledge questions. Be friendly and helpful. User request: ${message}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response structure from Gemini API');
      }

    } catch (error) {
      console.error('API call error:', error);
      
      // If Gemini fails, fallback to TMDB for entertainment queries
      if (isWebsiteOrEntertainmentRelated(message)) {
        console.log("Gemini failed, falling back to TMDB for entertainment query.");
        return await generateTMDBResponse(message);
      }
      
      // For non-entertainment queries where Gemini fails, provide a support message.
      return "🤖 I'm having a little trouble connecting right now. Please try again in a moment. If the issue persists, you can **join our Telegram** for instant support: https://t.me/auralux1 🚀";
    }
  };

  const generateTMDBResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    try {
      let searchResults;
      let responseIntro = "";
      
      if (lowerMessage.includes('anime')) {
        searchResults = await searchMulti('anime');
        responseIntro = "🍜 Here are some **incredible anime** recommendations from Auraluxx:\n\n";
      } else if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
        searchResults = await searchMulti('korean drama');
        responseIntro = "🇰🇷 Check out these **amazing K-Drama** titles on Auraluxx:\n\n";
      } else if (lowerMessage.includes('horror')) {
        searchResults = await searchMulti('horror');
        responseIntro = "👻 Here are some **spine-chilling horror** picks on Auraluxx:\n\n";
      } else if (lowerMessage.includes('comedy')) {
        searchResults = await searchMulti('comedy');
        responseIntro = "😂 Enjoy these **comedy gems** available on Auraluxx:\n\n";
      } else if (lowerMessage.includes('romance')) {
        searchResults = await searchMulti('romance');
        responseIntro = "💕 Fall in love with these **romantic movies** on Auraluxx:\n\n";
      } else if (lowerMessage.includes('action')) {
        searchResults = await searchMulti('action');
        responseIntro = "💥 Get your adrenaline pumping with these **action movies** on Auraluxx:\n\n";
      } else if (lowerMessage.includes('movie')) {
        searchResults = await getPopular('movie');
        responseIntro = "🎬 Here are **popular movies** currently trending on Auraluxx:\n\n";
      } else if (lowerMessage.includes('tv') || lowerMessage.includes('series')) {
        searchResults = await getPopular('tv');
        responseIntro = "📺 Binge-watch these **popular TV series** on Auraluxx:\n\n";
      } else if (lowerMessage.includes('trending')) {
        searchResults = await getTrending('all', 'week');
        responseIntro = "🔥 Here's what's **trending now** on Auraluxx:\n\n";
      } else {
        searchResults = await searchMulti(userMessage);
        responseIntro = "🎯 Based on your search, here's what I found on **Auraluxx**:\n\n";
      }
      
      if (searchResults?.results && searchResults.results.length > 0) {
        const recommendations = searchResults.results.slice(0, 5);
        let response = responseIntro;
        
        recommendations.forEach((item: any, index: number) => {
          const title = item.title || item.name;
          const year = item.release_date || item.first_air_date;
          const yearText = year ? ` *(${year.split('-')[0]})*` : '';
          const rating = item.vote_average ? ` - ⭐ **${item.vote_average.toFixed(1)}/10**` : '';
          const overview = item.overview ? `\n   ${item.overview.slice(0, 100)}...` : '';
          response += `**${index + 1}.** **${title}**${yearText}${rating}${overview}\n\n`;
        });
        
        return response + "✨ **Find these on Auraluxx!** Use the search bar or browse categories for more!";
      } else {
        return "🤖 I couldn't find specific results for that search on **Auraluxx**. Try:\n\n🔍 **Search directly** in the search bar\n📂 **Browse categories** (Movies, TV, Anime, K-Drama)\n🌍 **Check Regional** section for local content\n\n**Need help?** Ask me how to find specific content!";
      }
    } catch (error) {
      console.error('TMDB API error:', error);
      return "🤖 I'm experiencing technical difficulties. **Join our Telegram** for instant support: https://t.me/auralux1\n\nOur team will help you within **1 hour**! 🚀";
    }
  };

  const formatMessage = (text: string) => {
    // Convert markdown-style formatting to HTML
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/~~(.*?)~~/g, '<del>$1</del>') // Strikethrough
      .replace(/\n/g, '<br>'); // Line breaks
    
    return formatted;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
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
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "🤖 I'm having trouble right now. **Join our Telegram** for instant support: https://t.me/auralux1\n\nOur team will help you within **1 hour**! 🚀",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeMessage = (messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return (
    <>
      {/* Chat Button - Responsive positioning */}
      <div className="fixed bottom-6 left-4 md:left-6 z-50">
        <div className="flex flex-col items-start space-y-3">
          {/* Professional suggestion message */}
          {showRandomMessages && (
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white px-4 py-3 md:px-5 md:py-4 rounded-2xl text-xs md:text-sm opacity-95 max-w-64 md:max-w-72 shadow-2xl border border-white/20 relative backdrop-blur-sm">
              <button
                onClick={() => setShowRandomMessages(false)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs shadow-lg transition-all duration-200 hover:scale-110"
                title="Stop suggestions"
              >
                <X size={12} className="md:hidden" />
                <X size={14} className="hidden md:block" />
              </button>
              <div 
                className="font-medium leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatMessage(currentMessage) }}
              />
            </div>
          )}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full w-14 h-14 md:w-16 md:h-16 shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
            size="icon"
          >
            {isOpen ? <X size={24} className="md:size-7" /> : <MessageCircle size={24} className="md:size-7" />}
          </Button>
        </div>
      </div>

      {/* Chat Window - Fully responsive */}
      {isOpen && (
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
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
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
                  {/* Close button for messages */}
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                    title="Remove message"
                  >
                    <X size={10} className="md:size-3" />
                  </button>
                </div>
              </div>
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
      )}
    </>
  );
};

export default AIChatbot;
