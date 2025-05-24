import { supabase } from '@/integrations/supabase/client';

// Function to retrieve the API key from local storage or use the default one
export const getOpenRouterApiKey = (): string => {
  // Use the provided API key
  return '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';
};

// Set the OpenRouter API key
export const setOpenRouterApiKey = (key: string): void => {
  // This function is maintained for compatibility but doesn't actually store the key
  console.log('API key setting is disabled, using predefined key');
};

// Play a notification sound
export const playNotificationSound = async (): Promise<void> => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    await audio.play();
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

// Common function to call OpenRouter API with different prompts
const callOpenRouter = async (
  messages: Array<{role: string, content: string}>,
  model: string = 'openai/gpt-3.5-turbo',
  maxTokens: number = 1000,
  temperature: number = 0.3
): Promise<any> => {
  const apiKey = getOpenRouterApiKey();
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://mindgrove.app',
        'X-Title': 'MindGrove AI'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API returned status: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
};

// Function to generate a response for general chat with model support
export const generateGeneralChatResponse = async (message: string, model: string = 'gpt-3.5-turbo'): Promise<string> => {
  try {
    console.log("Generating general chat response with model:", model);
    
    // Map frontend model names to OpenRouter model names
    const modelMap: Record<string, string> = {
      'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
      'gpt-4o-mini': 'openai/gpt-4o-mini',
      'gpt-4o': 'openai/gpt-4o'
    };
    
    const openRouterModel = modelMap[model] || 'openai/gpt-3.5-turbo';
    
    const data = await callOpenRouter([
      {
        role: 'system',
        content: 'You are a helpful AI assistant for students. You provide concise, accurate, and helpful responses.'
      },
      {
        role: 'user',
        content: message
      }
    ], openRouterModel);
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response. Please try again.');
  }
};

// Intelligent document chunking with overlap
const chunkDocument = (text: string, chunkSize: number = 8000, overlap: number = 400): string[] => {
  if (text.length <= chunkSize) return [text];
  
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + chunkSize;
    
    // If this isn't the last chunk, try to break at a sentence or paragraph
    if (end < text.length) {
      const lastSentence = text.lastIndexOf('.', end);
      const lastParagraph = text.lastIndexOf('\n\n', end);
      const breakPoint = Math.max(lastSentence, lastParagraph);
      
      if (breakPoint > start + chunkSize * 0.7) {
        end = breakPoint + 1;
      }
    }
    
    chunks.push(text.slice(start, end));
    start = end - overlap; // Create overlap for continuity
  }
  
  return chunks;
};

// Enhanced document summarization with progress tracking
export const generateDocumentSummary = async (
  documentText: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    console.log("Generating enhanced document summary");
    onProgress?.(10);
    
    if (documentText.length <= 8000) {
      // Single chunk processing
      onProgress?.(50);
      const data = await callOpenRouter([
        {
          role: 'system',
          content: 'You are a document summarization assistant. Create a comprehensive, well-structured summary that captures all key points, main arguments, methodologies, findings, and conclusions. Use clear headings and bullet points for better readability.'
        },
        {
          role: 'user',
          content: `Create a detailed summary of this document:\n\n${documentText}`
        }
      ], 'openai/gpt-3.5-turbo', 1200, 0.2);
      
      onProgress?.(100);
      return data.choices[0].message.content;
    }
    
    // Multi-chunk processing for large documents
    const chunks = chunkDocument(documentText);
    const chunkSummaries: string[] = [];
    
    onProgress?.(20);
    
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const progress = 20 + (i / chunks.length) * 60;
      onProgress?.(progress);
      
      const data = await callOpenRouter([
        {
          role: 'system',
          content: `You are summarizing section ${i+1} of ${chunks.length} of a document. Create a detailed summary focusing on key points, arguments, and findings in this section.`
        },
        {
          role: 'user',
          content: `Summarize this section:\n\n${chunks[i]}`
        }
      ], 'openai/gpt-3.5-turbo', 600, 0.2);
      
      chunkSummaries.push(`## Section ${i+1}\n${data.choices[0].message.content}`);
    }
    
    onProgress?.(85);
    
    // Combine summaries into final comprehensive summary
    const combinedSummaries = chunkSummaries.join('\n\n');
    const finalData = await callOpenRouter([
      {
        role: 'system',
        content: 'Create a cohesive, comprehensive summary from these section summaries. Organize the content logically with clear structure, removing redundancy while preserving all important information.'
      },
      {
        role: 'user',
        content: `Create a final comprehensive summary from these section summaries:\n\n${combinedSummaries}`
      }
    ], 'openai/gpt-4o-mini', 1500, 0.2);
    
    onProgress?.(100);
    return finalData.choices[0].message.content;
    
  } catch (error) {
    console.error('Error generating document summary:', error);
    throw new Error('Failed to generate document summary');
  }
};

// Enhanced flashcard generation with better variety and spaced repetition metadata
export const generateFlashcards = async (
  documentText: string,
  numCards: number = 8,
  difficulty: 'basic' | 'intermediate' | 'advanced' = 'intermediate'
): Promise<Array<{question: string, answer: string, difficulty: string, topic: string}>> => {
  try {
    console.log("Generating enhanced flashcards");
    
    const processedText = documentText.length > 12000 
      ? documentText.substring(0, 12000) + '...' 
      : documentText;
    
    const difficultyPrompts = {
      basic: 'Create basic recall questions focusing on definitions and key facts.',
      intermediate: 'Create questions that test understanding and application of concepts.',
      advanced: 'Create analytical questions that require critical thinking and synthesis.'
    };
    
    const data = await callOpenRouter([
      {
        role: 'system',
        content: `You are an educational flashcard expert. ${difficultyPrompts[difficulty]} Generate ${numCards} high-quality flashcards with varied question types. Include topic categorization for each card.`
      },
      {
        role: 'user',
        content: `Generate ${numCards} flashcards from this document. Format as valid JSON with "question", "answer", "difficulty", and "topic" properties:\n\n${processedText}`
      }
    ], 'openai/gpt-3.5-turbo', 1400, 0.4);
    
    const content = data.choices[0].message.content;
    let flashcards = [];
    
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        flashcards = JSON.parse(content);
      }
      
      // Ensure proper structure
      return flashcards.map((card: any, index: number) => ({
        question: card.question || `Question ${index + 1}`,
        answer: card.answer || "Answer not available",
        difficulty: card.difficulty || difficulty,
        topic: card.topic || "General"
      }));
      
    } catch (parseError) {
      console.error('Failed to parse flashcard data:', parseError);
      // Enhanced fallback based on document content
      return Array.from({ length: Math.min(numCards, 4) }, (_, i) => ({
        question: `What is a key concept from this ${difficulty} level document?`,
        answer: "This document contains important academic or educational content that requires further study.",
        difficulty,
        topic: "General"
      }));
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
};

// Enhanced quiz generation with multiple question types
export const generateQuiz = async (
  documentText: string, 
  numQuestions: number = 5, 
  difficulty: string = 'medium',
  questionTypes: string[] = ['multiple-choice', 'true-false', 'short-answer']
): Promise<Array<{question: string, type: string, options?: string[], answer: string, explanation: string, difficulty: string}>> => {
  try {
    console.log("Generating enhanced quiz questions");
    
    const processedText = documentText.length > 12000 
      ? documentText.substring(0, 12000) + '...' 
      : documentText;
    
    const typeInstructions = questionTypes.map(type => {
      switch (type) {
        case 'multiple-choice': return 'multiple-choice questions with 4 options';
        case 'true-false': return 'true/false questions';
        case 'short-answer': return 'short answer questions';
        default: return 'varied question types';
      }
    }).join(', ');
    
    const data = await callOpenRouter([
      {
        role: 'system',
        content: `Create ${numQuestions} ${difficulty}-level quiz questions including ${typeInstructions}. Each question should test comprehension and include detailed explanations.`
      },
      {
        role: 'user',
        content: `Generate ${numQuestions} quiz questions from this document. Format as valid JSON with "question", "type", "options" (if applicable), "answer", "explanation", and "difficulty":\n\n${processedText}`
      }
    ], 'openai/gpt-4o-mini', 1600, 0.3);
    
    const content = data.choices[0].message.content;
    let quiz = [];
    
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        quiz = JSON.parse(jsonMatch[0]);
      } else {
        const parsedData = JSON.parse(content);
        quiz = Array.isArray(parsedData) ? parsedData : parsedData.questions || [];
      }
      
      return quiz.map((q: any, index: number) => ({
        question: q.question || `Question ${index + 1}`,
        type: q.type || 'multiple-choice',
        options: q.options || (q.type === 'multiple-choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined),
        answer: q.answer || "Answer not available",
        explanation: q.explanation || "Explanation not available",
        difficulty: q.difficulty || difficulty
      }));
      
    } catch (parseError) {
      console.error('Failed to parse quiz data:', parseError);
      // Enhanced fallback questions
      return [{
        question: "What is the main topic discussed in this document?",
        type: "multiple-choice",
        options: ["Scientific research", "Educational content", "Technical documentation", "General knowledge"],
        answer: "Educational content",
        explanation: "The document contains educational material relevant to academic study.",
        difficulty
      }];
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz');
  }
};

// Function to generate a response for document chat (keeping existing functionality)
export const generateDocumentChatResponse = async (documentText: string, userMessage: string): Promise<string> => {
  const truncatedText = documentText.length > 5000 
    ? documentText.substring(0, 5000) + '...' 
    : documentText;
  
  try {
    console.log("Generating document chat response");
    const data = await callOpenRouter([
      {
        role: 'system',
        content: `You are a document assistant. Use the following document content to answer the user's questions: ${truncatedText}`
      },
      {
        role: 'user',
        content: userMessage
      }
    ]);
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating document response:', error);
    throw new Error('Failed to generate document response');
  }
};
