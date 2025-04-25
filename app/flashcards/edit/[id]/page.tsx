import { FlashcardEditView } from "@/components/flashcards/flashcard-edit-view"

export default function FlashcardEditPage({ params }: { params: { id: string } }) {
  return <FlashcardEditView id={params.id} />
}
