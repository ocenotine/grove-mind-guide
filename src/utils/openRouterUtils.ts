
import { Document } from "@/types/documents";
import { Flashcard, QuizQuestion } from "@/types/study";

// OpenRouter API key
const OPENROUTER_API_KEY = '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';

// Available models
export const OPENROUTER_MODELS = {
  LLAMA3_70B: "meta-llama/llama-3-70b-instruct",
  LLAMA3_8B: "meta-llama/llama-3-8b-instruct",
  MISTRAL_7B: "mistralai/mistral-7b-instruct",
  CLAUDE_3_OPUS: "anthropic/claude-3-opus",
  CLAUDE_3_SONNET: "anthropic/claude-3-sonnet",
  GPT_4: "openai/gpt-4",
  GPT_3_5: "openai/gpt-3.5-turbo",
};

// Default model
export const DEFAULT_MODEL = OPENROUTER_MODELS.LLAMA3_8B;

// Helper function to make OpenRouter API call
export async function callOpenRouter(
  messages: any[],
  model: string = DEFAULT_MODEL,
  temperature: number = 0.7,
  max_tokens: number = 1000
): Promise<any> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "DocumentLab"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData?.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter API call failed:", error);
    throw error;
  }
}

// Generate a summary of the document content
export async function generateDocumentSummary(
  docContent: string,
  title?: string
): Promise<string> {
  try {
    const prompt = `
Please provide a detailed and well-organized summary of the following document${title ? ` titled "${title}"` : ''}. 
Focus on the main ideas, key arguments, and important findings. 
Structure the summary with appropriate headers and bullet points where relevant.
Include important details but avoid unnecessary information.

Document content:
${docContent.length > 15000 ? docContent.slice(0, 15000) + "... (content truncated for length)" : docContent}
`;

    const messages = [
      { role: "system", content: "You are a professional document summarizer. Create clear, accurate, and well-structured summaries." },
      { role: "user", content: prompt }
    ];

    const summary = await callOpenRouter(messages, OPENROUTER_MODELS.LLAMA3_8B, 0.3, 2000);
    return summary;
  } catch (error) {
    console.error("Error generating document summary:", error);
    throw new Error("Failed to generate summary. Please try again later.");
  }
}

// Generate flashcards for a document
export async function generateFlashcards(
  docContent: string,
  numberOfCards: number = 10,
  title?: string
): Promise<Flashcard[]> {
  try {
    const maxContentLength = 8000; // Limit content length to avoid token issues
    const truncatedContent = docContent.length > maxContentLength ? 
      docContent.slice(0, maxContentLength) + "... (content truncated for length)" : 
      docContent;

    const prompt = `
Create ${numberOfCards} high-quality flashcards based on the following document${title ? ` titled "${title}"` : ''}.
Each flashcard should have a question on the front and the answer on the back.
Focus on the most important concepts, facts, definitions, and relationships in the document.
Make the flashcards challenging enough to test understanding but clear enough to be useful for learning.

Document content:
${truncatedContent}

Please format your response as a JSON array of objects with 'front' and 'back' properties, for example:
[
  { "front": "Question 1?", "back": "Answer 1" },
  { "front": "Question 2?", "back": "Answer 2" }
]
`;

    const messages = [
      { role: "system", content: "You are a flashcard creation assistant that creates effective study materials. Your response must be valid JSON." },
      { role: "user", content: prompt }
    ];

    const response = await callOpenRouter(messages, OPENROUTER_MODELS.LLAMA3_8B, 0.3, 2000);
    
    // Extract JSON array from response
    let jsonString = response;
    if (response.includes('```json')) {
      jsonString = response.split('```json')[1].split('```')[0];
    } else if (response.includes('```')) {
      jsonString = response.split('```')[1].split('```')[0];
    }
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(jsonString.trim());
    
    if (Array.isArray(parsedResponse)) {
      return parsedResponse.map((card: any) => ({
        id: crypto.randomUUID(),
        front_content: card.front,
        back_content: card.back
      }));
    } else if (parsedResponse.flashcards && Array.isArray(parsedResponse.flashcards)) {
      return parsedResponse.flashcards.map((card: any) => ({
        id: crypto.randomUUID(),
        front_content: card.front,
        back_content: card.back
      }));
    } else if (parsedResponse.cards && Array.isArray(parsedResponse.cards)) {
      return parsedResponse.cards.map((card: any) => ({
        id: crypto.randomUUID(),
        front_content: card.front,
        back_content: card.back
      }));
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards. Please try again later.");
  }
}

// Generate document-based quiz
export async function generateQuiz(
  docContent: string,
  numberOfQuestions: number = 5,
  difficulty: string = "medium",
  quizType: string = "multiple-choice",
  title?: string
): Promise<QuizQuestion[]> {
  try {
    const maxContentLength = 8000; // Limit content length to avoid token issues
    const truncatedContent = docContent.length > maxContentLength ? 
      docContent.slice(0, maxContentLength) + "... (content truncated for length)" : 
      docContent;

    const prompt = `
Create a ${difficulty} difficulty ${quizType} quiz with ${numberOfQuestions} questions based on the following document${title ? ` titled "${title}"` : ''}.
${quizType === "multiple-choice" ? "Each question should have 4 options with 1 correct answer." : "Each question should have a clear answer."}
Focus on testing understanding of key concepts and important information from the document.

Document content:
${truncatedContent}

Please format your response as a JSON array of question objects. For multiple-choice questions use:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "Brief explanation why this is correct"
  }
]

For short answer or true/false questions, use:
[
  {
    "question": "Question text here?",
    "correctAnswer": "The answer",
    "explanation": "Brief explanation why this is correct"
  }
]
`;

    const messages = [
      { role: "system", content: "You are a quiz creation assistant that creates effective educational quizzes. Your response must be valid JSON." },
      { role: "user", content: prompt }
    ];

    const response = await callOpenRouter(messages, OPENROUTER_MODELS.LLAMA3_8B, 0.4, 2000);
    
    // Extract JSON array from response
    let jsonString = response;
    if (response.includes('```json')) {
      jsonString = response.split('```json')[1].split('```')[0];
    } else if (response.includes('```')) {
      jsonString = response.split('```')[1].split('```')[0];
    }
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(jsonString.trim());
    
    if (Array.isArray(parsedResponse)) {
      return parsedResponse.map((q: any) => ({
        id: crypto.randomUUID(),
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        type: q.options ? 'multiple-choice' : 'short-answer'
      }));
    } else if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
      return parsedResponse.questions.map((q: any) => ({
        id: crypto.randomUUID(),
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        type: q.options ? 'multiple-choice' : 'short-answer'
      }));
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. Please try again later.");
  }
}

// Generate a response to a query about a document
export async function chatWithDocument(
  docContent: string,
  userQuery: string,
  chatHistory: Array<{ role: string; content: string }> = [],
  title?: string
): Promise<string> {
  try {
    const maxContentLength = 10000; // Limit content length to avoid token issues
    const truncatedContent = docContent.length > maxContentLength ? 
      docContent.slice(0, maxContentLength) + "... (content truncated for length)" : 
      docContent;

    // Create the context for the chat
    const systemMessage = {
      role: "system",
      content: `You are a helpful assistant answering questions about a document${title ? ` titled "${title}"` : ''}. 
      Base your answers on the document content provided below. If you don't know an answer based on the document, 
      say so clearly instead of making up information.
      
      Document content:
      ${truncatedContent}`
    };
    
    // Build the full message array with history
    const messages = [
      systemMessage,
      ...chatHistory,
      { role: "user", content: userQuery }
    ];

    const response = await callOpenRouter(messages, OPENROUTER_MODELS.LLAMA3_8B, 0.7, 1200);
    return response;
  } catch (error) {
    console.error("Error chatting with document:", error);
    throw new Error("Failed to generate response. Please try again later.");
  }
}
