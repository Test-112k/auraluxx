
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { searchMulti, getTrending, getPopular, getTopRated } from '@/services/tmdbApi';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your movie assistant powered by AI. I can help you find movies, TV shows, anime, and K-dramas based on the latest data. What are you looking for today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const humorousMessages = [
    "🍿 Stuck in decision paralysis? Ask AI to rescue you!",
    "🤔 Confused what to watch? Let AI be your movie guru!",
    "🎬 Can't pick a movie? AI has entered the chat!",
    "😵 Overwhelmed by choices? AI to the rescue!",
    "🎭 Movie night crisis? Ask AI for salvation!",
    "🔮 Need a crystal ball for movies? Try our AI!",
    "🚀 Lost in the streaming universe? AI is your guide!",
    "🧠 Brain freeze on what to watch? AI has ideas!",
    "🎪 Welcome to the movie circus! AI picks the show!",
    "🏆 Champion of indecision? Let AI choose your winner!",
    "🌟 Shooting star wishes for movies? AI grants them!",
    "🎯 Bullseye movie recommendations from AI!",
    "🎊 Party planning but need entertainment? Ask AI!",
    "🕵️ Detective work for good movies? AI solved it!",
    "🎨 Paint me a perfect movie night with AI!"
  ];

  const [currentMessage, setCurrentMessage] = useState(humorousMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(humorousMessages[Math.floor(Math.random() * humorousMessages.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callPoeAPI = async (message: string): Promise<string> => {
    if (!apiKey) {
      return "Please provide your Poe API key to get AI-powered recommendations. You can get one from poe.com";
    }

    try {
      const response = await fetch('https://api.poe.com/bot/gpt-3.5-turbo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: '1.0',
          type: 'query',
          query: [
            {
              role: 'system',
              content: `You are a movie and TV show recommendation assistant for AuraLuxx streaming platform. You have access to current movie and TV data through TMDB. When users ask for recommendations, provide specific titles with brief descriptions. Focus on popular, trending, and highly-rated content. Be conversational, helpful, and enthusiastic about movies and shows. Only recommend content that exists on major platforms.`
            },
            {
              role: 'user', 
              content: message
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.text || "I couldn't generate a response right now.";
    } catch (error) {
      console.error('Poe API error:', error);
      return "I'm having trouble connecting to the AI service. Let me help you with some popular recommendations instead.";
    }
  };

  const generateTMDBResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    try {
      let searchResults;
      let responseIntro = "";
      
      if (lowerMessage.includes('anime')) {
        searchResults = await searchMulti('anime');
        responseIntro = "🍜 Here are some amazing anime recommendations:\n\n";
      } else if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
        searchResults = await searchMulti('korean drama');
        responseIntro = "🇰🇷 Here are some addictive K-Drama recommendations:\n\n";
      } else if (lowerMessage.includes('movie')) {
        searchResults = await getPopular('movie');
        responseIntro = "🎬 Here are some blockbuster movie recommendations:\n\n";
      } else if (lowerMessage.includes('tv') || lowerMessage.includes('series')) {
        searchResults = await getPopular('tv');
        responseIntro = "📺 Here are some binge-worthy TV series:\n\n";
      } else if (lowerMessage.includes('action')) {
        searchResults = await searchMulti('action');
        responseIntro = "💥 Here are some adrenaline-pumping action titles:\n\n";
      } else if (lowerMessage.includes('comedy')) {
        searchResults = await searchMulti('comedy');
        responseIntro = "😂 Here are some laugh-out-loud comedy recommendations:\n\n";
      } else if (lowerMessage.includes('horror')) {
        searchResults = await searchMulti('horror');
        responseIntro = "👻 Here are some spine-chilling horror recommendations:\n\n";
      } else if (lowerMessage.includes('romance')) {
        searchResults = await searchMulti('romance');
        responseIntro = "💕 Here are some heart-warming romantic recommendations:\n\n";
      } else {
        searchResults = await getTrending('all', 'week');
        responseIntro = "🔥 Here's what's trending right now on AuraLuxx:\n\n";
      }
      
      if (searchResults?.results && searchResults.results.length > 0) {
        const recommendations = searchResults.results.slice(0, 5);
        let response = responseIntro;
        
        recommendations.forEach((item: any, index: number) => {
          const title = item.title || item.name;
          const year = item.release_date || item.first_air_date;
          const yearText = year ? ` (${year.split('-')[0]})` : '';
          const rating = item.vote_average ? ` - ⭐ ${item.vote_average.toFixed(1)}` : '';
          const overview = item.overview ? `\n   ${item.overview.slice(0, 100)}...` : '';
          response += `${index + 1}. **${title}${yearText}**${rating}${overview}\n\n`;
        });
        
        return response + "🎯 Want more recommendations or details about any of these? Just ask!";
      }
    } catch (error) {
      console.error('TMDB API error:', error);
    }
    
    return "🤖 I'm having trouble fetching the latest recommendations right now. Please try asking about specific genres or types of content.";
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    // First try Poe AI if API key is available
    if (apiKey) {
      const aiResponse = await callPoeAPI(userMessage);
      
      // If AI response is successful, also get TMDB data for current recommendations
      if (!aiResponse.includes("Please provide your Poe API key")) {
        try {
          const tmdbResponse = await generateTMDBResponse(userMessage);
          return `${aiResponse}\n\n**🎪 Current Popular on AuraLuxx:**\n${tmdbResponse}`;
        } catch (error) {
          return aiResponse;
        }
      }
      
      return aiResponse;
    }
    
    // Fallback to TMDB-only response
    return await generateTMDBResponse(userMessage);
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
    setInputText('');
    setIsTyping(true);
    
    // Generate response
    setTimeout(async () => {
      const response = await generateResponse(inputText);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button - Fixed on left side with humorous message */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex flex-col items-start space-y-2">
          {/* Humorous suggestion message */}
          <div className="bg-gradient-to-r from-aura-purple to-purple-600 text-white px-4 py-3 rounded-lg text-sm opacity-95 max-w-64 text-center transition-all duration-500 shadow-lg border border-purple-400/20">
            <div className="font-medium">{currentMessage}</div>
          </div>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gradient-to-r from-aura-purple to-purple-600 hover:from-aura-darkpurple hover:to-purple-700 text-white rounded-full w-16 h-16 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-purple-400/30"
            size="icon"
          >
            {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
          </Button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 left-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-aura-purple to-purple-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold flex items-center">
              <Bot className="mr-2" size={20} />
              🎬 AI Movie Assistant
            </h3>
            <p className="text-sm opacity-90">Powered by Poe AI & TMDB data</p>
          </div>

          {/* API Key Input */}
          {!apiKey && (
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-b">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                🔑 For enhanced AI recommendations, add your Poe API key:
              </p>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Poe API key..."
                  className="flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-aura-purple"
                />
                <Button
                  onClick={() => {}}
                  size="sm"
                  className="text-xs bg-aura-purple hover:bg-aura-purple/80"
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Get your free API key from <a href="https://poe.com" target="_blank" rel="noopener" className="underline">poe.com</a>
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-gradient-to-r from-aura-purple to-purple-600 text-white'
                  }`}
                >
                  <div className="flex items-start">
                    {message.isBot && <Bot className="mr-2 mt-1 flex-shrink-0" size={16} />}
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {!message.isBot && <User className="ml-2 mt-1 flex-shrink-0" size={16} />}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Bot className="mr-2" size={16} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-aura-purple rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-aura-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-aura-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for movie magic... ✨"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-aura-purple text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-aura-purple to-purple-600 hover:from-aura-darkpurple hover:to-purple-700 text-white"
                size="icon"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
