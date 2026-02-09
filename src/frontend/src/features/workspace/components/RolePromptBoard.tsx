import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit2, Trash2, Copy, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { PRODUCTION_ROLES, ROLE_DESCRIPTIONS } from '../roles';
import RoleIcon from '../../assets/RoleIcon';
import PromptEntryEditor from './PromptEntryEditor';
import { useProjects } from '../../projects/useProjects';
import type { RolePromptEntry } from '../types';
import { formatPromptForClipboard } from '../utils/formatPromptForClipboard';

export default function RolePromptBoard() {
  const { currentProject, updateCurrentProject } = useProjects();
  const [selectedRole, setSelectedRole] = useState(PRODUCTION_ROLES[0]);
  const [editingPrompt, setEditingPrompt] = useState<RolePromptEntry | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterValue, setFilterValue] = useState<string>('');

  if (!currentProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No project loaded</p>
        </CardContent>
      </Card>
    );
  }

  const getFilteredPrompts = () => {
    let filtered = currentProject.rolePrompts.filter((p) => p.role === selectedRole);

    if (filterType === 'element' && filterValue) {
      const [elementType, elementId] = filterValue.split(':');
      filtered = filtered.filter(
        (p) => p.elementType === elementType && (!elementId || p.elementId === elementId)
      );
    }

    return filtered;
  };

  const rolePrompts = getFilteredPrompts();

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setIsEditorOpen(true);
  };

  const handleEditPrompt = (prompt: RolePromptEntry) => {
    setEditingPrompt(prompt);
    setIsEditorOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    updateCurrentProject({
      ...currentProject,
      rolePrompts: currentProject.rolePrompts.filter((p) => p.id !== id),
    });
    toast.success('Prompt deleted');
  };

  const handleCopyPrompt = async (prompt: RolePromptEntry) => {
    try {
      const formatted = formatPromptForClipboard(prompt);
      await navigator.clipboard.writeText(formatted);
      toast.success('Prompt copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy prompt');
      console.error(error);
    }
  };

  const handleSavePrompt = (prompt: Omit<RolePromptEntry, 'id' | 'role'>) => {
    if (editingPrompt) {
      updateCurrentProject({
        ...currentProject,
        rolePrompts: currentProject.rolePrompts.map((p) =>
          p.id === editingPrompt.id ? { ...p, ...prompt } : p
        ),
      });
      toast.success('Prompt updated');
    } else {
      const newPrompt: RolePromptEntry = {
        id: `prompt-${Date.now()}`,
        role: selectedRole,
        ...prompt,
      };
      updateCurrentProject({
        ...currentProject,
        rolePrompts: [...currentProject.rolePrompts, newPrompt],
      });
      toast.success('Prompt added');
    }
    setIsEditorOpen(false);
    setEditingPrompt(null);
  };

  const getElementFilterOptions = () => {
    const options: { value: string; label: string }[] = [
      { value: 'all', label: 'All prompts' },
      { value: 'logline:', label: 'Logline' },
      { value: 'synopsis:', label: 'Synopsis' },
    ];

    currentProject.characters.forEach((char) => {
      options.push({
        value: `character:${char.id}`,
        label: `Character: ${char.name}`,
      });
    });

    currentProject.locations.forEach((loc) => {
      options.push({
        value: `location:${loc.id}`,
        label: `Location: ${loc.name}`,
      });
    });

    currentProject.scenes.forEach((scene, index) => {
      options.push({
        value: `scene:scene-${index}`,
        label: `Scene: ${scene.title}`,
      });
    });

    return options;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Production Team Prompts</CardTitle>
            <CardDescription>
              AI-ready prompts organized by role and element
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filterType === 'element' ? filterValue : 'all'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setFilterType('all');
                  setFilterValue('');
                } else {
                  setFilterType('element');
                  setFilterValue(value);
                }
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getElementFilterOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
            {PRODUCTION_ROLES.map((role) => (
              <TabsTrigger key={role} value={role} className="text-xs">
                {role}
              </TabsTrigger>
            ))}
          </TabsList>

          {PRODUCTION_ROLES.map((role) => (
            <TabsContent key={role} value={role} className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <RoleIcon role={role} />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ROLE_DESCRIPTIONS[role]}
                  </p>
                </div>
                <Button onClick={handleAddPrompt}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prompt
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-28rem)]">
                <div className="space-y-3 pr-4">
                  {rolePrompts.map((prompt) => (
                    <Card key={prompt.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base">{prompt.title}</CardTitle>
                            {prompt.elementLabel && (
                              <Badge variant="outline" className="mt-1">
                                {prompt.elementLabel}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleCopyPrompt(prompt)}
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditPrompt(prompt)}
                              title="Edit prompt"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeletePrompt(prompt.id)}
                              title="Delete prompt"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {prompt.systemMessage && (
                          <div className="p-3 bg-muted/50 rounded-md">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">
                              SYSTEM MESSAGE
                            </p>
                            <p className="text-sm">{prompt.systemMessage}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            PROMPT
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{prompt.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {rolePrompts.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        {filterType === 'element'
                          ? 'No prompts for this filter'
                          : `No prompts yet for ${role}`}
                      </p>
                      <Button onClick={handleAddPrompt} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Prompt
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <PromptEntryEditor
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          onSave={handleSavePrompt}
          initialData={editingPrompt || undefined}
          currentRole={selectedRole}
          characters={currentProject.characters}
          locations={currentProject.locations}
          scenes={currentProject.scenes}
        />
      </CardContent>
    </Card>
  );
}
