
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/animations/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader, Upload, FileText, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useDocuments } from '@/hooks/useDocuments';
import PDFUploader from '@/components/document/PDFUploader';
import { chatWithDocument } from '@/utils/nlpUtils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UploadedDocument {
  id: string;
  title: string;
  content: string;
}

export default function AIChat() {
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('document');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { fetchDocumentById } = useDocuments();

  // Load document if documentId is provided in URL
  useEffect(() => {
    const loadDocument = async () => {
      if (documentId) {
        try {
          const doc = await fetchDocumentById(documentId);
          if (doc) {
            setUploadedDocument({
              id: doc.id,
              title: doc.title,
              content: doc.content || ''
            });
            
            // Add initial message about the document
            const initialMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: `I've loaded your document "${doc.title}". I can now answer questions about its content. What would you like to know?`,
              timestamp: new Date()
            };
            setMessages([initialMessage]);
          }
        } catch (error) {
          console.error('Error loading document:', error);
          toast({
            title: "Error",
            description: "Failed to load the document",
            variant: "destructive"
          });
        }
      }
    };

    loadDocument();
  }, [documentId, fetchDocumentById]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDocumentUpload = (documentId: string) => {
    // Reload the document after upload
    fetchDocumentById(documentId).then(doc => {
      if (doc) {
        setUploadedDocument({
          id: doc.id,
          title: doc.title,
          content: doc.content || ''
        });
        setShowUploader(false);
        
        const uploadMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Great! I've loaded your document "${doc.title}". I can now answer questions about its content. What would you like to know?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, uploadMessage]);
        
        toast({
          title: "Document uploaded",
          description: "You can now chat about your document",
        });
      }
    });
  };

  const removeDocument = () => {
    setUploadedDocument(null);
    setMessages([]);
    const removeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Document removed. Feel free to upload a new document or ask me general questions!",
      timestamp: new Date()
    };
    setMessages([removeMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      if (uploadedDocument && uploadedDocument.content) {
        // Use document-specific chat
        console.log('Chatting with document:', uploadedDocument.title);
        console.log('Document content length:', uploadedDocument.content.length);
        
        const result = await chatWithDocument(
          uploadedDocument.id, 
          uploadedDocument.content, 
          userMessage.content
        );
        
        if (result.success) {
          response = result.response;
        } else {
          throw new Error(result.error || 'Failed to generate response');
        }
      } else {
        // General AI chat without document context
        response = generateGeneralResponse(userMessage.content);
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: uploadedDocument 
          ? "I'm sorry, I had trouble understanding your document. Please make sure it contains readable text, or try asking your question differently."
          : "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate response',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateGeneralResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('upload') || input.includes('document')) {
      return "To chat about a document, please upload it first using the upload button above. I can then answer questions about its content, summarize it, or help you understand key concepts.";
    }
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm your AI assistant. Upload a document and I can help you understand its content, answer questions about it, or provide summaries. You can also ask me general questions!";
    }
    
    return "I can help you with document analysis once you upload a document. Feel free to upload a PDF or text file, and I'll be able to answer questions about its content!";
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>
                  Please log in to access the AI chat feature.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">AI Document Chat</h1>
            <p className="text-muted-foreground">
              Upload a document and chat with AI about its content
            </p>
          </div>

          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader className="flex-shrink-0 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle>AI Assistant</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {uploadedDocument && (
                    <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
                      <FileText className="h-4 w-4" />
                      <span className="max-w-32 truncate">{uploadedDocument.title}</span>
                      <button onClick={removeDocument} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploader(!showUploader)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
              
              {showUploader && (
                <div className="mt-4">
                  <PDFUploader onUploadSuccess={handleDocumentUpload} />
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !uploadedDocument && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium mb-2">Welcome to AI Document Chat!</p>
                  <p>Upload a document to start chatting about its content, or ask me general questions.</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.role === 'assistant'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <Bot className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        message.role === 'assistant'
                          ? 'bg-muted/60 border border-border/40'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/60 border border-border/40">
                    <div className="flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <div className="flex-shrink-0 border-t p-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    uploadedDocument 
                      ? `Ask about "${uploadedDocument.title}"...`
                      : "Type your message or upload a document..."
                  }
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputMessage.trim()}
                  onClick={handleSendMessage}
                >
                  {isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
