import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2 } from 'lucide-react';
import { useProjects } from '../../projects/useProjects';
import { deleteCharacter, deleteLocation, deleteScene } from '../state/projectDraft';

export default function ProjectOutlinePanel() {
  const { currentProject, updateCurrentProject } = useProjects();

  if (!currentProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Outline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No project loaded</p>
        </CardContent>
      </Card>
    );
  }

  const handleAddCharacter = () => {
    const newCharacter = {
      id: `char-${Date.now()}`,
      name: 'New Character',
      description: '',
    };
    updateCurrentProject({
      ...currentProject,
      characters: [...currentProject.characters, newCharacter],
    });
  };

  const handleDeleteCharacter = (id: string) => {
    updateCurrentProject(deleteCharacter(currentProject, id));
  };

  const handleUpdateCharacter = (id: string, field: 'name' | 'description', value: string) => {
    updateCurrentProject({
      ...currentProject,
      characters: currentProject.characters.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const handleAddLocation = () => {
    const newLocation = {
      id: `loc-${Date.now()}`,
      name: 'New Location',
      description: '',
    };
    updateCurrentProject({
      ...currentProject,
      locations: [...currentProject.locations, newLocation],
    });
  };

  const handleDeleteLocation = (id: string) => {
    updateCurrentProject(deleteLocation(currentProject, id));
  };

  const handleUpdateLocation = (id: string, field: 'name' | 'description', value: string) => {
    updateCurrentProject({
      ...currentProject,
      locations: currentProject.locations.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    });
  };

  const handleAddScene = () => {
    const newScene = {
      title: 'New Scene',
      description: '',
    };
    updateCurrentProject({
      ...currentProject,
      scenes: [...currentProject.scenes, newScene],
    });
  };

  const handleDeleteScene = (index: number) => {
    updateCurrentProject(deleteScene(currentProject, index));
  };

  const handleUpdateScene = (index: number, field: 'title' | 'description', value: string) => {
    updateCurrentProject({
      ...currentProject,
      scenes: currentProject.scenes.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    });
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Project Outline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-6 pr-4">
            <div>
              <Label htmlFor="title" className="mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                value={currentProject.title}
                onChange={(e) =>
                  updateCurrentProject({ ...currentProject, title: e.target.value })
                }
                placeholder="Project title"
              />
            </div>

            <div>
              <Label htmlFor="logline" className="mb-2 block">
                Logline
              </Label>
              <Textarea
                id="logline"
                value={currentProject.logline}
                onChange={(e) =>
                  updateCurrentProject({ ...currentProject, logline: e.target.value })
                }
                placeholder="One-sentence summary of your story"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="synopsis" className="mb-2 block">
                Synopsis
              </Label>
              <Textarea
                id="synopsis"
                value={currentProject.synopsis}
                onChange={(e) =>
                  updateCurrentProject({ ...currentProject, synopsis: e.target.value })
                }
                placeholder="Detailed story summary"
                rows={4}
              />
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Characters</Label>
                <Button size="sm" variant="outline" onClick={handleAddCharacter}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {currentProject.characters.map((char) => (
                  <Card key={char.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={char.name}
                          onChange={(e) =>
                            handleUpdateCharacter(char.id, 'name', e.target.value)
                          }
                          placeholder="Character name"
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteCharacter(char.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={char.description}
                        onChange={(e) =>
                          handleUpdateCharacter(char.id, 'description', e.target.value)
                        }
                        placeholder="Character description"
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
                {currentProject.characters.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No characters yet
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Locations</Label>
                <Button size="sm" variant="outline" onClick={handleAddLocation}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {currentProject.locations.map((loc) => (
                  <Card key={loc.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={loc.name}
                          onChange={(e) =>
                            handleUpdateLocation(loc.id, 'name', e.target.value)
                          }
                          placeholder="Location name"
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteLocation(loc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={loc.description}
                        onChange={(e) =>
                          handleUpdateLocation(loc.id, 'description', e.target.value)
                        }
                        placeholder="Location description"
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
                {currentProject.locations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No locations yet
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Scenes</Label>
                <Button size="sm" variant="outline" onClick={handleAddScene}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {currentProject.scenes.map((scene, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={scene.title}
                          onChange={(e) =>
                            handleUpdateScene(index, 'title', e.target.value)
                          }
                          placeholder="Scene title"
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteScene(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={scene.description}
                        onChange={(e) =>
                          handleUpdateScene(index, 'description', e.target.value)
                        }
                        placeholder="Scene description"
                        rows={2}
                      />
                    </div>
                  </Card>
                ))}
                {currentProject.scenes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No scenes yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
