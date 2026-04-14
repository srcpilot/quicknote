'use client';

import { getNotes } from '@/app/actions';
import { NoteDialog } from '@/components/note-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getNotes().then(setNotes);
  }, []);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      <div className="grid gap-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 border rounded-lg">
            <h2 className="font-semibold">{note.title}</h2>
            <p className="text-muted-foreground">{note.content}</p>
          </div>
        ))}
      </div>

      <NoteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </main>
  );
}
