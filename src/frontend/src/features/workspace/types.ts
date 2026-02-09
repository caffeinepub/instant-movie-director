import type { Scene } from '../../backend';

export interface Character {
  id: string;
  name: string;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
}

export interface ProjectElement {
  type: 'logline' | 'synopsis' | 'character' | 'location' | 'scene';
  id?: string;
  label: string;
}

export interface RolePromptEntry {
  id: string;
  role: string;
  title: string;
  content: string;
  systemMessage?: string;
  elementType?: 'logline' | 'synopsis' | 'character' | 'location' | 'scene';
  elementId?: string;
  elementLabel?: string;
}

export type OutputType = 'feature-film' | 'short-film' | 'music-video';

export interface TimelineItem {
  sceneIndex: number;
  duration: number;
  startTime?: number;
}

export interface AssemblyData {
  outputType: OutputType;
  timeline: TimelineItem[];
}

export interface ProjectDraft {
  title: string;
  logline: string;
  synopsis: string;
  characters: Character[];
  locations: Location[];
  scenes: Scene[];
  rolePrompts: RolePromptEntry[];
  assembly?: AssemblyData;
}
