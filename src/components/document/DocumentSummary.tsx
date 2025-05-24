
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Sparkles, Loader, AlertCircle } from 'lucide-react';
import { Document } from '@/store/documentStore';
import { generateSummary } from '@/utils/nlpUtils';
import { toast } from '@/components/ui/use-toast';

interface DocumentSummaryProps {
  document: Document;
  className?: string;
}

const DocumentSummary = ({ document, className }: DocumentSummaryProps) => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(document.summary || null);

  const handleCopy = () => {
    if (summary || document.summary) {
      navigator.clipboard.writeText(summary || document.summary || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Summary has been copied to clipboard."
      });
    }
  };

  const handleGenerateSummary = async () => {
    console.log('Document content available:', !!document.content);
    console.log('Document content length:', document.content?.length || 0);
    console.log('Document file type:', document.file_type);
    
    if (!document.content || document.content.trim().length < 50) {
      toast({
        title: "Content not available",
        description: "This document doesn't have enough readable content to summarize. Please ensure the document was properly uploaded and contains text.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Starting summary generation...');
      const result = await generateSummary(document.id, document.content);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to generate summary");
      }
      
      setSummary(result.summary);
      toast({
        title: "Summary generated",
        description: "Document summary created successfully."
      });
    } catch (error) {
      console.error('Summary generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatSummaryContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      
      if (!trimmed) {
        return <div key={index} className="h-3" />;
      }
      
      // Handle headings
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-foreground border-b pb-2">
            {trimmed.substring(2)}
          </h2>
        );
      }
      
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-5 mb-2 text-foreground">
            {trimmed.substring(3)}
          </h3>
        );
      }
      
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={index} className="text-base font-medium mt-4 mb-2 text-foreground">
            {trimmed.substring(4)}
          </h4>
        );
      }
      
      // Handle bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={index} className="ml-6 mb-1 text-sm leading-relaxed list-disc">
            {trimmed.substring(2)}
          </li>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={index} className="ml-6 mb-1 text-sm leading-relaxed list-decimal">
            {trimmed.substring(trimmed.indexOf('.') + 1).trim()}
          </li>
        );
      }
      
      // Handle bold text (simple **text** format)
      const boldFormatted = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Regular paragraphs
      return (
        <p 
          key={index} 
          className="mb-3 text-sm leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: boldFormatted }}
        />
      );
    });
  };

  const displaySummary = summary || document.summary;

  if (!displaySummary) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {!document.content || document.content.trim().length < 50 ? (
              <div className="space-y-4 max-w-md">
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto" />
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    No readable content found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This document appears to contain no readable text or only images. 
                    Please ensure the document contains text content.
                  </p>
                  <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                    <div>File type: {document.file_type || 'Unknown'}</div>
                    <div>Content length: {document.content?.length || 0} characters</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <Sparkles className="h-12 w-12 text-primary mx-auto" />
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Ready to generate summary
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Create an AI-powered summary of this document to quickly understand its key points.
                  </p>
                </div>
                <Button onClick={handleGenerateSummary} disabled={isLoading} size="lg">
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          AI-Generated Summary
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg p-6 border">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {formatSummaryContent(displaySummary)}
          </div>
        </div>
        
        {!summary && document.summary && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Regenerate Summary
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      
      {isLoading && (
        <CardFooter className="flex justify-center pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader className="h-3 w-3 animate-spin" />
            Creating intelligent summary...
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentSummary;
