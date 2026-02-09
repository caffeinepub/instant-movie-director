import type { RolePromptEntry } from '../types';

export function formatPromptForClipboard(prompt: RolePromptEntry): string {
  const parts: string[] = [];

  // Title
  parts.push(`# ${prompt.title}`);
  parts.push('');

  // Role
  parts.push(`**Role:** ${prompt.role}`);
  parts.push('');

  // Target element (if any)
  if (prompt.elementType && prompt.elementLabel) {
    parts.push(`**Target:** ${prompt.elementLabel}`);
    parts.push('');
  }

  // System Message (if present)
  if (prompt.systemMessage && prompt.systemMessage.trim()) {
    parts.push('## System Message');
    parts.push('');
    parts.push(prompt.systemMessage.trim());
    parts.push('');
  }

  // User Prompt
  parts.push('## Prompt');
  parts.push('');
  parts.push(prompt.content.trim());

  return parts.join('\n');
}
