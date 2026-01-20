'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Video, X, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VideoUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function VideoUploader({ value, onChange, disabled }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video file (MP4, WebM, OGG, or MOV)');
      return;
    }

    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Video file must be less than 500MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(10);

    try {
      const response = await fetch('/api/uploads/request-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL, objectPath } = await response.json();
      setProgress(30);

      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload video');
      }

      setProgress(100);
      const videoUrl = `/api/uploads${objectPath.replace('/objects', '')}`;
      onChange(videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [onChange]);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  const isUploadedVideo = value && value.startsWith('/api/uploads');

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {isUploadedVideo ? 'Uploaded Video' : 'External Video URL'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{value}</p>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isUploadedVideo && (
            <video
              src={value}
              controls
              className="mt-3 w-full max-h-48 rounded-md"
            />
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          {isUploading ? (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading video...</p>
              <Progress value={progress} className="w-full max-w-xs mx-auto" />
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Upload a video file (MP4, WebM, OGG, MOV - max 500MB)
              </p>
              <label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleFileChange}
                  disabled={disabled}
                  className="hidden"
                />
                <Button type="button" variant="secondary" disabled={disabled} asChild>
                  <span>Choose Video</span>
                </Button>
              </label>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <p className="text-xs text-muted-foreground">
        Or paste a YouTube/Vimeo URL in the video URL field below
      </p>
    </div>
  );
}
