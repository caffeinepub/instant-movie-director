export interface PromptTemplate {
  id: string;
  title: string;
  systemMessage: string;
  userPrompt: string;
  role?: string;
  elementType?: 'logline' | 'synopsis' | 'character' | 'location' | 'scene';
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // Director Templates
  {
    id: 'dir-vision',
    title: 'Overall Vision & Tone',
    role: 'Director',
    systemMessage: 'You are an experienced film director helping to establish the creative vision for a film project.',
    userPrompt: 'Describe the overall tone, mood, and visual style for this project. Consider themes, atmosphere, and the emotional journey of the audience.',
  },
  {
    id: 'dir-scene-blocking',
    title: 'Scene Blocking & Staging',
    role: 'Director',
    elementType: 'scene',
    systemMessage: 'You are a film director planning scene blocking and actor staging.',
    userPrompt: 'Describe how actors should move through this scene, where they are positioned, and how the staging supports the emotional beats.',
  },
  {
    id: 'dir-performance',
    title: 'Character Performance Notes',
    role: 'Director',
    elementType: 'character',
    systemMessage: 'You are a director providing performance guidance for an actor.',
    userPrompt: 'Describe the emotional arc, key motivations, and performance style for this character. Include notes on voice, physicality, and key moments.',
  },

  // Screenwriter Templates
  {
    id: 'sw-logline',
    title: 'Logline Development',
    role: 'Screenwriter',
    elementType: 'logline',
    systemMessage: 'You are a professional screenwriter crafting compelling loglines.',
    userPrompt: 'Create a one-sentence logline that captures the protagonist, their goal, the obstacle, and the stakes.',
  },
  {
    id: 'sw-synopsis',
    title: 'Story Synopsis',
    role: 'Screenwriter',
    elementType: 'synopsis',
    systemMessage: 'You are a screenwriter developing a detailed story synopsis.',
    userPrompt: 'Write a comprehensive synopsis covering the three-act structure, major plot points, character arcs, and resolution.',
  },
  {
    id: 'sw-character-arc',
    title: 'Character Arc Development',
    role: 'Screenwriter',
    elementType: 'character',
    systemMessage: 'You are a screenwriter developing character arcs and backstories.',
    userPrompt: 'Describe this character\'s journey: who they are at the start, what they want, what they need, and how they change by the end.',
  },
  {
    id: 'sw-dialogue',
    title: 'Scene Dialogue',
    role: 'Screenwriter',
    elementType: 'scene',
    systemMessage: 'You are a screenwriter crafting authentic dialogue.',
    userPrompt: 'Write dialogue for this scene that reveals character, advances the plot, and sounds natural. Include subtext and conflict.',
  },

  // Cinematographer Templates
  {
    id: 'cin-visual-style',
    title: 'Visual Style & Color Palette',
    role: 'Cinematographer',
    systemMessage: 'You are a cinematographer establishing the visual language of a film.',
    userPrompt: 'Describe the color palette, lighting style, camera movement philosophy, and overall visual aesthetic for this project.',
  },
  {
    id: 'cin-location-lighting',
    title: 'Location Lighting Plan',
    role: 'Cinematographer',
    elementType: 'location',
    systemMessage: 'You are a cinematographer planning lighting for a specific location.',
    userPrompt: 'Describe the lighting setup, natural vs artificial light sources, time of day considerations, and mood for this location.',
  },
  {
    id: 'cin-shot-list',
    title: 'Scene Shot List',
    role: 'Cinematographer',
    elementType: 'scene',
    systemMessage: 'You are a cinematographer creating a detailed shot list.',
    userPrompt: 'List the shots needed for this scene: shot size, camera angle, movement, lens choice, and how each shot serves the story.',
  },

  // Producer Templates
  {
    id: 'prod-schedule',
    title: 'Production Schedule',
    role: 'Producer',
    systemMessage: 'You are a film producer planning production logistics.',
    userPrompt: 'Outline the production schedule, key milestones, shooting days needed, and logistical considerations.',
  },
  {
    id: 'prod-location-req',
    title: 'Location Requirements',
    role: 'Producer',
    elementType: 'location',
    systemMessage: 'You are a producer assessing location requirements and logistics.',
    userPrompt: 'List the practical requirements for this location: permits, access, power, crew facilities, and potential challenges.',
  },
  {
    id: 'prod-scene-breakdown',
    title: 'Scene Production Breakdown',
    role: 'Producer',
    elementType: 'scene',
    systemMessage: 'You are a producer breaking down scene requirements.',
    userPrompt: 'List all production elements needed: cast, props, wardrobe, special equipment, VFX, and estimated shooting time.',
  },

  // Editor Templates
  {
    id: 'edit-pacing',
    title: 'Overall Pacing & Rhythm',
    role: 'Editor',
    systemMessage: 'You are a film editor planning the pacing and rhythm of a film.',
    userPrompt: 'Describe the intended pacing: where to build tension, where to give breathing room, and how to control the emotional rhythm.',
  },
  {
    id: 'edit-scene-structure',
    title: 'Scene Editing Structure',
    role: 'Editor',
    elementType: 'scene',
    systemMessage: 'You are an editor planning how to cut a scene.',
    userPrompt: 'Describe the editing approach: cutting rhythm, when to use close-ups vs wide shots, transitions, and how to build the scene\'s momentum.',
  },
  {
    id: 'edit-montage',
    title: 'Montage Sequence',
    role: 'Editor',
    elementType: 'scene',
    systemMessage: 'You are an editor designing a montage sequence.',
    userPrompt: 'Describe the montage structure: shot selection, pacing, music integration, and how it compresses time while advancing the story.',
  },

  // Sound Templates
  {
    id: 'sound-design',
    title: 'Overall Sound Design',
    role: 'Sound',
    systemMessage: 'You are a sound designer establishing the sonic landscape of a film.',
    userPrompt: 'Describe the sound design philosophy: use of silence, ambient textures, sound motifs, and how sound supports the emotional journey.',
  },
  {
    id: 'sound-location',
    title: 'Location Sound Profile',
    role: 'Sound',
    elementType: 'location',
    systemMessage: 'You are a sound designer planning the sonic character of a location.',
    userPrompt: 'Describe the ambient sounds, acoustic properties, and sonic atmosphere of this location. What does it sound like?',
  },
  {
    id: 'sound-scene',
    title: 'Scene Sound Design',
    role: 'Sound',
    elementType: 'scene',
    systemMessage: 'You are a sound designer planning audio for a specific scene.',
    userPrompt: 'Describe the sound layers: dialogue, foley, ambient sound, music, and how sound enhances the emotional impact of this scene.',
  },
];

export function getTemplatesByRole(role: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(t => t.role === role);
}

export function getTemplatesByElementType(elementType: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(t => t.elementType === elementType);
}

export function getAllTemplates(): PromptTemplate[] {
  return PROMPT_TEMPLATES;
}
