import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimelineItem } from '../workspace/types';

interface UseAssemblyPlaybackProps {
  timeline: TimelineItem[];
  audioElement: HTMLAudioElement | null;
  outputType: string;
}

export function useAssemblyPlayback({ timeline, audioElement, outputType }: UseAssemblyPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const isMusicVideo = outputType === 'music-video';

  const totalDuration = timeline.reduce((sum, item) => {
    if (isMusicVideo && item.startTime !== undefined) {
      return Math.max(sum, item.startTime + item.duration);
    }
    return sum + item.duration;
  }, 0);

  useEffect(() => {
    if (audioElement) {
      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration);
      };
      
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      if (audioElement.readyState >= 1) {
        setDuration(audioElement.duration);
      }
      
      return () => {
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    } else {
      setDuration(totalDuration);
    }
  }, [audioElement, totalDuration]);

  const getCurrentSceneIndex = useCallback((time: number): number | null => {
    if (timeline.length === 0) return null;

    if (isMusicVideo) {
      for (let i = 0; i < timeline.length; i++) {
        const item = timeline[i];
        if (item.startTime !== undefined) {
          const endTime = item.startTime + item.duration;
          if (time >= item.startTime && time < endTime) {
            return item.sceneIndex;
          }
        }
      }
      return null;
    } else {
      let accumulatedTime = 0;
      for (let i = 0; i < timeline.length; i++) {
        const item = timeline[i];
        if (time >= accumulatedTime && time < accumulatedTime + item.duration) {
          return item.sceneIndex;
        }
        accumulatedTime += item.duration;
      }
      return null;
    }
  }, [timeline, isMusicVideo]);

  useEffect(() => {
    if (isPlaying) {
      const updateTime = () => {
        if (audioElement) {
          const time = audioElement.currentTime;
          setCurrentTime(time);
          setCurrentSceneIndex(getCurrentSceneIndex(time));
          
          if (time >= audioElement.duration) {
            setIsPlaying(false);
            audioElement.pause();
            return;
          }
        } else {
          setCurrentTime((prev) => {
            const newTime = prev + 0.016;
            if (newTime >= duration) {
              setIsPlaying(false);
              return duration;
            }
            setCurrentSceneIndex(getCurrentSceneIndex(newTime));
            return newTime;
          });
        }
        
        animationFrameRef.current = requestAnimationFrame(updateTime);
      };
      
      animationFrameRef.current = requestAnimationFrame(updateTime);
      
      return () => {
        if (animationFrameRef.current !== undefined) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isPlaying, audioElement, duration, getCurrentSceneIndex]);

  const play = useCallback(() => {
    if (audioElement) {
      audioElement.play();
    }
    setIsPlaying(true);
  }, [audioElement]);

  const pause = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  }, [audioElement]);

  const seek = useCallback((time: number) => {
    const clampedTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(clampedTime);
    setCurrentSceneIndex(getCurrentSceneIndex(clampedTime));
    
    if (audioElement) {
      audioElement.currentTime = clampedTime;
    }
  }, [audioElement, duration, getCurrentSceneIndex]);

  const reset = useCallback(() => {
    pause();
    seek(0);
  }, [pause, seek]);

  return {
    isPlaying,
    currentTime,
    duration,
    currentSceneIndex,
    play,
    pause,
    seek,
    reset,
  };
}
