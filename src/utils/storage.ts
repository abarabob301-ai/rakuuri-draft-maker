import type { ListingDraft, SavedDraft } from '../types/draft'

const LEGACY_STORAGE_KEY = 'rakuuri_drafts_v1'
const STORAGE_KEY = 'rakuuri_listing_drafts_v2'

interface LegacyDraft {
  input: ListingDraft['input']
  generated: NonNullable<ListingDraft['generated']>
}

function readJson<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

function setListingDrafts(drafts: ListingDraft[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

export function migrateLegacyDrafts(): ListingDraft[] {
  const existing = readJson<ListingDraft[]>(STORAGE_KEY)
  if (existing) {
    return existing
  }

  const legacy = readJson<LegacyDraft[]>(LEGACY_STORAGE_KEY) ?? []
  const migrated = legacy.map((draft) => ({
    id: draft.input.id,
    createdAt: draft.input.createdAt,
    updatedAt: draft.input.updatedAt,
    status: 'draftReady' as const,
    input: draft.input,
    generated: draft.generated,
  }))

  setListingDrafts(migrated)
  return migrated
}

export function getListingDrafts(): ListingDraft[] {
  return migrateLegacyDrafts()
}

export function saveListingDraft(draft: ListingDraft) {
  const drafts = getListingDrafts()
  const nextDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  }
  const index = drafts.findIndex((item) => item.id === draft.id)

  if (index >= 0) {
    drafts[index] = nextDraft
  } else {
    drafts.unshift(nextDraft)
  }

  setListingDrafts(drafts)
  return drafts
}

export function updateListingDraft(id: string, update: (draft: ListingDraft) => ListingDraft) {
  const drafts = getListingDrafts()
  const nextDrafts = drafts.map((draft) =>
    draft.id === id ? { ...update(draft), updatedAt: new Date().toISOString() } : draft,
  )
  setListingDrafts(nextDrafts)
  return nextDrafts
}

export function deleteListingDraft(id: string) {
  const drafts = getListingDrafts().filter((draft) => draft.id !== id)
  setListingDrafts(drafts)
  return drafts
}

export function clearListingDrafts() {
  setListingDrafts([])
  return []
}

export const getDrafts = getListingDrafts
export const saveDraft = saveListingDraft
export const deleteDraft = deleteListingDraft
export const clearDrafts = clearListingDrafts

export type { SavedDraft }
