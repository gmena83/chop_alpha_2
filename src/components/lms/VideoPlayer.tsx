'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function VideoPlayer({ videoUrl, title, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPosition * video.duration;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const remainingTime = duration - currentTime;

  if (isYouTube || isVimeo) {
    let embedUrl = videoUrl;
    if (isYouTube) {
      let videoId: string | null = null;
      
      if (videoUrl.includes('/embed/')) {
        const parts = videoUrl.split('/embed/');
        videoId = parts[1]?.split('?')[0] || null;
      } else if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop()?.split('?')[0] || null;
      } else {
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
      <div className="space-y-3">
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Video progress is tracked by the external player
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onEnded={() => {
            setIsPlaying(false);
            onComplete?.();
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            className="h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#f4d03f] rounded-full transition-all relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
              </button>
              <button 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                onClick={() => skip(-10)}
              >
                <SkipBack className="h-4 w-4 text-white" />
              </button>
              <button 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                onClick={() => skip(10)}
              >
                <SkipForward className="h-4 w-4 text-white" />
              </button>
              <button 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
              </button>
              <span className="text-white text-sm ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <button 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#1a5276]" />
            <span className="text-sm font-medium text-gray-700">Video Progress</span>
          </div>
          <span className="text-sm font-semibold text-[#1a5276]">
            {Math.round(progress)}% complete
          </span>
        </div>
        
        <Progress value={progress} className="h-2 mb-3" />
        
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="font-medium text-green-600">{formatTime(currentTime)}</span>
            <span>watched</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-orange-600">{formatTime(remainingTime)}</span>
            <span>remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}
