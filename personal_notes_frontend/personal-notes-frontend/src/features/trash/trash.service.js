import { getTrashNotes, restoredNote } from "../notes/notes.service";

export const getDeletedNotes = getTrashNotes;
export const restoreDeletedNote = restoredNote;
