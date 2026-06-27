const pricePatterns = [
  /[¥￥]\s?\d{1,3}(?:,\d{3})+(?:\s?円)?/g,
  /\d{1,3}(?:,\d{3})+\s?円?/g,
  /[¥￥]\s?\d{3,6}/g,
  /\d{3,6}\s?円/g,
  /\d+(?:\.\d+)?万円/g,
  /\d+万\d{1,4}円?/g,
]

export function formatYen(value: number) {
  return `${value.toLocaleString('ja-JP')}円`
}

function normalizePrice(token: string) {
  const text = token.replace(/\s/g, '').replace(/[¥￥,]/g, '')

  if (text.includes('万円')) {
    return Math.round(Number.parseFloat(text.replace('万円', '')) * 10000)
  }

  const manMatch = text.match(/(\d+)万(\d{1,4})円?/)
  if (manMatch) {
    return Number(manMatch[1]) * 10000 + Number(manMatch[2])
  }

  return Number(text.replace('円', ''))
}

export function extractPrices(text: string) {
  const matches = pricePatterns.flatMap((pattern) => text.match(pattern) ?? [])
  const bareMatches = [...text.matchAll(/(?:^|[^\w])(\d{3,6})(?=$|[^\w])/g)]
    .map((match) => match[1])
    .filter((match) => !new RegExp(`${match}\\s*年`).test(text))
  const prices = matches
    .concat(bareMatches)
    .map(normalizePrice)
    .filter((price) => Number.isFinite(price) && price >= 100 && price < 1_000_000)

  return [...new Set(prices)].sort((a, b) => a - b)
}

export function getMedian(values: number[]) {
  if (values.length === 0) {
    return null
  }

  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2)
  }

  return sorted[middle]
}

export function createPriceMemo(values: number[]) {
  if (values.length === 0) {
    return '価格情報はまだありません。検索結果やメルカリの売り切れ価格を確認して、見つけた価格を貼り付けてください。'
  }

  if (values.length === 1) {
    return `確認できた価格は${formatYen(values[0])}です。相場としては情報が少ないため、追加で2〜3件確認すると安心です。`
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const median = getMedian(values) ?? min
  const spreadWarning =
    max >= min * 1.8
      ? '\n価格差が大きいため、状態・付属品・送料込みかどうかを確認してください。'
      : ''

  return [
    `確認価格：${values.map(formatYen).join(' / ')}`,
    `価格帯：${formatYen(min)}〜${formatYen(max)}前後`,
    `中央値：${formatYen(median)}前後`,
    `まずは${formatYen(median)}〜${formatYen(max)}前後、早く売りたい場合は${formatYen(min)}〜${formatYen(median)}前後を検討してください。${spreadWarning}`,
  ].join('\n')
}
