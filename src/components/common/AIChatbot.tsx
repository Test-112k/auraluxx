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
      text: "Hello! 👋 I'm **Auraluxx AI**, your dedicated entertainment assistant. I specialize in helping you discover:\n\n🎬 **Movies** - Latest releases, classics, and hidden gems\n📺 **TV Shows** - Trending series and binge-worthy content\n🍜 **Anime** - Popular and upcoming anime titles\n🇰🇷 **K-Dramas** - Romantic and thrilling Korean dramas\n\nWhat type of entertainment are you looking for today?",
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
    "🎭 **Entertainment Expert** at your service! Ask away!",
    "🎬 Need **movie recommendations**? I've got thousands!",
    "📺 **TV series** suggestions? That's my specialty!",
    "🍜 **Anime lover**? Let me find your next obsession!",
    "🇰🇷 **K-Drama** fan? I know all the heart-fluttering ones!",
    "🔥 What's **trending** in entertainment? Ask me!",
    "⭐ Looking for **highly rated** content? I'm your guide!",
    "🎪 **Family-friendly** options? I have perfect suggestions!",
    "🌙 **Late night** viewing? I know what keeps you hooked!",
    "🎯 **Specific genre**? Just tell me your mood!"
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

  const isEntertainmentRelated = (message: string): boolean => {
    const entertainmentKeywords = [
      'movie', 'movies', 'film', 'films', 'cinema',
      'tv', 'television', 'series', 'show', 'shows',
      'anime', 'manga', 'animation',
      'kdrama', 'k-drama', 'korean drama', 'korean',
      'watch', 'streaming', 'netflix', 'recommend',
      'horror', 'comedy', 'romance', 'action', 'thriller',
      'drama', 'sci-fi', 'fantasy', 'documentary',
      'trending', 'popular', 'best', 'top rated',
      'actor', 'actress', 'director', 'cast',
      'trailer', 'review', 'rating', 'imdb'
    ];
    
    const lowerMessage = message.toLowerCase();
    return entertainmentKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      // Check if the query is entertainment-related
      if (!isEntertainmentRelated(message)) {
        return "I'm sorry, but I can only help you with entertainment-related queries! 🎬\n\nI specialize in:\n• **Movies** and **Film** recommendations\n• **TV Shows** and **Series** suggestions\n• **Anime** and **Animation** picks\n• **K-Dramas** and **Korean** content\n• **Trending** and **Popular** entertainment\n\nPlease ask me about movies, TV shows, anime, or any other entertainment topics!";
      }

      const apiKey = decryptKey(encryptedApiKey);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Auraluxx AI, an expert entertainment assistant for the AuraLuxx streaming platform. Provide exceptional recommendations for movies, TV shows, anime, and K-dramas. Be enthusiastic and knowledgeable. Format your responses with proper markdown: use **bold** for titles and emphasis, *italics* for subtle emphasis, and organize content with bullet points and emojis for easy reading. Keep responses engaging but focused. User request: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error response:', errorData);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response structure from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      // Return TMDB-based response as fallback
      return await generateTMDBResponse(message);
    }
  };

  const generateTMDBResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    try {
      let searchResults;
      let responseIntro = "";
      
      if (lowerMessage.includes('anime')) {
        searchResults = await searchMulti('anime');
        responseIntro = "🍜 Here are some **incredible anime** recommendations I've curated for you:\n\n";
      } else if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
        searchResults = await searchMulti('korean drama');
        responseIntro = "🇰🇷 Get ready for these **absolutely addictive K-Drama** masterpieces:\n\n";
      } else if (lowerMessage.includes('horror')) {
        searchResults = await searchMulti('horror');
        responseIntro = "👻 Brace yourself for these **spine-tingling horror** experiences:\n\n";
      } else if (lowerMessage.includes('comedy')) {
        searchResults = await searchMulti('comedy');
        responseIntro = "😂 Get ready to laugh with these **comedy gems**:\n\n";
      } else if (lowerMessage.includes('romance')) {
        searchResults = await searchMulti('romance');
        responseIntro = "💕 Fall in love with these **romantic treasures**:\n\n";
      } else if (lowerMessage.includes('action')) {
        searchResults = await searchMulti('action');
        responseIntro = "💥 Buckle up for these **adrenaline-fueled action** adventures:\n\n";
      } else if (lowerMessage.includes('movie')) {
        searchResults = await getPopular('movie');
        responseIntro = "🎬 Here are some **blockbuster movies** that are absolutely must-watch:\n\n";
      } else if (lowerMessage.includes('tv') || lowerMessage.includes('series')) {
        searchResults = await getPopular('tv');
        responseIntro = "📺 Dive into these **binge-worthy TV series**:\n\n";
      } else if (lowerMessage.includes('trending')) {
        searchResults = await getTrending('all', 'week');
        responseIntro = "🔥 Here's what **everyone's talking about** right now:\n\n";
      } else {
        searchResults = await searchMulti(userMessage);
        responseIntro = "🎯 Based on your search, here are some **perfect matches**:\n\n";
      }
      
      if (searchResults?.results && searchResults.results.length > 0) {
        const recommendations = searchResults.results.slice(0, 5);
        let response = responseIntro;
        
        recommendations.forEach((item: any, index: number) => {
          const title = item.title || item.name;
          const year = item.release_date || item.first_air_date;
          const yearText = year ? ` *(${year.split('-')[0]})*` : '';
          const rating = item.vote_average ? ` - ⭐ **${item.vote_average.toFixed(1)}/10**` : '';
          const overview = item.overview ? `\n   ${item.overview.slice(0, 120)}...` : '';
          response += `**${index + 1}.** **${title}**${yearText}${rating}${overview}\n\n`;
        });
        
        return response + "✨ Want more personalized recommendations? Just let me know your preferences!";
      } else {
        return "🤖 I couldn't find specific results for that search. Try asking about **trending content**, **popular movies**, or specific genres like **horror**, **comedy**, **romance**, or **action**!";
      }
    } catch (error) {
      console.error('TMDB API error:', error);
      return "🤖 I'm experiencing some technical difficulties right now. Please give me a moment and try again!";
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
        text: "I'm sorry, I'm having trouble right now. Please try again! 🤖",
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
      {/* Chat Button - Fixed on left side with professional message */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex flex-col items-start space-y-3">
          {/* Professional suggestion message with close button */}
          {showRandomMessages && (
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white px-5 py-4 rounded-2xl text-sm opacity-95 max-w-72 shadow-2xl border border-white/20 relative backdrop-blur-sm">
              <button
                onClick={() => setShowRandomMessages(false)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg transition-all duration-200 hover:scale-110"
                title="Stop suggestions"
              >
                <X size={14} />
              </button>
              <div 
                className="font-medium leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatMessage(currentMessage) }}
              />
            </div>
          )}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full w-16 h-16 shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
            size="icon"
          >
            {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </Button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 left-6 w-80 h-[28rem] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Auraluxx AI</h3>
                  <p className="text-sm opacity-90">Entertainment Expert</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-75">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl relative group shadow-lg transition-all duration-200 hover:shadow-xl ${
                    message.isBot
                      ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.isBot && (
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-1 mt-1 flex-shrink-0">
                        <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                    )}
                    <div 
                      className="text-sm leading-relaxed flex-1"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                    />
                    {!message.isBot && (
                      <div className="bg-white/20 rounded-full p-1 mt-1 flex-shrink-0">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                  {/* Close button for messages */}
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                    title="Remove message"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-1.5 flex-shrink-0">
                    <Bot size={16} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about movies, shows, anime..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl px-4 shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                size="icon"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
