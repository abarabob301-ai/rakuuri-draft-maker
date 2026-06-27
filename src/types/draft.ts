export type CategoryId =
  | 'clothes'
  | 'kidsClothes'
  | 'books'
  | 'toys'
  | 'appliances'
  | 'gadgets'
  | 'bags'
  | 'shoes'
  | 'tableware'
  | 'misc'
  | 'other'

export type Condition =
  | 'new'
  | 'likeNew'
  | 'good'
  | 'slightlyDamaged'
  | 'damaged'
  | 'poor'
  | 'unknown'

export type SellingPriority = 'fast' | 'normal' | 'high' | 'bundle' | 'avoidLoss'

export type ResearchLevel = 'low' | 'medium' | 'high'

export type ValueJudgement =
  | 'recommend'
  | 'bundleRecommended'
  | 'needsCheck'
  | 'maybeSkip'

export type ListingStatus = 'researching' | 'draftReady' | 'listed' | 'onHold' | 'skipped'

export interface DraftInput {
  id: string
  createdAt: string
  updatedAt: string
  categoryId: CategoryId
  roughName: string
  brand?: string
  brandUnknown?: boolean
  size?: string
  sizeUnknown?: boolean
  color?: string
  modelNumber?: string
  modelNumberUnknown?: boolean
  quantity?: string
  condition: Condition
  sellingPriority: SellingPriority
  accessories: string[]
  accessoryUnknown?: boolean
  operationStatus?: string
  defectMemo?: string
  storageMemo?: string
  freeMemo?: string
  priceResearchMemo?: string
  suggestedPrice?: string
}

export interface GeneratedDraft {
  title: string
  description: string
  photoChecklist: string[]
  priceMemo: string
  packagingMemo: string
  valueJudgement: ValueJudgement
  valueJudgementLabel: string
  warnings: string[]
}

export interface ResearchInfo {
  rawMemo: string
  searchQuery?: string
  productNameCandidate?: string
  brandCandidate?: string
  modelNumberCandidate?: string
  productDescriptionMemo?: string
  foundPrices: number[]
  priceMemo?: string
  accessoriesMemo?: string
  cautionMemo?: string
  referenceUrls?: string[]
  updatedAt: string
}

export interface ListingDraft {
  id: string
  createdAt: string
  updatedAt: string
  status: ListingStatus
  research?: ResearchInfo
  input: DraftInput
  generated?: GeneratedDraft
}

export type SavedDraft = ListingDraft

export interface CategoryConfig {
  id: CategoryId
  label: string
  researchLevel: ResearchLevel
  researchMessage: string
  checkPoints: string[]
  photoChecklist: string[]
  defaultPackagingMemo: string
  priceAdvice: string
  safetyWarnings: string[]
  titleParts: string[]
}
