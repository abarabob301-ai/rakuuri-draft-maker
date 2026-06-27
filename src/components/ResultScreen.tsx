import { getCategory } from '../data/categories'
import type { DraftInput, GeneratedDraft, ResearchInfo } from '../types/draft'
import { CopyButton } from './CopyButton'
import { SectionCard } from './SectionCard'

interface ResultScreenProps {
  input: DraftInput
  generated: GeneratedDraft
  research?: ResearchInfo
  isSaved: boolean
  onSave: () => void
  onBack: () => void
  onHome: () => void
}

export function ResultScreen({
  input,
  generated,
  research,
  isSaved,
  onSave,
  onBack,
  onHome,
}: ResultScreenProps) {
  const category = getCategory(input.categoryId)
  const combinedText = `${generated.title}\n\n${generated.description}`

  return (
    <div className="screen-stack">
      <SectionCard title="出品タイトル" tone="success">
        <p className="result-title">{generated.title}</p>
        <CopyButton label="タイトルだけコピー" text={generated.title} />
      </SectionCard>

      <SectionCard title="商品説明文">
        <pre className="description-box">{generated.description}</pre>
        <CopyButton label="説明文だけコピー" text={generated.description} />
      </SectionCard>

      <SectionCard title="写真チェックリスト">
        <ul className="check-list">
          {generated.photoChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="価格方針メモ">
        <p>{generated.priceMemo}</p>
      </SectionCard>

      {research?.priceMemo && (
        <SectionCard title="リサーチ価格メモ" tone="success">
          <pre className="description-box">{research.priceMemo}</pre>
          <p className="helper-text">
            ここに表示される価格は、貼り付けた情報から整理したメモです。商品の状態・付属品・送料を見て調整してください。
          </p>
        </SectionCard>
      )}

      {research?.cautionMemo && (
        <SectionCard title="リサーチ由来の注意点" tone="notice">
          <pre className="description-box">{research.cautionMemo}</pre>
        </SectionCard>
      )}

      <SectionCard title="梱包メモ">
        <p>{generated.packagingMemo}</p>
      </SectionCard>

      <SectionCard title="出品する価値判定" tone="notice">
        <p className="judgement-line">{generated.valueJudgementLabel}</p>
        <p>{category.priceAdvice}</p>
      </SectionCard>

      <SectionCard title="注意点">
        <ul className="check-list">
          {generated.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </SectionCard>

      <div className="result-actions">
        <CopyButton label="タイトル＋説明文をコピー" text={combinedText} />
        <button type="button" className="button button--primary" onClick={onSave}>
          {isSaved ? '保存済み' : '下書きを保存'}
        </button>
        <button type="button" className="button button--secondary" onClick={onBack}>
          入力へ戻る
        </button>
        <button type="button" className="button button--ghost" onClick={onHome}>
          ホームへ
        </button>
      </div>
    </div>
  )
}
