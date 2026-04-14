'use server';

import { db } from '@/db';
import { notes } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type UpdateNoteData = Partial<{
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
}>;

export async function getNotes(): Promise<typeof notes.$inferSelect[]> {
  return await db.select().from(notes).orderBy(
    desc(notes.pinned),
    desc(notes.updatedAt)
  );
}

export async function createNote(
  title: string,
  content: string,
  tags: string[]
): Promise<void> {
  await db.insert(notes).values({
    title,
    content,
    tags,
  });
  revalidatePath('/');
}

export async function updateNote(
  id: number,
  data: UpdateNoteData
): Promise<void> {
  const updatePayload: Record<string, unknown> = {};
  
  if (data.title !== undefined) updatePayload.title = data.title;
  if (data.content !== undefined) updatePayload.content = data.content;
  if (data.pinned !== undefined) updatePayload.pinned = data.pinned;
  if (data.tags !== undefined) updatePayload.tags = data.tags;

  await db.update(notes).set(updatePayload).where(eq(notes.id, id));
  revalidatePath('/');
}

export async function deleteNote(id: number): Promise<void> {
  await db.delete(notes).where(eq(notes.id, id));
  revalidatePath('/');
}

export async function togglePin(id: number): Promise<void> {
  const note = await db.query.notes.findFirst({
    where: eq(notes.id, id),
  });

  if (!note) {
    throw new Error('Note not found');
  }

  await db.update(notes)
    .set({ pinned: !note.pinned })
    .where(eq(notes.id, id));
  
  revalidatePath('/');
}
