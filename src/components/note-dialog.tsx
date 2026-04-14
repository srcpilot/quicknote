'use client';

import * as React from 'react';
import { useActionState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createNote, updateNote, type NoteFormState } from '@/app/actions';
import { toast } from 'sonner';

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: {
    id: number;
    title: string;
    content: string;
    tags: string[];
  } | null;
}

export function NoteDialog({ open, onOpenChange, note }: NoteDialogProps) {
  const isEditMode = !!note;
  const [isPending, startTransition] = useTransition();

  const [state, formAction, isFormPending] = useActionState(
    async (prevState: NoteFormState, formData: FormData) => {
      const result = await (isEditMode ? updateNote(prevState, formData) : createNote(prevState, formData));
      
      if (result.success) {
        toast.success(isEditMode ? 'Note updated' : 'Note created');
        onOpenChange(false);
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    },
    { success: false }
  );

  const [tagInput, setTagInput] = React.useState('');

  React.useEffect(() => {
    if (note) {
      setTagInput(note.tags.join(', '));
    } else {
      setTagInput('');
    }
  }, [note]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      // In a real app, we might manage tags in a separate state, 
      // but for this spec, we'll just let the comma-separated string handle it.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Note' : 'New Note'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Make changes to your note here.' : 'Create a new note with your thoughts.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={note?.id} />
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="Note title" 
              defaultValue={note?.title} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="Write your note..." 
              className="min-h-[150px]"
              defaultValue={note?.content} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input 
              id="tags" 
              name="tags" 
              placeholder="work, personal, idea" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tagInput.split(',').map((tag) => {
                const trimmed = tag.trim();
                return trimmed ? <Badge key={trimmed} variant="secondary">{trimmed}</Badge> : null;
              })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isFormPending}>
              {isFormPending ? 'Saving...' : isEditMode ? 'Update Note' : 'Create Note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
