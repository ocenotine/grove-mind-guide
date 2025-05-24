
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Plus, Trash2, Calendar } from 'lucide-react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryProps {
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSessionSelect, onNewChat }) => {
  const {
    chatSessions,
    currentSessionId,
    isLoading,
    createChatSession,
    deleteSession,
  } = useChatHistory();

  const handleSessionClick = async (sessionId: string) => {
    console.log('Session clicked:', sessionId);
    onSessionSelect(sessionId);
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            Chat History
          </CardTitle>
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
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4">
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
            <div className="space-y-2">
              {chatSessions.map((session, index) => (
                <div key={session.id}>
                  <div
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSessionClick(session.id)}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      onClick={(e) => handleDeleteSession(e, session.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {index < chatSessions.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChatHistory;
