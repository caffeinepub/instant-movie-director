import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, SkipBack, Upload, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useProjects } from '../projects/useProjects';
import { updateAssembly } from '../workspace/state/projectDraft';
import type { OutputType, TimelineItem } from '../workspace/types';
import { useLocalAudio } from './useLocalAudio';
import { useAssemblyPlayback } from './useAssemblyPlayback';
import { toast } from 'sonner';

export default function AssemblyPanel() {
  const { currentProject, updateCurrentProject } = useProjects();
  const { audioFile, audioUrl, selectAudio, clearAudio } = useLocalAudio();
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assembly = currentProject.assembly || { outputType: 'feature-film', timeline: [] };
  const isMusicVideo = assembly.outputType === 'music-video';

  const { isPlaying, currentTime, duration, currentSceneIndex, play, pause, seek, reset } = useAssemblyPlayback({
    timeline: assembly.timeline,
    audioElement: isMusicVideo ? audioRef.current : null,
    outputType: assembly.outputType,
  });

  const handleOutputTypeChange = (value: OutputType) => {
    const updated = updateAssembly(currentProject, {
      ...assembly,
      outputType: value,
    });
    updateCurrentProject(updated);
  };

  const handleAddScene = (sceneIndex: number) => {
    const newItem: TimelineItem = {
      sceneIndex,
      duration: 5,
      startTime: isMusicVideo ? 0 : undefined,
    };
    
    const updated = updateAssembly(currentProject, {
      ...assembly,
      timeline: [...assembly.timeline, newItem],
    });
    updateCurrentProject(updated);
  };

  const handleRemoveFromTimeline = (index: number) => {
    const updated = updateAssembly(currentProject, {
      ...assembly,
      timeline: assembly.timeline.filter((_, i) => i !== index),
    });
    updateCurrentProject(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newTimeline = [...assembly.timeline];
    [newTimeline[index - 1], newTimeline[index]] = [newTimeline[index], newTimeline[index - 1]];
    
    const updated = updateAssembly(currentProject, {
      ...assembly,
      timeline: newTimeline,
    });
    updateCurrentProject(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === assembly.timeline.length - 1) return;
    const newTimeline = [...assembly.timeline];
    [newTimeline[index], newTimeline[index + 1]] = [newTimeline[index + 1], newTimeline[index]];
    
    const updated = updateAssembly(currentProject, {
      ...assembly,
      timeline: newTimeline,
    });
    updateCurrentProject(updated);
  };

  const handleDurationChange = (index: number, duration: number) => {
    const newTimeline = [...assembly.timeline];
    newTimeline[index] = { ...newTimeline[index], duration: Math.max(0.1, duration) };
    
    const updated = updateAssembly(currentProject, {
      ...assembly,
      timeline: newTimeline,
    });
    updateCurrentProject(updated);
  };

  const handleStartTimeChange = (index: number, startTime: number) => {
    const newTimeline = [...assembly.timeline];
    newTimeline[index] = { ...newTimeline[index], startTime: Math.max(0, startTime) };
    
    const updated = updateAssembly(currentProject, {
      ...assembly,
      timeline: newTimeline,
    });
    updateCurrentProject(updated);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      selectAudio(file);
      toast.success('Audio file loaded');
    }
  };

  const handleClearAudio = () => {
    clearAudio();
    reset();
    toast.success('Audio file removed');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = assembly.timeline.reduce((sum, item) => {
    if (isMusicVideo && item.startTime !== undefined) {
      return Math.max(sum, item.startTime + item.duration);
    }
    return sum + item.duration;
  }, 0);

  const availableScenes = currentProject.scenes
    .map((_, index) => index)
    .filter((index) => !assembly.timeline.some((item) => item.sceneIndex === index));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Assembly</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Output Type</Label>
          <Select value={assembly.outputType} onValueChange={handleOutputTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature-film">Feature Film</SelectItem>
              <SelectItem value="short-film">Short Film</SelectItem>
              <SelectItem value="music-video">Music Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isMusicVideo && (
          <div className="space-y-3">
            <Label>Audio Track</Label>
            {audioFile ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className="flex-1 truncate text-sm">{audioFile.name}</div>
                <Button variant="ghost" size="sm" onClick={handleClearAudio}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/mp3,audio/wav,audio/mpeg,audio/ogg,audio/aac"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Audio
                </Button>
              </div>
            )}
            {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Timeline</Label>
            <div className="text-sm text-muted-foreground">
              Duration: {formatTime(isMusicVideo && audioUrl ? duration : totalDuration)}
            </div>
          </div>

          {assembly.timeline.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scenes in timeline. Add scenes below.
            </div>
          ) : (
            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="p-4 space-y-2">
                {assembly.timeline.map((item, index) => {
                  const scene = currentProject.scenes[item.sceneIndex];
                  const isActive = currentSceneIndex === item.sceneIndex;
                  
                  return (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg space-y-2 ${
                        isActive ? 'border-amber-500 bg-amber-500/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {scene?.title || `Scene ${item.sceneIndex + 1}`}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {scene?.description}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === assembly.timeline.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFromTimeline(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {isMusicVideo && (
                          <div className="space-y-1">
                            <Label className="text-xs">Start (s)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              value={item.startTime ?? 0}
                              onChange={(e) =>
                                handleStartTimeChange(index, parseFloat(e.target.value) || 0)
                              }
                              className="h-8"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <Label className="text-xs">Duration (s)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={item.duration}
                            onChange={(e) =>
                              handleDurationChange(index, parseFloat(e.target.value) || 0.1)
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {availableScenes.length > 0 && (
          <div className="space-y-2">
            <Label>Available Scenes</Label>
            <ScrollArea className="h-[150px] border rounded-lg">
              <div className="p-2 space-y-1">
                {availableScenes.map((sceneIndex) => {
                  const scene = currentProject.scenes[sceneIndex];
                  return (
                    <Button
                      key={sceneIndex}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleAddScene(sceneIndex)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {scene?.title || `Scene ${sceneIndex + 1}`}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {scene?.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {assembly.timeline.length > 0 && (
          <>
            <Separator />
            
            <div className="space-y-3">
              <Label>Preview</Label>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={reset}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isPlaying ? pause : play}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1 text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="w-full"
                />
                
                {currentSceneIndex !== null && (
                  <div className="p-2 bg-muted rounded text-sm">
                    <div className="font-medium">
                      Current: {currentProject.scenes[currentSceneIndex]?.title || `Scene ${currentSceneIndex + 1}`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
