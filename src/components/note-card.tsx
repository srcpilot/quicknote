'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pin, PinOff, Trash2 } from 'lucide-react';
import { deleteNote, togglePin } from '@/app/actions';

export type Note = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: Date;
};

interface NoteCardProps {
  readonly note: Note;
}

export function NoteCard({ note }: NoteCardProps): React.ReactElement {
  const handleDelete = async (): Promise<void> => {
    await deleteNote(note.id);
  };

  const handleTogglePin = async (): Promise<void> => {
    await togglePin(note.id, !note.pinned);
  };

  return (
    <Card className={`relative transition-all hover:shadow-md ${note.pinned ? 'border-primary/50 bg-primary/5' : ''}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold leading-tight">
            {note.title}
          </CardTitle>
          {note.pinned && (
            <Badge variant="secondary" className="w-fit px-1 py-0 text-[10px] uppercase tracking-wider">
              Pinned
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleTogglePin}>
              {note.pinned ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {note.content}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
