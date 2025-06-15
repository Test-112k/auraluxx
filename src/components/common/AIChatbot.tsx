
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { searchMulti, getTrending } from '@/services/tmdbApi';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your movie assistant. I can help you find movies, TV shows, anime, and K-dramas. What are you looking for today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Movie/TV show recommendations based on keywords
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('show me')) {
      try {
        let searchResults;
        
        if (lowerMessage.includes('anime')) {
          searchResults = await searchMulti('anime');
        } else if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
          searchResults = await searchMulti('korean drama');
        } else if (lowerMessage.includes('movie')) {
          searchResults = await searchMulti('movie');
        } else if (lowerMessage.includes('action')) {
          searchResults = await searchMulti('action');
        } else if (lowerMessage.includes('comedy')) {
          searchResults = await searchMulti('comedy');
        } else if (lowerMessage.includes('horror')) {
          searchResults = await searchMulti('horror');
        } else if (lowerMessage.includes('romance')) {
          searchResults = await searchMulti('romance');
        } else {
          // Get trending content
          searchResults = await getTrending('all', 'week');
        }
        
        if (searchResults?.results && searchResults.results.length > 0) {
          const recommendations = searchResults.results.slice(0, 3);
          let response = "Here are some great recommendations for you:\n\n";
          
          recommendations.forEach((item: any, index: number) => {
            const title = item.title || item.name;
            const year = item.release_date || item.first_air_date;
            const yearText = year ? ` (${year.split('-')[0]})` : '';
            const rating = item.vote_average ? ` - ⭐ ${item.vote_average.toFixed(1)}` : '';
            response += `${index + 1}. ${title}${yearText}${rating}\n`;
          });
          
          return response + "\nWould you like more recommendations or information about any of these?";
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
    
    // Genre-based responses
    if (lowerMessage.includes('action')) {
      return "For action content, I recommend checking out our trending section! You'll find exciting movies and shows with intense fight scenes, car chases, and superhero adventures. Would you like me to suggest some specific action titles?";
    }
    
    if (lowerMessage.includes('comedy')) {
      return "Looking for something funny? Our comedy section has hilarious movies and TV shows that will make you laugh! From romantic comedies to sitcoms, there's something for every sense of humor.";
    }
    
    if (lowerMessage.includes('horror')) {
      return "If you're brave enough for some scares, our horror collection has spine-chilling movies and series. From psychological thrillers to supernatural horror, we have content that will keep you on the edge of your seat!";
    }
    
    if (lowerMessage.includes('anime')) {
      return "Anime fans, you're in the right place! Check out our dedicated Anime section for the latest and greatest from Japan. From action-packed adventures to heartwarming slice-of-life stories, discover your next favorite series!";
    }
    
    if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
      return "K-Drama lovers unite! Our Korean Drama section features the most popular and trending series from South Korea. From romantic comedies to intense thrillers, explore the world of K-dramas!";
    }
    
    // Help and navigation
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I can help you find movies, TV shows, anime, and K-dramas! Try asking me things like:\n• 'Recommend some action movies'\n• 'Show me popular anime'\n• 'What are trending K-dramas?'\n• 'Suggest horror movies'\n\nWhat would you like to explore?";
    }
    
    if (lowerMessage.includes('popular') || lowerMessage.includes('trending')) {
      return "Check out our trending section for the most popular content right now! You can also browse by categories like Movies, TV Series, Anime, and K-Drama to find what's hot in each genre.";
    }
    
    // Default responses
    const defaultResponses = [
      "That's interesting! I specialize in movie and TV show recommendations. What genre are you in the mood for?",
      "I'd love to help you find something great to watch! Are you looking for movies, TV series, anime, or K-dramas?",
      "Let me help you discover amazing content! Try asking me about specific genres or for general recommendations.",
      "I'm here to help you find your next favorite show or movie! What type of content interests you?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
    
    // Simulate typing delay
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
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-aura-purple hover:bg-aura-darkpurple text-white rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-aura-purple text-white p-4 rounded-t-lg">
            <h3 className="font-semibold flex items-center">
              <Bot className="mr-2" size={20} />
              Movie Assistant
            </h3>
            <p className="text-sm opacity-90">Ask me about movies & shows!</p>
          </div>

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
                placeholder="Ask about movies, shows..."
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
