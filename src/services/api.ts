import axios from 'axios';
import type { CreateNoteRequest, CreateNoteResponse, NoteResponse, UpdateNoteRequest } from '@/types/note';

const api = axios.create({
  baseURL: 'https://notefade-861651561873.europe-west1.run.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

type FrontendEditMode = import('@/types/note').EditMode;

const VALID_EDIT_MODES: FrontendEditMode[] = ['full', 'checkbox-only', 'read-only'];

function normalizeEditMode(value: unknown): FrontendEditMode | undefined {
  if (!value || typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.toLowerCase().replace(/_/g, '-') as FrontendEditMode;
  return VALID_EDIT_MODES.includes(normalized) ? normalized : undefined;
}

// Map backend fields to frontend's editMode
function mapBackendNote(note: Partial<import('@/types/note').NoteResponse>) {
  const rawNote = note as Record<string, unknown>;

  const normalizedFromEditMode = normalizeEditMode(rawNote.editMode);

  const rawIsReadOnly = (rawNote.isReadOnly ?? rawNote.readOnly ?? rawNote.read_only) as
    | boolean
    | null
    | undefined;
  const rawCheckboxOnly = (
    rawNote.isPartialEditingOnly ??
    rawNote.partialEditingOnly ??
    rawNote.checkboxOnly ??
    rawNote.isCheckboxOnly
  ) as boolean | null | undefined;

  let editMode: FrontendEditMode = normalizedFromEditMode || 'full';

  if (!normalizedFromEditMode) {
    if (rawIsReadOnly === true) {
      editMode = 'read-only';
    } else if (rawCheckboxOnly === true) {
      editMode = 'checkbox-only';
    }
  }

  const isReadOnly = Boolean(
    rawIsReadOnly ?? (editMode === 'read-only')
  );
  const isPartialEditingOnly = Boolean(
    rawCheckboxOnly ?? (editMode === 'checkbox-only')
  );

  return {
    ...note,
    editMode,
    isReadOnly,
    isPartialEditingOnly,
  } as import('@/types/note').NoteResponse;
}

export const noteApi = {
  createNote: async (data: CreateNoteRequest): Promise<CreateNoteResponse> => {
    const response = await api.post<CreateNoteResponse>('/v1/notes', data);
    return response.data;
  },

  getNote: async (urlCode: string): Promise<NoteResponse> => {
    const response = await api.get<NoteResponse>(`/v1/notes/${urlCode}`);
    return mapBackendNote(response.data);
  },

  updateNote: async (urlCode: string, data: UpdateNoteRequest): Promise<NoteResponse> => {
    const response = await api.put<NoteResponse>(`/v1/notes/${urlCode}`, data);
    return mapBackendNote(response.data);
  },
};

export default api;
