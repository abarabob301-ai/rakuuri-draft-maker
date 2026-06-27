import { useMemo, useState } from 'react'
import { getCategory, needsOperationCheck } from '../data/categories'
import {
  accessoryOptions,
  conditionLabels,
  operationOptions,
  priorityLabels,
} from '../data/templates'
import type { CategoryId, Condition, DraftInput, SellingPriority } from '../types/draft'
import { generateDraft } from '../utils/generateDraft'

interface DraftFormProps {
  categoryId: CategoryId
  initialInput?: DraftInput
  onSubmit: (input: DraftInput) => void
  onBack: () => void
}

const conditions = Object.entries(conditionLabels) as [Condition, string][]
const priorities = Object.entries(priorityLabels) as [SellingPriority, string][]

const categoryFormHints: Record<
  CategoryId,
  {
    brandLabel: string
    sizeLabel: string
    modelLabel: string
    defectPlaceholder: string
    storagePlaceholder: string
    freePlaceholder: string
  }
> = {
  clothes: {
    brandLabel: 'ブランド名',
    sizeLabel: 'サイズ',
    modelLabel: '型番',
    defectPlaceholder: '毛玉あり、タグに記名なし、右袖に薄い汚れなど',
    storagePlaceholder: '自宅保管、クローゼット保管など',
    freePlaceholder: '伸縮性あり、薄手、春秋向けなど',
  },
  kidsClothes: {
    brandLabel: 'ブランド名',
    sizeLabel: 'サイズ',
    modelLabel: '型番',
    defectPlaceholder: '記名あり、膝に薄い汚れ、毛玉少しなど',
    storagePlaceholder: '自宅保管、サイズアウト後に保管など',
    freePlaceholder: 'まとめ売り、保育園用、季節感など',
  },
  books: {
    brandLabel: '出版社・作者',
    sizeLabel: '巻数・冊数',
    modelLabel: 'ISBNなど',
    defectPlaceholder: '日焼けあり、角折れあり、書き込みなしなど',
    storagePlaceholder: '本棚で保管、暗所保管など',
    freePlaceholder: '全巻ではありません、帯なし、特典なしなど',
  },
  toys: {
    brandLabel: 'メーカー名',
    sizeLabel: 'サイズ感',
    modelLabel: 'シリーズ名・型番',
    defectPlaceholder: '30年前に購入。経年劣化あり。電池カバーなしなど',
    storagePlaceholder: '自宅保管、押し入れで保管など',
    freePlaceholder: 'パーツ欠品不明、乾電池は付属しませんなど',
  },
  appliances: {
    brandLabel: 'メーカー名',
    sizeLabel: 'サイズ',
    modelLabel: '型番',
    defectPlaceholder: '本体に小傷あり、コードに汚れありなど',
    storagePlaceholder: '自宅保管、使用後に保管など',
    freePlaceholder: '説明書なし、動作確認は短時間のみなど',
  },
  gadgets: {
    brandLabel: 'メーカー名',
    sizeLabel: 'サイズ',
    modelLabel: '型番',
    defectPlaceholder: '端子まわりに小傷あり、バッテリー状態不明など',
    storagePlaceholder: '自宅保管、引き出しで保管など',
    freePlaceholder: '接続方式、対応機種、ケーブル有無など',
  },
  bags: {
    brandLabel: 'ブランド名',
    sizeLabel: 'サイズ感',
    modelLabel: '型番',
    defectPlaceholder: '角スレあり、内側に薄い汚れ、持ち手に使用感など',
    storagePlaceholder: '自宅保管、クローゼット保管など',
    freePlaceholder: 'ポケット数、A4可否、付属品なしなど',
  },
  shoes: {
    brandLabel: 'ブランド名',
    sizeLabel: 'サイズ',
    modelLabel: '型番',
    defectPlaceholder: 'ソール減りあり、かかとに汚れ、箱なしなど',
    storagePlaceholder: '玄関収納で保管、自宅保管など',
    freePlaceholder: '普段使い、雨の日使用ありなど',
  },
  tableware: {
    brandLabel: 'ブランド名',
    sizeLabel: 'サイズ',
    modelLabel: 'シリーズ名',
    defectPlaceholder: '欠けなし、ヒビなし、細かなスレありなど',
    storagePlaceholder: '食器棚で保管、自宅保管など',
    freePlaceholder: '使用回数少なめ、来客用、箱なしなど',
  },
  misc: {
    brandLabel: 'ブランド・メーカー',
    sizeLabel: 'サイズ',
    modelLabel: '型番',
    defectPlaceholder: '小傷あり、使用感あり、目立つ汚れなしなど',
    storagePlaceholder: '自宅保管、棚で保管など',
    freePlaceholder: '用途、素材、付属品についてなど',
  },
  other: {
    brandLabel: 'ブランド・メーカー',
    sizeLabel: 'サイズ',
    modelLabel: '型番',
    defectPlaceholder: '傷や汚れ、欠品、不明点など',
    storagePlaceholder: '自宅保管、使用後に保管など',
    freePlaceholder: '説明に入れておきたいこと',
  },
}

function createInitialInput(categoryId: CategoryId, initialInput?: DraftInput): DraftInput {
  const now = new Date().toISOString()

  return (
    initialInput ?? {
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      categoryId,
      roughName: '',
      condition: 'good',
      sellingPriority: 'normal',
      accessories: ['写真に写っているものがすべて'],
    }
  )
}

export function DraftForm({ categoryId, initialInput, onSubmit, onBack }: DraftFormProps) {
  const category = getCategory(categoryId)
  const hints = categoryFormHints[categoryId]
  const [input, setInput] = useState(() => createInitialInput(categoryId, initialInput))

  const operationVisible = useMemo(() => needsOperationCheck(categoryId), [categoryId])
  const previewInput = useMemo(
    () => ({
      ...input,
      categoryId,
      roughName: input.roughName.trim() || category.label,
    }),
    [category.label, categoryId, input],
  )
  const previewDraft = useMemo(() => generateDraft(previewInput), [previewInput])

  const update = <K extends keyof DraftInput>(key: K, value: DraftInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }))
  }

  const toggleAccessory = (accessory: string) => {
    setInput((current) => {
      const hasAccessory = current.accessories.includes(accessory)
      const accessories = hasAccessory
        ? current.accessories.filter((item) => item !== accessory)
        : [...current.accessories, accessory]

      return {
        ...current,
        accessories,
        accessoryUnknown: accessories.includes('付属品不明'),
      }
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const now = new Date().toISOString()

    onSubmit({
      ...input,
      categoryId,
      roughName: input.roughName.trim() || category.label,
      updatedAt: now,
    })
  }

  return (
    <form className="draft-workspace" onSubmit={handleSubmit}>
      <div className="draft-form-column">
        <section className="section-card">
          <p className="eyebrow">{category.label}の下書き</p>
          <h2>わかる範囲だけ入力</h2>

          <label className="field">
            <span>ざっくり商品名</span>
            <input
              value={input.roughName}
              onChange={(event) => update('roughName', event.target.value)}
              placeholder="黒いパンツ、木のおもちゃ、マウスなど"
              required
            />
          </label>

          <label className="field">
            <span>商品状態</span>
            <select
              value={input.condition}
              onChange={(event) => update('condition', event.target.value as Condition)}
            >
              {conditions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>売り方</span>
            <select
              value={input.sellingPriority}
              onChange={(event) => update('sellingPriority', event.target.value as SellingPriority)}
            >
              {priorities.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="section-card section-card--compact">
          <h2>{category.label}で見るポイント</h2>
          <div className="hint-chip-grid">
            {category.checkPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
          <p className="helper-text">{category.researchMessage}</p>
        </section>

        <section className="section-card">
          <h2>わかれば入力</h2>
          <label className="field">
            <span>{hints.brandLabel}</span>
            <input
              value={input.brand ?? ''}
              onChange={(event) => update('brand', event.target.value)}
              disabled={input.brandUnknown}
              placeholder="UNIQLO、Logicool、メーカー名など"
            />
          </label>
          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={Boolean(input.brandUnknown)}
              onChange={(event) => update('brandUnknown', event.target.checked)}
            />
            ブランド・メーカー不明のまま進める
          </label>

          <div className="field-grid">
            <label className="field">
              <span>{hints.sizeLabel}</span>
              <input
                value={input.size ?? ''}
                onChange={(event) => update('size', event.target.value)}
                disabled={input.sizeUnknown}
                placeholder="M、100cm、約20cm"
              />
            </label>
            <label className="field">
              <span>色</span>
              <input
                value={input.color ?? ''}
                onChange={(event) => update('color', event.target.value)}
                placeholder="ブラック、白、木目"
              />
            </label>
          </div>

          <label className="checkbox-line">
            <input
              type="checkbox"
              checked={Boolean(input.sizeUnknown)}
              onChange={(event) => update('sizeUnknown', event.target.checked)}
            />
            サイズ・巻数など不明のまま進める
          </label>

          <div className="field-grid">
            <label className="field">
              <span>{hints.modelLabel}</span>
              <input
                value={input.modelNumber ?? ''}
                onChange={(event) => update('modelNumber', event.target.value)}
                disabled={input.modelNumberUnknown}
                placeholder="M720、ABC-123、シリーズ名など"
              />
            </label>
            <label className="field">
              <span>個数</span>
              <input
                value={input.quantity ?? ''}
                onChange={(event) => update('quantity', event.target.value)}
                placeholder="2点、10冊など"
              />
            </label>
          </div>

          <label className="checkbox-line checkbox-line--notice">
            <input
              type="checkbox"
              checked={Boolean(input.modelNumberUnknown)}
              onChange={(event) => update('modelNumberUnknown', event.target.checked)}
            />
            型番・シリーズ名不明のまま進める
          </label>
        </section>

        <section className="section-card">
          <h2>付属品</h2>
          <div className="chip-grid">
            {accessoryOptions.map((accessory) => (
              <label key={accessory} className="chip-checkbox">
                <input
                  type="checkbox"
                  checked={input.accessories.includes(accessory)}
                  onChange={() => toggleAccessory(accessory)}
                />
                {accessory}
              </label>
            ))}
          </div>
        </section>

        {operationVisible && (
          <section className="section-card section-card--notice">
            <h2>動作確認</h2>
            <div className="radio-stack">
              {operationOptions.map((option) => (
                <label key={option} className="checkbox-line">
                  <input
                    type="radio"
                    name="operationStatus"
                    checked={input.operationStatus === option}
                    onChange={() => update('operationStatus', option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </section>
        )}

        <section className="section-card">
          <h2>メモ</h2>
          <label className="field">
            <span>傷・汚れメモ</span>
            <textarea
              value={input.defectMemo ?? ''}
              onChange={(event) => update('defectMemo', event.target.value)}
              placeholder={hints.defectPlaceholder}
            />
          </label>
          <label className="field">
            <span>保管状況</span>
            <textarea
              value={input.storageMemo ?? ''}
              onChange={(event) => update('storageMemo', event.target.value)}
              placeholder={hints.storagePlaceholder}
            />
          </label>
          <label className="field">
            <span>自由メモ</span>
            <textarea
              value={input.freeMemo ?? ''}
              onChange={(event) => update('freeMemo', event.target.value)}
              placeholder={hints.freePlaceholder}
            />
          </label>
        </section>

        <div className="action-row">
          <button type="button" className="button button--ghost" onClick={onBack}>
            戻る
          </button>
          <button type="submit" className="button button--primary">
            下書きを生成
          </button>
        </div>
      </div>

      <aside className="draft-preview" aria-label="生成プレビュー">
        <div className="draft-preview__sticky">
          <p className="eyebrow">ライブプレビュー</p>
          <h2>{previewDraft.title}</h2>
          <div className="draft-preview__section">
            <strong>説明文</strong>
            <pre>{previewDraft.description}</pre>
          </div>
          <div className="draft-preview__section">
            <strong>写真チェック</strong>
            <ul>
              {previewDraft.photoChecklist.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="draft-preview__badge">{previewDraft.valueJudgementLabel}</div>
        </div>
      </aside>
    </form>
  )
}
