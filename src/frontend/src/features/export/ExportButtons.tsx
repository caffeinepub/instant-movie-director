import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileJson } from 'lucide-react';
import { useProjects } from '../projects/useProjects';
import { exportProjectAsText, exportProjectAsJSON } from './exportProject';
import { toast } from 'sonner';

export default function ExportButtons() {
  const { currentProject } = useProjects();

  const handleExportText = () => {
    if (!currentProject) {
      toast.error('No project to export');
      return;
    }
    exportProjectAsText(currentProject);
    toast.success('Exported as text file');
  };

  const handleExportJSON = () => {
    if (!currentProject) {
      toast.error('No project to export');
      return;
    }
    exportProjectAsJSON(currentProject);
    toast.success('Exported as JSON file');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportText}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
