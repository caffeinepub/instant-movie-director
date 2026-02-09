import { ProjectDraft, Character, Location, RolePromptEntry, AssemblyData } from '../types';
import type { Scene } from '../../../backend';

export function createEmptyProject(): ProjectDraft {
  return {
    title: 'Untitled Project',
    logline: '',
    synopsis: '',
    characters: [],
    locations: [],
    scenes: [],
    rolePrompts: [],
    assembly: {
      outputType: 'feature-film',
      timeline: [],
    },
  };
}

export function addCharacter(draft: ProjectDraft, character: Character): ProjectDraft {
  return {
    ...draft,
    characters: [...draft.characters, character],
  };
}

export function updateCharacter(draft: ProjectDraft, id: string, updates: Partial<Character>): ProjectDraft {
  return {
    ...draft,
    characters: draft.characters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  };
}

export function deleteCharacter(draft: ProjectDraft, id: string): ProjectDraft {
  return {
    ...draft,
    characters: draft.characters.filter((c) => c.id !== id),
    rolePrompts: draft.rolePrompts.filter((p) => !(p.elementType === 'character' && p.elementId === id)),
  };
}

export function addLocation(draft: ProjectDraft, location: Location): ProjectDraft {
  return {
    ...draft,
    locations: [...draft.locations, location],
  };
}

export function updateLocation(draft: ProjectDraft, id: string, updates: Partial<Location>): ProjectDraft {
  return {
    ...draft,
    locations: draft.locations.map((l) => (l.id === id ? { ...l, ...updates } : l)),
  };
}

export function deleteLocation(draft: ProjectDraft, id: string): ProjectDraft {
  return {
    ...draft,
    locations: draft.locations.filter((l) => l.id !== id),
    rolePrompts: draft.rolePrompts.filter((p) => !(p.elementType === 'location' && p.elementId === id)),
  };
}

export function addScene(draft: ProjectDraft, scene: Scene): ProjectDraft {
  const newDraft = {
    ...draft,
    scenes: [...draft.scenes, scene],
  };
  return reconcileAssemblyTimeline(newDraft);
}

export function updateScene(draft: ProjectDraft, index: number, updates: Partial<Scene>): ProjectDraft {
  return {
    ...draft,
    scenes: draft.scenes.map((s, i) => (i === index ? { ...s, ...updates } : s)),
  };
}

export function deleteScene(draft: ProjectDraft, index: number): ProjectDraft {
  const sceneId = `scene-${index}`;
  const newDraft = {
    ...draft,
    scenes: draft.scenes.filter((_, i) => i !== index),
    rolePrompts: draft.rolePrompts.filter((p) => !(p.elementType === 'scene' && p.elementId === sceneId)),
  };
  return reconcileAssemblyTimeline(newDraft);
}

export function addRolePrompt(draft: ProjectDraft, prompt: RolePromptEntry): ProjectDraft {
  return {
    ...draft,
    rolePrompts: [...draft.rolePrompts, prompt],
  };
}

export function updateRolePrompt(draft: ProjectDraft, id: string, updates: Partial<RolePromptEntry>): ProjectDraft {
  return {
    ...draft,
    rolePrompts: draft.rolePrompts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  };
}

export function deleteRolePrompt(draft: ProjectDraft, id: string): ProjectDraft {
  return {
    ...draft,
    rolePrompts: draft.rolePrompts.filter((p) => p.id !== id),
  };
}

export function updateAssembly(draft: ProjectDraft, assembly: AssemblyData): ProjectDraft {
  return {
    ...draft,
    assembly,
  };
}

function reconcileAssemblyTimeline(draft: ProjectDraft): ProjectDraft {
  if (!draft.assembly) {
    return draft;
  }

  const validTimeline = draft.assembly.timeline.filter(
    (item) => item.sceneIndex >= 0 && item.sceneIndex < draft.scenes.length
  );

  return {
    ...draft,
    assembly: {
      ...draft.assembly,
      timeline: validTimeline,
    },
  };
}
