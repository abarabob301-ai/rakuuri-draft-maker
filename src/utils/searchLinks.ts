export interface SearchLink {
  id: string
  label: string
  url: string
  note?: string
  disabled?: boolean
}

export function buildSearchLinks(query: string): SearchLink[] {
  const trimmed = query.trim()
  const encoded = encodeURIComponent(trimmed)
  const disabled = !trimmed

  return [
    { id: 'lens', label: 'Googleレンズを開く', url: 'https://lens.google.com/' },
    {
      id: 'google',
      label: 'Google検索を開く',
      url: disabled ? '' : `https://www.google.com/search?q=${encoded}`,
      disabled,
    },
    {
      id: 'images',
      label: 'Google画像検索を開く',
      url: disabled ? '' : `https://www.google.com/search?tbm=isch&q=${encoded}`,
      disabled,
    },
    {
      id: 'mercari',
      label: 'メルカリで検索',
      url: disabled ? '' : `https://jp.mercari.com/search?keyword=${encoded}`,
      disabled,
    },
    {
      id: 'mercari-sold',
      label: 'メルカリ売り切れ検索',
      url: disabled ? '' : `https://jp.mercari.com/search?keyword=${encoded}`,
      note: 'メルカリ画面で売り切れに絞り込んで価格を確認してください。',
      disabled,
    },
    {
      id: 'amazon',
      label: 'Amazonで検索',
      url: disabled ? '' : `https://www.amazon.co.jp/s?k=${encoded}`,
      disabled,
    },
    {
      id: 'rakuten',
      label: '楽天で検索',
      url: disabled ? '' : `https://search.rakuten.co.jp/search/mall/${encoded}/`,
      disabled,
    },
    {
      id: 'yahoo',
      label: 'Yahoo!検索で開く',
      url: disabled ? '' : `https://search.yahoo.co.jp/search?p=${encoded}`,
      disabled,
    },
  ]
}
