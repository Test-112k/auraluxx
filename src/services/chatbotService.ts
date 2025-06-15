import { searchMulti, getTrending, getPopular, getTopRated } from '@/services/tmdbApi';
import { encryptKey, decryptKey } from '@/utils/encryption';

// Encrypted Gemini API key
const encryptedApiKey = encryptKey('AIzaSyAo42hUfi5ZwJSidDaC92OqbAqZQL4Egh4');

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

const getTMDBContext = async (userMessage: string): Promise<string | null> => {
  const lowerMessage = userMessage.toLowerCase();
  
  try {
    let searchResults;
    
    if (lowerMessage.includes('anime')) {
      searchResults = await searchMulti('anime');
    } else if (lowerMessage.includes('k-drama') || lowerMessage.includes('korean')) {
      searchResults = await searchMulti('korean drama');
    } else if (lowerMessage.includes('horror')) {
      searchResults = await searchMulti('horror');
    } else if (lowerMessage.includes('comedy')) {
      searchResults = await searchMulti('comedy');
    } else if (lowerMessage.includes('romance')) {
      searchResults = await searchMulti('romance');
    } else if (lowerMessage.includes('action')) {
      searchResults = await searchMulti('action');
    } else if (lowerMessage.includes('movie')) {
      searchResults = await getPopular('movie');
    } else if (lowerMessage.includes('tv') || lowerMessage.includes('series')) {
      searchResults = await getPopular('tv');
    } else if (lowerMessage.includes('trending')) {
      searchResults = await getTrending('all', 'week');
    } else {
      searchResults = await searchMulti(userMessage);
    }
    
    if (searchResults?.results && searchResults.results.length > 0) {
      const contextData = searchResults.results.slice(0, 5).map((item: any) => ({
        title: item.title || item.name,
        year: (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A',
        rating: item.vote_average ? item.vote_average.toFixed(1) : 'N/A',
        overview: item.overview,
        type: item.media_type,
      }));
      
      return JSON.stringify(contextData);
    } else {
      return null;
    }
  } catch (error) {
    console.error('TMDB API error for context generation:', error);
    return null;
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

export const callGeminiAPI = async (message: string): Promise<string> => {
    try {
      const lowerMessage = message.toLowerCase();
      const faqKeywords = ['country', 'regional', 'dubbed', 'language', 'subtitle', 'find', 'search', "can't find", 'telegram', 'support', 'contact', 'issue', 'problem', 'error', 'bug', 'report', 'how', 'guide', 'auraluxx'];
      if (faqKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return getWebsiteResponse(message);
      }

      const apiKey = decryptKey(encryptedApiKey);
      const isEntertainmentQuery = isWebsiteOrEntertainmentRelated(message);

      let tmdbContext: string | null = null;
      if (isEntertainmentQuery) {
        tmdbContext = await getTMDBContext(message);
      }

      // Enhanced prompt with TMDB data integration
      const prompt = isEntertainmentQuery
        ? `You are Auraluxx AI, an expert assistant for the Auraluxx streaming platform. Your goal is to provide excellent movie and TV show recommendations and help users navigate the platform. Your tone should be enthusiastic, friendly, and helpful. Format your responses with markdown, using **bold** for titles and emphasis, and using lists where appropriate.

User's request: "${message}"

${tmdbContext ? `To help you answer, here is some relevant data fetched from The Movie Database (TMDB). Use this data to construct a helpful and natural-sounding response. Don't just list the data; interpret it and add your own commentary. Make sure to mention that these titles are available on Auraluxx.

TMDB Data:
${tmdbContext}` : 'I could not find specific data for this query in our movie database, so please answer based on your general knowledge. Still, be helpful and recommend some great content available on Auraluxx if possible.'}`
        : `You are Auraluxx AI, a helpful and friendly assistant from the Auraluxx streaming platform. While your main focus is movies and entertainment, you are capable of answering general knowledge questions with access to current information. Be friendly and helpful. User request: "${message}"`;
      
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
      
      if (isWebsiteOrEntertainmentRelated(message)) {
        console.log("Gemini failed, falling back to TMDB for entertainment query.");
        return await generateTMDBResponse(message);
      }
      
      return "🤖 I'm having a little trouble connecting right now. Please try again in a moment. If the issue persists, you can **join our Telegram** for instant support: https://t.me/auralux1 🚀";
    }
  };
