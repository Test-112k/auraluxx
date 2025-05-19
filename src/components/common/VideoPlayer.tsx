
import { generatePlayerIframe } from '@/services/streamingApi';

interface VideoPlayerProps {
  id: string;
  type: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
}

const VideoPlayer = ({ id, type, title, season, episode }: VideoPlayerProps) => {
  const createIframeSrcDoc = () => {
    if (type === 'tv') {
      return generatePlayerIframe(id, type, title, season, episode);
    }
    return generatePlayerIframe(id, type, title);
  };

  return (
    <div className="w-full aspect-video bg-black mb-8 rounded-lg overflow-hidden shadow-lg shadow-black/20 relative">
      <iframe
        className="w-full h-full absolute inset-0"
        src={type === 'tv' ? `https://rivestream.net/embed?type=tv&id=${id}&season=${season}&episode=${episode}` : `https://rivestream.net/embed?type=movie&id=${id}`}
        title={title}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
