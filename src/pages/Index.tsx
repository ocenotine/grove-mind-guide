
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Welcome to <span className="text-primary">MindGrove</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your AI-powered research assistant for document analysis, summarization, and learning
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <Card className="p-6 text-center">
              <h3 className="text-lg font-medium">AI Document Analysis</h3>
              <p className="text-muted-foreground">Upload your research documents and get AI-powered insights</p>
            </Card>
            
            <Card className="p-6 text-center">
              <h3 className="text-lg font-medium">Smart Flashcards</h3>
              <p className="text-muted-foreground">Auto-generate flashcards from your documents for efficient studying</p>
            </Card>
            
            <Card className="p-6 text-center">
              <h3 className="text-lg font-medium">Interactive AI Chat</h3>
              <p className="text-muted-foreground">Chat with our AI about your documents and research questions</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
