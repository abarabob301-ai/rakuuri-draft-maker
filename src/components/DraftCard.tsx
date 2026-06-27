import { getCategory } from '../data/categories'
import type { SavedDraft } from '../types/draft'
import { StatusBadge } from './StatusBadge'

interface DraftCardProps {
  draft: SavedDraft
  onEdit: (draft: SavedDraft) => void
  onResearch?: (draft: SavedDraft) => void
  onDelete: (id: string) => void
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export function DraftCard({ draft, onEdit, onResearch, onDelete }: DraftCardProps) {
  const category = getCategory(draft.input.categoryId)
  const title = draft.generated?.title || draft.input.roughName || draft.research?.productNameCandidate || '名称未設定の商品'

  return (
    <article className="draft-card">
      <div>
        <p className="draft-card__meta">
          {category.label}・{formatDate(draft.input.updatedAt)}
        </p>
        <h3>{title}</h3>
        <div className="draft-card__badges">
          <StatusBadge status={draft.status} />
          {draft.generated && <p className="pill">{draft.generated.valueJudgementLabel}</p>}
          {draft.research?.foundPrices.length ? <p className="pill">{draft.research.foundPrices.join(' / ')}円</p> : null}
        </div>
      </div>
      <div className="draft-card__actions">
        {onResearch && (
          <button type="button" className="button button--secondary" onClick={() => onResearch(draft)}>
            リサーチ
          </button>
        )}
        <button type="button" className="button button--secondary" onClick={() => onEdit(draft)}>
          編集
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => onDelete(draft.input.id)}
          aria-label={`${title}を削除`}
        >
          削除
        </button>
      </div>
    </article>
  )
}
