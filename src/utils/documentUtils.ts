
import { Document } from "@/types/documents";

// Extract text content from HTML
export function extractTextFromHTML(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body?.textContent || '';
  } catch (error) {
    console.error('Error extracting text from HTML:', error);
    return '';
  }
}

// Function to sanitize HTML content
export function sanitizeHTML(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body?.innerHTML || '';
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
}

// Extract title from HTML document
export function extractTitleFromHTML(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.title || 'Untitled Document';
  } catch (error) {
    console.error('Error extracting title from HTML:', error);
    return 'Untitled Document';
  }
}

// Create a downloadable text file from document content
export function downloadDocumentAsText(document: Document) {
  const content = document.content || '';
  const title = document.title || 'document';
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // Use window.document instead of document to avoid the naming conflict
  const a = window.document.createElement('a');
  a.href = url;
  a.download = `${title}.txt`;
  window.document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Create a shareable link for a document
export function createShareableLink(documentId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/documents/${documentId}`;
}

// Format document creation date
export function formatDocumentDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
}

// Get document thumbnail based on file type
export function getDocumentThumbnail(fileType: string): string {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return '/document-icons/pdf-icon.svg';
    case 'doc':
    case 'docx':
      return '/document-icons/word-icon.svg';
    case 'xls':
    case 'xlsx':
      return '/document-icons/excel-icon.svg';
    case 'ppt':
    case 'pptx':
      return '/document-icons/powerpoint-icon.svg';
    case 'txt':
      return '/document-icons/text-icon.svg';
    case 'csv':
      return '/document-icons/csv-icon.svg';
    case 'html':
    case 'htm':
      return '/document-icons/html-icon.svg';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return '/document-icons/image-icon.svg';
    default:
      return '/document-icons/file-icon.svg';
  }
}
