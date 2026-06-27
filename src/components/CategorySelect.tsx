import { categories } from '../data/categories'
import type { CategoryId } from '../types/draft'

interface CategorySelectProps {
  onSelect: (categoryId: CategoryId) => void
  onBack: () => void
}

export function CategorySelect({ onSelect, onBack }: CategorySelectProps) {
  return (
    <div className="screen-stack">
      <section className="section-card">
        <p className="eyebrow">まずはカテゴリ</p>
        <h2>何を出品しますか？</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="category-button"
              onClick={() => onSelect(category.id)}
            >
              <span>{category.label}</span>
              <small>
                {category.researchLevel === 'low'
                  ? '気軽に進めやすい'
                  : category.researchLevel === 'medium'
                    ? '写真多めが安心'
                    : '確認してから安全に'}
              </small>
            </button>
          ))}
        </div>
      </section>
      <button type="button" className="button button--ghost" onClick={onBack}>
        ホームへ戻る
      </button>
    </div>
  )
}
