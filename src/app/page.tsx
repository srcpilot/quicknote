import { getNotes, deleteNote, togglePin } from "@/app/actions";
import { NoteCard } from "@/components/note-card";
import { SearchBar } from "@/components/search-bar";
import { Empty } from "@/components/ui/empty";

export default async function Page() {
  const notes = await getNotes();

  return (
    <main className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <Empty className="col-span-full py-20" />
        ) : (
          notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))
        )}
      </div>
    </main>
  );
}
