export const PRODUCTION_ROLES = [
  'Director',
  'Screenwriter',
  'Cinematographer',
  'Producer',
  'Editor',
  'Sound',
] as const;

export type ProductionRole = typeof PRODUCTION_ROLES[number];

export const ROLE_DESCRIPTIONS: Record<ProductionRole, string> = {
  Director: 'Overall creative vision and storytelling',
  Screenwriter: 'Script, dialogue, and narrative structure',
  Cinematographer: 'Visual style, camera work, and lighting',
  Producer: 'Budget, schedule, and logistics',
  Editor: 'Pacing, structure, and post-production',
  Sound: 'Audio design, music, and sound effects',
};
