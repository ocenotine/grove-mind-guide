import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFUploaderProps {
  onUploadSuccess?: (documentId: string) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      console.log('Starting PDF text extraction...');
      setUploadProgress('Reading PDF file...');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      console.log(`PDF has ${pdf.numPages} pages`);
      setUploadProgress(`Extracting text from ${pdf.numPages} pages...`);
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          setUploadProgress(`Processing page ${pageNum} of ${pdf.numPages}...`);
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')
            .trim();
          
          if (pageText) {
            fullText += pageText + '\n\n';
          }
          
          console.log(`Page ${pageNum} text length:`, pageText.length);
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError);
          // Continue with other pages
        }
      }
      
      console.log('Total extracted text length:', fullText.length);
      
      if (fullText.trim().length < 50) {
        throw new Error('PDF appears to contain no readable text or only images. Please ensure the PDF contains text content.');
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF text extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to upload documents.',
        variant: 'destructive',
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    console.log('Starting upload process for:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    setIsUploading(true);
    setUploadProgress('Preparing upload...');

    try {
      let documentContent = '';
      
      if (file.type === 'application/pdf') {
        documentContent = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        setUploadProgress('Reading text file...');
        documentContent = await file.text();
      } else {
        // For other file types, we'll store them but may not be able to extract text
        console.log('Unsupported file type for text extraction:', file.type);
        documentContent = `This ${file.type} file was uploaded but text extraction is not supported for this file type.`;
      }

      console.log('Extracted content length:', documentContent.length);

      if (documentContent.trim().length < 10) {
        throw new Error('No readable content could be extracted from this file.');
      }

      setUploadProgress('Saving to database...');

      // Create document record in database
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          content: documentContent,
          file_type: file.type,
          user_id: user.id,
        })
        .select()
        .single();

      if (docError) {
        console.error('Database error:', docError);
        throw docError;
      }

      console.log('Document created successfully:', docData.id);

      setUploadProgress('Upload complete!');

      toast({
        title: 'Document uploaded successfully',
        description: `"${file.name}" has been uploaded and processed.`,
      });

      if (onUploadSuccess) {
        onUploadSuccess(docData.id);
      } else {
        // Navigate to the correct document view route
        navigate(`/documents/view/${docData.id}`);
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Failed to upload document.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  }, [user, onUploadSuccess, navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isUploading
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            {isUploading ? (
              <>
                <Loader className="h-12 w-12 text-primary animate-spin" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Processing document...</p>
                  {uploadProgress && (
                    <p className="text-sm text-muted-foreground">{uploadProgress}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragActive ? 'Drop your document here' : 'Upload a document'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, TXT, DOC, DOCX files
                  </p>
                </div>
                
                <Button variant="outline" className="mt-4">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </>
            )}
          </div>
        </div>

        {!isUploading && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">For best results:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• PDFs should contain selectable text (not just images)</li>
                  <li>• Text files should be properly formatted</li>
                  <li>• Documents should be at least 50 characters long</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFUploader;
