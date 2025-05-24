
import { supabase } from '@/integrations/supabase/client';
import { 
  generateDocumentSummary as generateOpenRouterSummary, 
  generateDocumentChatResponse as generateOpenRouterChatResponse,
  generateFlashcards as generateOpenRouterFlashcards,
  generateQuiz as generateOpenRouterQuiz,
  getOpenRouterApiKey
} from '@/utils/openRouterUtils';

export const generateSummary = async (documentId: string, text: string) => {
  try {
    console.log(`Generating detailed summary for document ${documentId}`);
    console.log('Input text length:', text?.length || 0);
    
    if (!text || text.trim().length < 50) {
      console.log('Text is too short for summarization');
      return { 
        success: false, 
        error: "Document content is too short or empty. Please ensure the document contains readable text (minimum 50 characters required)."
      };
    }

    // Clean and prepare text
    const cleanedText = text.trim().replace(/\s+/g, ' ');
    console.log('Cleaned text length:', cleanedText.length);

    if (cleanedText.length < 50) {
      return { 
        success: false, 
        error: "After cleaning, the document content is too short to generate a meaningful summary."
      };
    }

    try {
      // Call OpenRouter API directly
      const summary = await generateOpenRouterSummary(cleanedText, (progress) => {
        console.log(`Summary progress: ${progress}%`);
      });
      
      console.log('Summary generated successfully, length:', summary.length);
      
      // Save to database if we have a valid document ID
      if (documentId && summary) {
        try {
          const { error } = await supabase
            .from('documents')
            .update({ summary })
            .eq('id', documentId);
            
          if (error) {
            console.error('Error saving summary to document:', error);
          } else {
            console.log('Summary saved successfully to document ID:', documentId);
          }
        } catch (dbError) {
          console.error('Database error when saving summary:', dbError);
          // Continue even if saving to database fails
        }
      }
      
      return {
        success: true,
        summary
      };
    } catch (apiError) {
      console.error('API error for summary:', apiError);
      
      // Provide more specific error messages
      if (apiError instanceof Error) {
        if (apiError.message.includes('429')) {
          return {
            success: false,
            error: "Rate limit exceeded. Please wait a moment and try again."
          };
        } else if (apiError.message.includes('401')) {
          return {
            success: false,
            error: "API authentication failed. Please check your API key configuration."
          };
        } else if (apiError.message.includes('timeout')) {
          return {
            success: false,
            error: "Request timed out. The document might be too large. Please try with a smaller document."
          };
        }
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Error generating summary:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate summary. Please try again.'
    };
  }
};

export const generateFlashcards = async (documentId: string, text: string) => {
  try {
    console.log(`Generating flashcards for document ${documentId}`);
    console.log('Input text length:', text?.length || 0);
    
    if (!text || text.trim().length < 50) {
      console.log('Text is too short for flashcard generation');
      return { 
        success: false, 
        error: "Document content is too short or empty. Please ensure the document contains readable text.",
        flashcards: []
      };
    }

    const cleanedText = text.trim().replace(/\s+/g, ' ');

    try {
      // Use the OpenRouter utils directly
      const flashcards = await generateOpenRouterFlashcards(cleanedText);
      
      // Save flashcards to database if authenticated
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && documentId) {
          for (const flashcard of flashcards) {
            await supabase
              .from('flashcards')
              .insert({
                document_id: documentId,
                front_content: flashcard.question,
                back_content: flashcard.answer,
                user_id: user.id
              });
          }
          console.log(`Saved ${flashcards.length} flashcards to database`);
        }
      } catch (dbError) {
        console.error('Error saving flashcards to database:', dbError);
      }
      
      return {
        success: true,
        flashcards
      };
    } catch (apiError) {
      console.error('API error for flashcards:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate flashcards',
      flashcards: []
    };
  }
};

// Chat with document function
export const chatWithDocument = async (documentId: string, documentText: string, userMessage: string) => {
  try {
    console.log(`Generating chat response for document ${documentId}`);
    
    if (!userMessage.trim()) {
      return {
        success: false,
        error: "Please enter a message to continue the conversation."
      };
    }
    
    // Use direct call to OpenRouter for document chat
    const response = await generateOpenRouterChatResponse(documentText, userMessage);
    
    return {
      success: true,
      response
    };
  } catch (error) {
    console.error('Error in document chat:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate a response'
    };
  }
};

export const generateQuizQuestions = async (documentId: string, documentText: string, numQuestions = 5, difficulty = 'medium') => {
  try {
    console.log(`Generating quiz questions for document ${documentId}`);
    
    if (!documentText || documentText.trim().length < 10) {
      return { 
        success: false, 
        error: "Document content is too short to generate quiz questions.",
        questions: []
      };
    }

    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      return {
        success: false,
        error: "OpenRouter API key not set. Please set your API key in settings.",
        questions: []
      };
    }

    try {
      const questions = await generateOpenRouterQuiz(documentText, numQuestions, difficulty);
      
      return {
        success: true,
        questions
      };
    } catch (apiError) {
      console.error('API error for quiz generation:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate quiz questions',
      questions: []
    };
  }
};
