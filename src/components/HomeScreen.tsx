import type { SavedDraft } from '../types/draft'
import { DraftCard } from './DraftCard'

interface HomeScreenProps {
  drafts: SavedDraft[]
  onCreate: () => void
  onResearchCreate: () => void
  onEdit: (draft: SavedDraft) => void
  onResearch: (draft: SavedDraft) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export function HomeScreen({
  drafts,
  onCreate,
  onResearchCreate,
  onEdit,
  onResearch,
  onDelete,
  onClear,
}: HomeScreenProps) {
  return (
    <div className="screen-stack">
      <section className="home-hero">
        <div className="home-hero__copy">
          <p className="eyebrow">商品名があいまいでも大丈夫</p>
          <h2>わかる範囲で入力するだけで、メルカリ用の下書きが作れます。</h2>
          <div className="home-actions">
            <button type="button" className="button button--primary" onClick={onResearchCreate}>
              リサーチから作る
            </button>
            <button type="button" className="button button--secondary" onClick={onCreate}>
              かんたん下書きから作る
            </button>
          </div>
        </div>
        <div className="home-hero__panel" aria-label="下書き作成の流れ">
          <div>
            <span>01</span>
            <strong>カテゴリ選択</strong>
            <p>出品前に確認することを表示</p>
          </div>
          <div>
            <span>02</span>
            <strong>不明点をメモ</strong>
            <p>わからない情報もそのまま反映</p>
          </div>
          <div>
            <span>03</span>
            <strong>コピーして出品</strong>
            <p>タイトルと説明文をすぐ使える形に</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <h2>保存済み下書き</h2>
          {drafts.length > 0 && (
            <button type="button" className="text-button" onClick={onClear}>
              全削除
            </button>
          )}
        </div>
        {drafts.length === 0 ? (
          <p className="empty-state">まだ保存済みの下書きはありません。</p>
        ) : (
          <div className="draft-list">
            {drafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                onEdit={onEdit}
                onResearch={onResearch}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
