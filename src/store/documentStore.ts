// Fix for document_count and flashcard_count references
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuthStore } from './authStore';

interface Document {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  fileType: string;
  pages: number;
  size: number;
  userId: string;
  institutionId: string | null;
  groupId: string | null;
  storagePath: string;
  summary: string | null;
  content: string | null;
}

interface Flashcard {
  id: string;
  front_content: string;
  back_content: string;
  documentId: string;
  createdAt: string;
  userId: string;
}

interface DocumentState {
  documents: Document[];
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  removeDocument: (documentId: string) => void;
  setDocumentSummary: (documentId: string, summary: string) => Promise<void>;
  setFlashcards: (flashcards: Flashcard[]) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  removeFlashcard: (flashcardId: string) => void;
  fetchDocuments: () => Promise<void>;
  fetchFlashcards: (documentId: string) => Promise<void>;
  uploadDocument: (file: File, title: string, description: string) => Promise<void>;
  saveFlashcards: (documentId: string, flashcards: { question: string; answer: string }[]) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  flashcards: [],
  loading: false,
  error: null,

  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => set((state) => ({ documents: [...state.documents, document] })),
  removeDocument: (documentId) => set((state) => ({ documents: state.documents.filter((doc) => doc.id !== documentId) })),
  setDocumentSummary: async (documentId, summary) => {
    try {
      // Optimistically update the document in the store
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === documentId ? { ...doc, summary } : doc
        ),
      }));

      // Update the document in the database
      const { error } = await supabase
        .from('research_uploads')
        .update({ summary })
        .eq('id', documentId);

      if (error) {
        console.error("Error updating document summary:", error);
        toast({
          title: 'Update failed',
          description: error.message,
          variant: 'destructive',
        });

        // Revert the optimistic update if the database update fails
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === documentId ? { ...doc, summary: null } : doc
          ),
        }));
      } else {
        toast({
          title: 'Summary updated',
          description: 'Document summary has been updated successfully',
        });
      }
    } catch (error) {
      console.error("Error updating document summary:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  },
  setFlashcards: (flashcards) => set({ flashcards }),
  addFlashcard: (flashcard) => set((state) => ({ flashcards: [...state.flashcards, flashcard] })),
  removeFlashcard: (flashcardId) => set((state) => ({ flashcards: state.flashcards.filter((card) => card.id !== flashcardId) })),

  fetchDocuments: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('research_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      set({ documents: data || [] });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchFlashcards: async (documentId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('documentId', documentId)
        .order('createdAt', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      set({ flashcards: data || [] });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  uploadDocument: async (file, title, description) => {
    set({ loading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${title.replace(/ /g, '_')}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Create document record in Supabase
      const { data: documentData, error: documentError } = await supabase
        .from('research_uploads')
        .insert([
          {
            title,
            description,
            fileType: fileExt,
            pages: 1, // Placeholder
            size: file.size,
            userId: user.id,
            institutionId: user.institution_id,
            groupId: null,
            storagePath: uploadData?.path,
          },
        ])
        .select()
        .single();

      if (documentError) {
        throw new Error(documentError.message);
      }

      // Update document count in profile
      try {
        const { user } = useAuthStore.getState();
        if (user) {
          await supabase
            .from('profiles')
            .update({ document_count: (user.document_count || 0) + 1 })
            .eq('id', user.id);
            
          // Update user in auth store
          useAuthStore.setState({
            user: {
              ...user,
              document_count: (user.document_count || 0) + 1
            }
          });
        }
      } catch (error) {
        console.error("Error updating document count:", error);
      }
      
      set({
        documents: [...get().documents, documentData],
        loading: false,
      });
      toast({
        title: 'Upload successful',
        description: `${title} has been uploaded successfully`,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  },
  
  saveFlashcards: async (documentId, flashcards) => {
    set({ loading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Map flashcards to the database schema
      const flashcardData = flashcards.map((card) => ({
        front_content: card.question,
        back_content: card.answer,
        documentId: documentId,
        userId: user.id,
      }));

      // Insert flashcards into Supabase
      const { data, error } = await supabase
        .from('flashcards')
        .insert(flashcardData)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      
      // Update flashcard count
      try {
        const { user } = useAuthStore.getState();
        if (user) {
          await supabase
            .from('profiles')
            .update({ flashcard_count: (user.flashcard_count || 0) + flashcards.length })
            .eq('id', user.id);
            
          // Update user in auth store
          useAuthStore.setState({
            user: {
              ...user,
              flashcard_count: (user.flashcard_count || 0) + flashcards.length
            }
          });
        }
      } catch (error) {
        console.error("Error updating flashcard count:", error);
      }
      
      set({
        flashcards: [...get().flashcards, ...data],
        loading: false,
      });
      toast({
        title: 'Flashcards saved',
        description: `${flashcards.length} flashcards have been saved successfully`,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast({
        title: 'Save failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  },
}));
