import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';
import type { RolePromptEntry, Character, Location } from '../types';
import type { Scene } from '../../../backend';
import { getTemplatesByRole, type PromptTemplate } from '../promptTemplates';

interface PromptEntryEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prompt: Omit<RolePromptEntry, 'id' | 'role'>) => void;
  initialData?: Partial<RolePromptEntry>;
  currentRole: string;
  characters: Character[];
  locations: Location[];
  scenes: Scene[];
}

export default function PromptEntryEditor({
  open,
  onOpenChange,
  onSave,
  initialData,
  currentRole,
  characters,
  locations,
  scenes,
}: PromptEntryEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [systemMessage, setSystemMessage] = useState('');
  const [targetType, setTargetType] = useState<string>('none');
  const [targetId, setTargetId] = useState<string>('');

  const templates = getTemplatesByRole(currentRole);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || '');
      setContent(initialData?.content || '');
      setSystemMessage(initialData?.systemMessage || '');
      setTargetType(initialData?.elementType || 'none');
      setTargetId(initialData?.elementId || '');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const promptData: Omit<RolePromptEntry, 'id' | 'role'> = {
      title: title.trim(),
      content: content.trim(),
      systemMessage: systemMessage.trim() || undefined,
    };

    if (targetType !== 'none') {
      promptData.elementType = targetType as any;
      promptData.elementId = targetId;
      
      // Set element label for display
      if (targetType === 'logline') {
        promptData.elementLabel = 'Logline';
      } else if (targetType === 'synopsis') {
        promptData.elementLabel = 'Synopsis';
      } else if (targetType === 'character') {
        const char = characters.find(c => c.id === targetId);
        promptData.elementLabel = char ? `Character: ${char.name}` : 'Character';
      } else if (targetType === 'location') {
        const loc = locations.find(l => l.id === targetId);
        promptData.elementLabel = loc ? `Location: ${loc.name}` : 'Location';
      } else if (targetType === 'scene') {
        const sceneIndex = parseInt(targetId.replace('scene-', ''));
        const scene = scenes[sceneIndex];
        promptData.elementLabel = scene ? `Scene: ${scene.title}` : 'Scene';
      }
    }

    onSave(promptData);

    setTitle('');
    setContent('');
    setSystemMessage('');
    setTargetType('none');
    setTargetId('');
  };

  const handleApplyTemplate = (template: PromptTemplate) => {
    setTitle(template.title);
    setSystemMessage(template.systemMessage);
    setContent(template.userPrompt);
    if (template.elementType) {
      setTargetType(template.elementType);
    }
  };

  const getTargetOptions = () => {
    if (targetType === 'character') return characters;
    if (targetType === 'location') return locations;
    if (targetType === 'scene') return scenes.map((s, i) => ({ id: `scene-${i}`, name: s.title }));
    return [];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Edit Prompt' : 'Add New Prompt'}
            </DialogTitle>
            <DialogDescription>
              Create AI-ready prompts with optional system messages and element targeting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {templates.length > 0 && !initialData && (
              <>
                <div>
                  <Label className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Quick Start Templates
                  </Label>
                  <Select onValueChange={(value) => {
                    const template = templates.find(t => t.id === value);
                    if (template) handleApplyTemplate(template);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
              </>
            )}

            <div>
              <Label htmlFor="title" className="mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Opening scene mood"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="target" className="mb-2 block">
                Target Element (Optional)
              </Label>
              <div className="flex gap-2">
                <Select value={targetType} onValueChange={(value) => {
                  setTargetType(value);
                  setTargetId('');
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No target</SelectItem>
                    <SelectItem value="logline">Logline</SelectItem>
                    <SelectItem value="synopsis">Synopsis</SelectItem>
                    <SelectItem value="character">Character</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="scene">Scene</SelectItem>
                  </SelectContent>
                </Select>

                {targetType !== 'none' && targetType !== 'logline' && targetType !== 'synopsis' && (
                  <Select value={targetId} onValueChange={setTargetId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={`Select ${targetType}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {getTargetOptions().map((option: any) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name || option.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Link this prompt to a specific project element
              </p>
            </div>

            <div>
              <Label htmlFor="systemMessage" className="mb-2 block">
                System Message (Optional)
              </Label>
              <Textarea
                id="systemMessage"
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                placeholder="e.g., You are an experienced film director..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set the AI's role and context
              </p>
            </div>

            <div>
              <Label htmlFor="content" className="mb-2 block">
                Prompt Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your creative direction, notes, or requirements..."
                rows={8}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              {initialData ? 'Update' : 'Add'} Prompt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
