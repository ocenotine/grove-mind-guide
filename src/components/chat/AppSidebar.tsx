
import React from 'react';
import { Calendar, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useChatHistory } from '@/hooks/useChatHistory';

interface AppSidebarProps {
  onSessionSelect: (sessionId: string, messages: any[]) => void;
  onNewChat: () => void;
}

export function AppSidebar({ onSessionSelect, onNewChat }: AppSidebarProps) {
  const {
    chatSessions,
    currentSessionId,
    isLoading,
    loadSessionMessages,
    createChatSession,
    deleteSession,
  } = useChatHistory();

  const handleSessionClick = async (sessionId: string) => {
    const messages = await loadSessionMessages(sessionId);
    onSessionSelect(sessionId, messages);
  };

  const handleNewChat = async () => {
    const sessionId = await createChatSession();
    if (sessionId) {
      onNewChat();
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    await deleteSession(sessionId);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat History
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading chat history...</div>
              </div>
            ) : chatSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <div className="text-sm text-muted-foreground mb-2">No chat history yet</div>
                <Button variant="outline" size="sm" onClick={handleNewChat}>
                  Start your first chat
                </Button>
              </div>
            ) : (
              <SidebarMenu>
                {chatSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton
                      onClick={() => handleSessionClick(session.id)}
                      isActive={currentSessionId === session.id}
                      className="w-full justify-start"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {session.title}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(session.updated_at, { addSuffix: true })}
                        </div>
                      </div>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      showOnHover
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
