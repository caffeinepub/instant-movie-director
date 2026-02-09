import type { ProjectDraft } from '../workspace/types';

const DRAFT_KEY = 'movie-studio-draft';
const DRAFT_VERSION = 3;

interface StoredDraft {
  version: number;
  data: ProjectDraft;
}

export function saveDraftToLocalStorage(draft: ProjectDraft): void {
  try {
    const stored: StoredDraft = {
      version: DRAFT_VERSION,
      data: draft,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Failed to save draft to localStorage:', error);
  }
}

export function loadDraftFromLocalStorage(): ProjectDraft | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      if (!parsed.version) {
        return migrateOldDraft(parsed);
      }
      
      if (parsed.version === DRAFT_VERSION) {
        return parsed.data;
      }
      
      return migrateOldDraft(parsed.data);
    }
  } catch (error) {
    console.error('Failed to load draft from localStorage:', error);
  }
  return null;
}

function migrateOldDraft(oldDraft: any): ProjectDraft {
  return {
    ...oldDraft,
    rolePrompts: (oldDraft.rolePrompts || []).map((p: any) => ({
      ...p,
      systemMessage: p.systemMessage || undefined,
      elementType: p.elementType || undefined,
      elementId: p.elementId || undefined,
      elementLabel: p.elementLabel || undefined,
    })),
    assembly: oldDraft.assembly || {
      outputType: 'feature-film',
      timeline: [],
    },
  };
}

export function clearDraftFromLocalStorage(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear draft from localStorage:', error);
  }
}
