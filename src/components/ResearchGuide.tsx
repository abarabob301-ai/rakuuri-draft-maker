import { getCategory } from '../data/categories'
import type { CategoryId } from '../types/draft'
import { SectionCard } from './SectionCard'

interface ResearchGuideProps {
  categoryId: CategoryId
  onContinue: () => void
  onBack: () => void
}

const levelText = {
  low: '詳しい商品名がなくても出品しやすい',
  medium: 'できれば確認しておくと安心',
  high: '型番・動作・付属品の確認がおすすめ',
}

export function ResearchGuide({ categoryId, onContinue, onBack }: ResearchGuideProps) {
  const category = getCategory(categoryId)

  return (
    <div className="screen-stack">
      <SectionCard title={`${category.label}の調べる必要度`} tone="notice">
        <p className="judgement-line">{levelText[category.researchLevel]}</p>
        <p>{category.researchMessage}</p>
      </SectionCard>

      <SectionCard title="確認すると安心なこと">
        <ul className="check-list">
          {category.checkPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="注意点">
        <ul className="check-list">
          {category.safetyWarnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
          <li>不明な項目は不明のまま進められます。</li>
        </ul>
      </SectionCard>

      <div className="action-row">
        <button type="button" className="button button--ghost" onClick={onBack}>
          カテゴリを選び直す
        </button>
        <button type="button" className="button button--primary" onClick={onContinue}>
          入力へ進む
        </button>
      </div>
    </div>
  )
}
