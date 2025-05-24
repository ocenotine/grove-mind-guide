
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/hooks/use-toast';

interface ChatHistoryMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  session_id: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export const useChatHistory = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  // Load chat sessions
  const loadChatSessions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const sessions = data?.map((session: any) => ({
        id: session.id,
        title: session.title,
        created_at: new Date(session.created_at || ''),
        updated_at: new Date(session.updated_at || ''),
      })) || [];

      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a specific session
  const loadSessionMessages = async (sessionId: string): Promise<ChatHistoryMessage[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant',
        timestamp: new Date(msg.created_at || ''),
        session_id: msg.session_id,
      })) || [];
    } catch (error) {
      console.error('Error loading session messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Create a new chat session
  const createChatSession = async (title: string = 'New Chat') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: ChatSession = {
        id: data.id,
        title: data.title,
        created_at: new Date(data.created_at || ''),
        updated_at: new Date(data.updated_at || ''),
      };

      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(data.id);
      
      return data.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  };

  // Save a message to the current session
  const saveMessage = async (message: Omit<ChatHistoryMessage, 'id' | 'timestamp' | 'session_id'>) => {
    if (!user || !currentSessionId) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          user_id: user.id,
          content: message.content,
          role: message.role,
        });

      if (error) throw error;

      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSessionId);

      // Reload sessions to reflect updated timestamp
      loadChatSessions();

    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Delete a chat session
  const deleteSession = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }

      toast({
        title: 'Chat deleted',
        description: 'Chat session has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat session',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadChatSessions();
    }
  }, [user]);

  return {
    chatSessions,
    currentSessionId,
    setCurrentSessionId,
    isLoading,
    loadChatSessions,
    loadSessionMessages,
    createChatSession,
    saveMessage,
    deleteSession,
  };
};
