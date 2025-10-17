import axios from 'axios';
import type { CreateNoteRequest, CreateNoteResponse, NoteResponse, UpdateNoteRequest } from '@/types/note';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const noteApi = {
  createNote: async (data: CreateNoteRequest): Promise<CreateNoteResponse> => {
    const response = await api.post<CreateNoteResponse>('/notes', data);
    return response.data;
  },

  getNote: async (urlCode: string): Promise<NoteResponse> => {
    const response = await api.get<NoteResponse>(`/notes/${urlCode}`);
    return response.data;
  },

  updateNote: async (urlCode: string, data: UpdateNoteRequest): Promise<NoteResponse> => {
    const response = await api.put<NoteResponse>(`/notes/${urlCode}`, data);
    return response.data;
  },
};

export default api;
