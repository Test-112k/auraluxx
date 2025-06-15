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
      text: "Hey there! 👋 I'm Auraluxx AI, your personal entertainment assistant! I can help you discover amazing movies, TV shows, anime, and K-dramas based on the latest trends and data. What kind of entertainment are you in the mood for today?",
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
    "🍿 Stuck in decision paralysis? Let Auraluxx AI be your hero!",
    "🤔 Can't decide what to watch? Auraluxx AI has got your back!",
    "🎬 Movie night dilemma? Ask Auraluxx AI for instant solutions!",
    "😵 Overwhelmed by endless options? Let AI guide your journey!",
    "🎭 Entertainment crisis mode? Auraluxx AI to the rescue!",
    "🔮 Need a crystal ball for perfect picks? Try our AI magic!",
    "🚀 Lost in the streaming galaxy? AI is your navigation system!",
    "🧠 Brain freeze on entertainment? AI has unlimited ideas!",
    "🎪 Welcome to the entertainment universe! AI curates the best!",
    "🏆 Champion of indecision? Let AI crown your perfect choice!",
    "🌟 Wishing for stellar recommendations? AI makes dreams reality!",
    "🎯 Bullseye entertainment picks powered by AI intelligence!",
    "🎊 Planning the perfect night? Ask AI for premium suggestions!",
    "🕵️ Detective work for hidden gems? AI already solved the case!",
    "🎨 Paint your ideal entertainment experience with AI!",
    "👻 Give me 10 spine-chilling horror movies to watch",
    "😂 Recommend 5 hilarious comedy shows for tonight",
    "💕 Find me the most romantic K-dramas to binge",
    "🔥 What's trending and hot in anime right now?",
    "⚔️ Show me epic action movies that pack a punch",
    "🌸 Best Japanese cinema gems I should discover",
    "🎭 Timeless classics every movie lover must see",
    "🚀 Mind-blowing sci-fi series that'll amaze me",
    "🎪 Perfect family-friendly movies for weekend fun",
    "🌙 Late night thriller recommendations for insomniacs"
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

  const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      const apiKey = decryptKey(encryptedApiKey);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Auraluxx AI, an intelligent entertainment assistant for the AuraLuxx streaming platform. Your mission is to provide exceptional movie and TV show recommendations based on user preferences. Be enthusiastic, knowledgeable, and personable in your responses. Always format your recommendations with emojis and clear structure for easy reading. Keep responses engaging but concise. User request: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
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
        responseIntro = "🍜 Here are some incredible anime recommendations I've curated for you:\n\n";
      } else if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
        searchResults = await searchMulti('korean drama');
        responseIntro = "🇰🇷 Get ready for these absolutely addictive K-Drama masterpieces:\n\n";
      } else if (lowerMessage.includes('horror')) {
        searchResults = await searchMulti('horror');
        responseIntro = "👻 Brace yourself for these spine-tingling horror experiences:\n\n";
      } else if (lowerMessage.includes('comedy')) {
        searchResults = await searchMulti('comedy');
        responseIntro = "😂 Get ready to laugh until your sides hurt with these comedy gems:\n\n";
      } else if (lowerMessage.includes('romance')) {
        searchResults = await searchMulti('romance');
        responseIntro = "💕 Fall in love all over again with these romantic treasures:\n\n";
      } else if (lowerMessage.includes('action')) {
        searchResults = await searchMulti('action');
        responseIntro = "💥 Buckle up for these adrenaline-fueled action adventures:\n\n";
      } else if (lowerMessage.includes('movie')) {
        searchResults = await getPopular('movie');
        responseIntro = "🎬 Here are some blockbuster movies that are absolutely must-watch:\n\n";
      } else if (lowerMessage.includes('tv') || lowerMessage.includes('series')) {
        searchResults = await getPopular('tv');
        responseIntro = "📺 Dive into these binge-worthy TV series that'll keep you hooked:\n\n";
      } else if (lowerMessage.includes('trending')) {
        searchResults = await getTrending('all', 'week');
        responseIntro = "🔥 Here's what everyone's talking about right now:\n\n";
      } else {
        // For general queries, search with the user's message
        searchResults = await searchMulti(userMessage);
        responseIntro = "🎯 Based on your search, here are some perfect matches I found:\n\n";
      }
      
      if (searchResults?.results && searchResults.results.length > 0) {
        const recommendations = searchResults.results.slice(0, 5);
        let response = responseIntro;
        
        recommendations.forEach((item: any, index: number) => {
          const title = item.title || item.name;
          const year = item.release_date || item.first_air_date;
          const yearText = year ? ` (${year.split('-')[0]})` : '';
          const rating = item.vote_average ? ` - ⭐ ${item.vote_average.toFixed(1)}/10` : '';
          const overview = item.overview ? `\n   ${item.overview.slice(0, 120)}...` : '';
          response += `${index + 1}. **${title}${yearText}**${rating}${overview}\n\n`;
        });
        
        return response + "✨ Want more personalized recommendations or details about any of these? Just let me know!";
      } else {
        return "🤖 I couldn't find specific results for that search. Try asking about trending content, popular movies, or specific genres like horror, comedy, romance, or action!";
      }
    } catch (error) {
      console.error('TMDB API error:', error);
      return "🤖 I'm experiencing some technical difficulties right now. Please give me a moment and try again!";
    }
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
        text: "Sorry, I'm having trouble right now. Please try again!",
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
      {/* Chat Button - Fixed on left side with humorous message */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex flex-col items-start space-y-2">
          {/* Humorous suggestion message with close button */}
          {showRandomMessages && (
            <div className="bg-gradient-to-r from-aura-purple to-purple-600 text-white px-4 py-3 rounded-lg text-sm opacity-95 max-w-64 text-center transition-all duration-500 shadow-lg border border-purple-400/20 relative">
              <button
                onClick={() => setShowRandomMessages(false)}
                className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                title="Stop random messages"
              >
                <X size={12} />
              </button>
              <div className="font-medium">{currentMessage}</div>
            </div>
          )}
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
              🤖 Auraluxx AI
            </h3>
            <p className="text-sm opacity-90">Your intelligent entertainment assistant</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg relative group ${
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
                  {/* Close button for messages */}
                  <button
                    onClick={() => removeMessage(message.id)}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove message"
                  >
                    <X size={12} />
                  </button>
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
                placeholder="Ask for entertainment magic... ✨"
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
