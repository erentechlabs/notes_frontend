export type EditMode = 'full' | 'checkbox-only' | 'read-only';

export interface CreateNoteRequest {
  content: string;
  durationInHours: number;
  editMode?: EditMode; // Optional: defaults to 'full' on backend
  isReadOnly?: boolean;
  isPartialEditingOnly?: boolean;
}

export interface CreateNoteResponse {
  urlCode: string;
  shareUrl: string;
  expiresAt: string;
}

export interface NoteResponse {
  urlCode: string;
  content: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  isExpired: boolean;
  editMode?: EditMode; // Backend may not return this yet
  isReadOnly?: boolean;
  isPartialEditingOnly?: boolean;
}

export interface UpdateNoteRequest {
  content: string;
}
