import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfileSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileSetupDialog({ open, onOpenChange }: ProfileSetupDialogProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile created successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Welcome to the Studio</DialogTitle>
            <DialogDescription>
              Let's set up your profile. What should we call you?
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="name" className="mb-2 block">
              Your Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? 'Creating...' : 'Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
