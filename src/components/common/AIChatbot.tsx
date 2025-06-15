
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
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
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

  const randomSuggestions = [
    "Confused what to watch? Ask AI to suggest",
    "Need movie recommendations? Just ask!",
    "Let AI help you find your next favorite show",
    "Can't decide? Get personalized suggestions",
    "Discover hidden gems with AI recommendations"
  ];

  const [currentSuggestion, setCurrentSuggestion] = useState(randomSuggestions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion(randomSuggestions[Math.floor(Math.random() * randomSuggestions.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callPerplexityAPI = async (message: string): Promise<string> => {
    if (!apiKey) {
      return "Please provide your Perplexity API key to get AI-powered recommendations.";
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are a movie and TV show recommendation assistant for AuraLuxx streaming platform. You have access to current movie and TV data. When users ask for recommendations, provide specific titles with brief descriptions. Focus on popular, trending, and highly-rated content. Be concise and helpful. Only recommend content that exists on major platforms.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 800,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I couldn't generate a response right now.";
    } catch (error) {
      console.error('Perplexity API error:', error);
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
        responseIntro = "Here are some popular anime recommendations:\n\n";
      } else if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
        searchResults = await searchMulti('korean drama');
        responseIntro = "Here are some trending K-Drama recommendations:\n\n";
      } else if (lowerMessage.includes('movie')) {
        searchResults = await getPopular('movie');
        responseIntro = "Here are some popular movie recommendations:\n\n";
      } else if (lowerMessage.includes('tv') || lowerMessage.includes('series')) {
        searchResults = await getPopular('tv');
        responseIntro = "Here are some popular TV series recommendations:\n\n";
      } else if (lowerMessage.includes('action')) {
        searchResults = await searchMulti('action');
        responseIntro = "Here are some great action titles:\n\n";
      } else if (lowerMessage.includes('comedy')) {
        searchResults = await searchMulti('comedy');
        responseIntro = "Here are some hilarious comedy recommendations:\n\n";
      } else if (lowerMessage.includes('horror')) {
        searchResults = await searchMulti('horror');
        responseIntro = "Here are some spine-chilling horror recommendations:\n\n";
      } else if (lowerMessage.includes('romance')) {
        searchResults = await searchMulti('romance');
        responseIntro = "Here are some romantic recommendations:\n\n";
      } else {
        searchResults = await getTrending('all', 'week');
        responseIntro = "Here are some trending recommendations right now:\n\n";
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
        
        return response + "Would you like more recommendations or information about any of these?";
      }
    } catch (error) {
      console.error('TMDB API error:', error);
    }
    
    return "I'm having trouble fetching the latest recommendations right now. Please try asking about specific genres or types of content.";
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    // First try Perplexity AI if API key is available
    if (apiKey) {
      const aiResponse = await callPerplexityAPI(userMessage);
      
      // If AI response is successful, also get TMDB data for current recommendations
      if (!aiResponse.includes("Please provide your Perplexity API key")) {
        try {
          const tmdbResponse = await generateTMDBResponse(userMessage);
          return `${aiResponse}\n\n**Current Popular on AuraLuxx:**\n${tmdbResponse}`;
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
      {/* Chat Button - Moved to left side */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex flex-col items-center space-y-2">
          {/* Random suggestion message */}
          <div className="bg-aura-purple text-white px-3 py-2 rounded-lg text-sm opacity-90 max-w-48 text-center transition-opacity duration-500">
            {currentSuggestion}
          </div>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-aura-purple hover:bg-aura-darkpurple text-white rounded-full w-14 h-14 shadow-lg"
            size="icon"
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </Button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-aura-purple text-white p-4 rounded-t-lg">
            <h3 className="font-semibold flex items-center">
              <Bot className="mr-2" size={20} />
              AI Movie Assistant
            </h3>
            <p className="text-sm opacity-90">Powered by AI & TMDB data</p>
          </div>

          {/* API Key Input */}
          {!apiKey && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border-b">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                For enhanced AI recommendations, add your Perplexity API key:
              </p>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key..."
                  className="flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-aura-purple"
                />
                <Button
                  onClick={() => setShowApiKeyInput(false)}
                  size="sm"
                  className="text-xs"
                >
                  Skip
                </Button>
              </div>
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
                      : 'bg-aura-purple text-white'
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                placeholder="Ask for movie recommendations..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-aura-purple text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-aura-purple hover:bg-aura-darkpurple text-white"
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
