export interface CreateNoteRequest {
  content: string;
  durationInHours: number;
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
}

export interface UpdateNoteRequest {
  content: string;
}
