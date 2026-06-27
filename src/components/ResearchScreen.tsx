import { useMemo, useState } from 'react'
import type { CategoryId, DraftInput, ListingDraft, ListingStatus, ResearchInfo } from '../types/draft'
import { applyResearchToDraftInput } from '../utils/applyResearchToDraftInput'
import { createResearchInfo } from '../utils/parseResearchMemo'
import { buildSearchLinks } from '../utils/searchLinks'
import { CopyButton } from './CopyButton'
import { SectionCard } from './SectionCard'

interface ResearchScreenProps {
  listing: ListingDraft
  onSave: (listing: ListingDraft) => void
  onApply: (input: DraftInput, research: ResearchInfo) => void
  onBack: () => void
}

const buildQuery = (research?: ResearchInfo) =>
  [research?.brandCandidate, research?.modelNumberCandidate, research?.productNameCandidate]
    .filter(Boolean)
    .join(' ')

const statusOptions: { value: ListingStatus; label: string }[] = [
  { value: 'researching', label: 'リサーチ中' },
  { value: 'draftReady', label: '下書き作成済み' },
  { value: 'listed', label: '出品済み' },
  { value: 'onHold', label: '保留' },
  { value: 'skipped', label: '出品しない' },
]

const categoryFromResearch = (input: DraftInput, research: ResearchInfo): CategoryId => {
  const memo = `${research.productNameCandidate ?? ''} ${research.rawMemo}`
  if (/マウス|キーボード|PC|Bluetooth|USB|イヤホン|ヘッドホン/i.test(memo)) return 'gadgets'
  if (/モニター|家電|炊飯|掃除機|Panasonic|SONY|Sony/i.test(memo)) return 'appliances'
  if (/おもちゃ|玩具|フィギュア|Nintendo|任天堂/i.test(memo)) return 'toys'
  if (/パンツ|シャツ|服|UNIQLO|GU/i.test(memo)) return 'clothes'
  if (/本|漫画|巻|ISBN/i.test(memo)) return 'books'
  return input.categoryId
}

export function ResearchScreen({ listing, onSave, onApply, onBack }: ResearchScreenProps) {
  const [rawMemo, setRawMemo] = useState(listing.research?.rawMemo ?? '')
  const [searchQuery, setSearchQuery] = useState(
    listing.research?.searchQuery || buildQuery(listing.research) || listing.input.roughName,
  )
  const [research, setResearch] = useState<ResearchInfo | undefined>(listing.research)
  const [status, setStatus] = useState<ListingStatus>(listing.status)
  const [pasteMessage, setPasteMessage] = useState('')

  const links = useMemo(() => buildSearchLinks(searchQuery), [searchQuery])
  const organizedText = research
    ? [
        `商品名候補：${research.productNameCandidate ?? '未検出'}`,
        `ブランド候補：${research.brandCandidate ?? '未検出'}`,
        `型番候補：${research.modelNumberCandidate ?? '未検出'}`,
        `価格候補：${research.foundPrices.length > 0 ? research.foundPrices.join(', ') : 'なし'}`,
        research.priceMemo ? `価格メモ：\n${research.priceMemo}` : '',
        research.accessoriesMemo ? `付属品メモ：${research.accessoriesMemo}` : '',
        research.cautionMemo ? `注意点：\n${research.cautionMemo}` : '',
      ]
        .filter(Boolean)
        .join('\n\n')
    : ''

  const persistResearch = (nextResearch: ResearchInfo) => {
    const nextStatus: ListingStatus = status === 'researching' && listing.generated ? 'draftReady' : status
    const nextListing = {
      ...listing,
      status: nextStatus,
      research: {
        ...nextResearch,
        searchQuery,
      },
      updatedAt: new Date().toISOString(),
    }
    onSave(nextListing)
  }

  const organize = () => {
    const nextResearch = createResearchInfo(rawMemo, { ...research, searchQuery })
    setResearch(nextResearch)
    persistResearch(nextResearch)
  }

  const applyToDraft = () => {
    if (!research) {
      return
    }

    const inputWithResearch = applyResearchToDraftInput(research, {
      ...listing.input,
      categoryId: categoryFromResearch(listing.input, research),
    })
    onApply(inputWithResearch, research)
  }

  const openLink = (url: string) => {
    if (!url) {
      return
    }
    if (research) {
      persistResearch(research)
    } else {
      onSave({
        ...listing,
        status: 'researching',
        updatedAt: new Date().toISOString(),
      })
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setRawMemo(text)
      setPasteMessage('クリップボードから貼り付けました。')
    } catch {
      setPasteMessage('自動貼り付けができませんでした。手動で貼り付けてください。')
    }
  }

  return (
    <div className="screen-stack">
      <SectionCard title="Googleレンズや検索で商品を調べる" tone="success">
        <p>
          Googleレンズや検索で商品名・型番・価格を確認し、見つけた情報を下の欄に貼り付けてください。
          このアプリは検索結果を自動取得せず、貼り付けた情報を整理します。
        </p>
        <div className="search-link-grid">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              className={link.id === 'lens' ? 'button button--primary' : 'button button--secondary'}
              disabled={link.disabled}
              onClick={() => openLink(link.url)}
            >
              {link.label}
            </button>
          ))}
        </div>
        <p className="helper-text">
          Googleレンズが直接カメラ起動しない場合は、GoogleアプリまたはChromeのGoogleレンズ機能から検索してください。
        </p>
      </SectionCard>

      <SectionCard title="検索ワード">
        <label className="field">
          <span>ステータス</span>
          <select
            value={status}
            onChange={(event) => {
              const nextStatus = event.target.value as ListingStatus
              setStatus(nextStatus)
              onSave({
                ...listing,
                status: nextStatus,
                updatedAt: new Date().toISOString(),
              })
            }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>検索ワード</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ブランド 型番 商品名"
          />
        </label>
      </SectionCard>

      <SectionCard title="見つけた情報を雑に貼る">
        <p className="helper-text">
          Googleレンズ、Google検索、メルカリ検索などで見つけた情報を雑に貼ってください。
        </p>
        <label className="field">
          <span>Googleレンズや検索結果で見つけた情報を貼る</span>
          <textarea
            className="research-textarea"
            value={rawMemo}
            onChange={(event) => setRawMemo(event.target.value)}
            placeholder={'Logicool M720\nワイヤレスマウス\nBluetooth Unifying対応\n中古 2500円 3000円 3200円\n箱なし 本体のみ'}
          />
        </label>
        {pasteMessage && <p className="helper-text">{pasteMessage}</p>}
        <div className="action-row">
          <button type="button" className="button button--secondary" onClick={pasteFromClipboard}>
            クリップボードから貼り付け
          </button>
          <button type="button" className="button button--primary" onClick={organize}>
            貼り付け内容を整理する
          </button>
        </div>
      </SectionCard>

      {research && (
        <SectionCard title="整理結果" tone="notice">
          <div className="research-result-grid">
            <p>
              <strong>商品名候補</strong>
              {research.productNameCandidate ?? '未検出'}
            </p>
            <p>
              <strong>ブランド候補</strong>
              {research.brandCandidate ?? '未検出'}
            </p>
            <p>
              <strong>型番候補</strong>
              {research.modelNumberCandidate ?? '未検出'}
            </p>
            <p>
              <strong>価格候補</strong>
              {research.foundPrices.length > 0 ? research.foundPrices.join(' / ') : 'なし'}
            </p>
          </div>
          {research.priceMemo && <pre className="description-box">{research.priceMemo}</pre>}
          {research.accessoriesMemo && <p>付属品メモ：{research.accessoriesMemo}</p>}
          {research.cautionMemo && <pre className="description-box">{research.cautionMemo}</pre>}
          <p className="helper-text">
            この情報は貼り付け内容から整理した候補です。出品前に商品名・型番・状態・付属品を確認してください。
          </p>
          <div className="result-actions">
            <CopyButton label="整理済み情報をコピー" text={organizedText} />
            <button type="button" className="button button--primary" onClick={applyToDraft}>
              この情報で出品下書きを作る
            </button>
            <button type="button" className="button button--ghost" onClick={() => setResearch(undefined)}>
              クリア
            </button>
          </div>
        </SectionCard>
      )}

      <button type="button" className="button button--ghost" onClick={onBack}>
        ホームへ戻る
      </button>
    </div>
  )
}
