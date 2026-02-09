import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Save, Trash2 } from 'lucide-react';
import { useProjects } from '../useProjects';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ProjectSwitcher() {
  const {
    currentProject,
    backendProjects,
    isAnonymous,
    saveProject,
    createNewProject,
    switchProject,
    deleteCurrentProject,
    isSaving,
  } = useProjects();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {currentProject.title}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>
              {isAnonymous ? 'Draft Project' : 'Your Projects'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!isAnonymous && backendProjects.length > 0 && (
              <>
                {backendProjects.map((project, index) => (
                  <DropdownMenuItem key={index} onClick={() => switchProject(index)}>
                    {project.title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={createNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </DropdownMenuItem>
            {!isAnonymous && (
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Current
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {!isAnonymous && (
          <Button onClick={saveProject} disabled={isSaving} variant="default">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentProject.title}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteCurrentProject();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
