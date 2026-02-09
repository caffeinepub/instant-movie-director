import { useState, useCallback } from 'react';

export function useLocalAudio() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const selectAudio = useCallback((file: File) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
  }, [audioUrl]);

  const clearAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioFile(null);
    setAudioUrl(null);
  }, [audioUrl]);

  return {
    audioFile,
    audioUrl,
    selectAudio,
    clearAudio,
  };
}
