import { useState } from 'react'
import { CategorySelect } from './components/CategorySelect'
import { DraftForm } from './components/DraftForm'
import { HomeScreen } from './components/HomeScreen'
import { Layout } from './components/Layout'
import { ResearchScreen } from './components/ResearchScreen'
import { ResearchGuide } from './components/ResearchGuide'
import { ResultScreen } from './components/ResultScreen'
import type { CategoryId, DraftInput, GeneratedDraft, ResearchInfo, SavedDraft } from './types/draft'
import { generateDraft } from './utils/generateDraft'
import { clearDrafts, deleteDraft, getDrafts, saveDraft } from './utils/storage'

type View = 'home' | 'category' | 'guide' | 'research' | 'form' | 'result'

function createBlankInput(categoryId: CategoryId = 'other'): DraftInput {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    categoryId,
    roughName: '',
    condition: 'good',
    sellingPriority: 'normal',
    accessories: ['写真に写っているものがすべて'],
  }
}

function App() {
  const [view, setView] = useState<View>('home')
  const [drafts, setDrafts] = useState<SavedDraft[]>(() => getDrafts())
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>('clothes')
  const [activeListing, setActiveListing] = useState<SavedDraft | undefined>()
  const [activeInput, setActiveInput] = useState<DraftInput | undefined>()
  const [generated, setGenerated] = useState<GeneratedDraft | undefined>()
  const [isSaved, setIsSaved] = useState(false)

  const startNew = () => {
    setActiveListing(undefined)
    setActiveInput(undefined)
    setGenerated(undefined)
    setIsSaved(false)
    setView('category')
  }

  const startResearch = () => {
    const input = createBlankInput('other')
    const now = new Date().toISOString()
    const listing: SavedDraft = {
      id: input.id,
      createdAt: now,
      updatedAt: now,
      status: 'researching',
      input,
    }
    setSelectedCategoryId(input.categoryId)
    setActiveListing(listing)
    setActiveInput(input)
    setGenerated(undefined)
    setIsSaved(false)
    setView('research')
  }

  const editDraft = (draft: SavedDraft) => {
    setSelectedCategoryId(draft.input.categoryId)
    setActiveListing(draft)
    setActiveInput(draft.input)
    setGenerated(draft.generated)
    setIsSaved(true)
    setView('form')
  }

  const researchDraft = (draft: SavedDraft) => {
    setSelectedCategoryId(draft.input.categoryId)
    setActiveListing(draft)
    setActiveInput(draft.input)
    setGenerated(draft.generated)
    setIsSaved(true)
    setView('research')
  }

  const selectCategory = (categoryId: CategoryId) => {
    setSelectedCategoryId(categoryId)
    setView('guide')
  }

  const submitInput = (input: DraftInput) => {
    const nextGenerated = generateDraft(input)
    const nextListing: SavedDraft = {
      id: activeListing?.id ?? input.id,
      createdAt: activeListing?.createdAt ?? input.createdAt,
      updatedAt: new Date().toISOString(),
      status: 'draftReady',
      research: activeListing?.research,
      input,
      generated: nextGenerated,
    }
    setActiveListing(nextListing)
    setActiveInput(input)
    setGenerated(nextGenerated)
    setIsSaved(false)
    setView('result')
  }

  const persistDraft = () => {
    if (!activeInput || !generated) {
      return
    }

    const listing: SavedDraft = {
      id: activeListing?.id ?? activeInput.id,
      createdAt: activeListing?.createdAt ?? activeInput.createdAt,
      updatedAt: new Date().toISOString(),
      status: 'draftReady',
      research: activeListing?.research,
      input: activeInput,
      generated,
    }
    const nextDrafts = saveDraft(listing)
    setActiveListing(listing)
    setDrafts(nextDrafts)
    setIsSaved(true)
  }

  const saveListing = (listing: SavedDraft) => {
    const nextDrafts = saveDraft(listing)
    setDrafts(nextDrafts)
    setActiveListing(listing)
    setActiveInput(listing.input)
    setGenerated(listing.generated)
    setIsSaved(true)
  }

  const applyResearch = (input: DraftInput, research: ResearchInfo) => {
    const listing: SavedDraft = {
      id: activeListing?.id ?? input.id,
      createdAt: activeListing?.createdAt ?? input.createdAt,
      updatedAt: new Date().toISOString(),
      status: 'researching',
      research,
      input,
      generated: activeListing?.generated,
    }
    saveListing(listing)
    setSelectedCategoryId(input.categoryId)
    setActiveInput(input)
    setView('form')
  }

  const removeDraft = (id: string) => {
    setDrafts(deleteDraft(id))
  }

  const removeAllDrafts = () => {
    setDrafts(clearDrafts())
  }

  return (
    <Layout>
      {view === 'home' && (
        <HomeScreen
          drafts={drafts}
          onCreate={startNew}
          onResearchCreate={startResearch}
          onEdit={editDraft}
          onResearch={researchDraft}
          onDelete={removeDraft}
          onClear={removeAllDrafts}
        />
      )}

      {view === 'category' && <CategorySelect onSelect={selectCategory} onBack={() => setView('home')} />}

      {view === 'guide' && (
        <ResearchGuide
          categoryId={selectedCategoryId}
          onContinue={() => setView('form')}
          onBack={() => setView('category')}
        />
      )}

      {view === 'research' && activeListing && (
        <ResearchScreen
          listing={activeListing}
          onSave={saveListing}
          onApply={applyResearch}
          onBack={() => setView('home')}
        />
      )}

      {view === 'form' && (
        <DraftForm
          categoryId={selectedCategoryId}
          initialInput={activeInput}
          onSubmit={submitInput}
          onBack={() => setView(activeInput ? 'home' : 'guide')}
        />
      )}

      {view === 'result' && activeInput && generated && (
        <ResultScreen
          input={activeInput}
          generated={generated}
          research={activeListing?.research}
          isSaved={isSaved}
          onSave={persistDraft}
          onBack={() => setView('form')}
          onHome={() => setView('home')}
        />
      )}
    </Layout>
  )
}

export default App
