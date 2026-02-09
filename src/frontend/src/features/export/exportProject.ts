import type { ProjectDraft } from '../workspace/types';

export function exportProjectAsText(project: ProjectDraft): void {
  let text = `${project.title}\n${'='.repeat(project.title.length)}\n\n`;

  if (project.logline) {
    text += `LOGLINE\n${project.logline}\n\n`;
  }

  if (project.synopsis) {
    text += `SYNOPSIS\n${project.synopsis}\n\n`;
  }

  if (project.characters.length > 0) {
    text += `CHARACTERS\n${'-'.repeat(10)}\n`;
    project.characters.forEach((char) => {
      text += `\n${char.name}\n${char.description}\n`;
    });
    text += '\n';
  }

  if (project.locations.length > 0) {
    text += `LOCATIONS\n${'-'.repeat(9)}\n`;
    project.locations.forEach((loc) => {
      text += `\n${loc.name}\n${loc.description}\n`;
    });
    text += '\n';
  }

  if (project.scenes.length > 0) {
    text += `SCENES\n${'-'.repeat(6)}\n`;
    project.scenes.forEach((scene, i) => {
      text += `\nScene ${i + 1}: ${scene.title}\n${scene.description}\n`;
    });
    text += '\n';
  }

  if (project.rolePrompts.length > 0) {
    text += `PRODUCTION TEAM PROMPTS\n${'-'.repeat(23)}\n\n`;
    const roleGroups = project.rolePrompts.reduce((acc, prompt) => {
      if (!acc[prompt.role]) acc[prompt.role] = [];
      acc[prompt.role].push(prompt);
      return acc;
    }, {} as Record<string, typeof project.rolePrompts>);

    Object.entries(roleGroups).forEach(([role, prompts]) => {
      text += `${role.toUpperCase()}\n`;
      prompts.forEach((prompt) => {
        text += `\n  ${prompt.title}\n  ${prompt.content.split('\n').join('\n  ')}\n`;
      });
      text += '\n';
    });
  }

  if (project.assembly && project.assembly.timeline.length > 0) {
    text += `ASSEMBLY\n${'-'.repeat(8)}\n\n`;
    text += `Output Type: ${formatOutputType(project.assembly.outputType)}\n`;
    text += `Total Duration: ${formatDuration(calculateTotalDuration(project.assembly))}\n\n`;
    text += `Timeline:\n`;
    
    project.assembly.timeline.forEach((item, i) => {
      const scene = project.scenes[item.sceneIndex];
      text += `\n  ${i + 1}. ${scene?.title || `Scene ${item.sceneIndex + 1}`}\n`;
      if (project.assembly!.outputType === 'music-video' && item.startTime !== undefined) {
        text += `     Start: ${formatDuration(item.startTime)} | Duration: ${formatDuration(item.duration)}\n`;
      } else {
        text += `     Duration: ${formatDuration(item.duration)}\n`;
      }
    });
    text += '\n';
  }

  downloadFile(text, `${project.title}.txt`, 'text/plain');
}

export function exportProjectAsJSON(project: ProjectDraft): void {
  const json = JSON.stringify(project, null, 2);
  downloadFile(json, `${project.title}.json`, 'application/json');
}

function formatOutputType(type: string): string {
  const types: Record<string, string> = {
    'feature-film': 'Feature Film',
    'short-film': 'Short Film',
    'music-video': 'Music Video',
  };
  return types[type] || type;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function calculateTotalDuration(assembly: { outputType: string; timeline: Array<{ duration: number; startTime?: number; sceneIndex: number }> }): number {
  return assembly.timeline.reduce((sum, item) => {
    if (assembly.outputType === 'music-video' && item.startTime !== undefined) {
      return Math.max(sum, item.startTime + item.duration);
    }
    return sum + item.duration;
  }, 0);
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
