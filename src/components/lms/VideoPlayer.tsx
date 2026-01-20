'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
}

export function VideoPlayer({ videoUrl, title, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  if (isYouTube || isVimeo) {
    let embedUrl = videoUrl;
    if (isYouTube) {
      let videoId: string | null = null;
      
      if (videoUrl.includes('/embed/')) {
        // Already an embed URL - extract ID from path
        const parts = videoUrl.split('/embed/');
        videoId = parts[1]?.split('?')[0] || null;
      } else if (videoUrl.includes('youtu.be')) {
        // Short URL format
        videoId = videoUrl.split('/').pop()?.split('?')[0] || null;
      } else {
        // Standard watch URL
        try {
          videoId = new URL(videoUrl).searchParams.get('v');
        } catch {
          videoId = null;
        }
      }
      
      embedUrl = videoId 
        ? `https://www.youtube.com/embed/${videoId}?rel=0`
        : videoUrl;
    } else if (isVimeo) {
      const videoId = videoUrl.split('/').pop()?.split('?')[0];
      embedUrl = videoId 
        ? `https://player.vimeo.com/video/${videoId}`
        : videoUrl;
    }

    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
      <video
        src={videoUrl}
        className="w-full h-full object-contain"
        onEnded={onComplete}
        onTimeUpdate={(e) => {
          const video = e.target as HTMLVideoElement;
          setProgress((video.currentTime / video.duration) * 100);
        }}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1 bg-white/30 rounded-full mb-3">
          <div 
            className="h-full bg-[#f4d03f] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <SkipBack className="h-4 w-4 text-white" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <SkipForward className="h-4 w-4 text-white" />
            </button>
            <button 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
            </button>
          </div>
          
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Maximize className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
