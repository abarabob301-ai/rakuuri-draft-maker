import { knownBrands } from '../data/brands'
import type { ResearchInfo } from '../types/draft'
import { createPriceMemo, extractPrices } from './priceUtils'

export interface ParsedResearchMemo {
  productNameCandidate?: string
  brandCandidate?: string
  modelNumberCandidate?: string
  foundPrices: number[]
  priceMemo?: string
  accessoriesMemo?: string
  cautionMemo?: string
  productDescriptionMemo?: string
}

const accessoryWords = [
  '箱あり',
  '箱なし',
  '本体のみ',
  '説明書あり',
  '説明書なし',
  '充電器あり',
  '充電器なし',
  'ケーブルあり',
  'ケーブルなし',
  'レシーバーあり',
  'レシーバーなし',
  '付属品あり',
  '付属品なし',
  '未使用',
  'ジャンク',
]

function findBrand(rawMemo: string) {
  const lower = rawMemo.toLowerCase()
  return knownBrands.find((brand) => lower.includes(brand.toLowerCase()))
}

function findModel(rawMemo: string) {
  const matches = rawMemo.match(/\b(?=[A-Z0-9-]*[A-Z])(?=[A-Z0-9-]*\d)[A-Z0-9][A-Z0-9-]{2,19}\b/gi) ?? []
  return matches.find((match) => !/^\d+$/.test(match))
}

function findProductName(rawMemo: string, brand?: string, model?: string) {
  const lines = rawMemo
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !extractPrices(line).length)

  const usefulLines = lines.filter((line) => {
    if (accessoryWords.some((word) => line.includes(word))) {
      return false
    }
    return /[ぁ-んァ-ン一-龥A-Za-z]/.test(line)
  })
  const useful = usefulLines[0]

  if (!useful) {
    return undefined
  }

  if (
    usefulLines.length >= 2 &&
    ((brand && useful.includes(brand)) || (model && useful.includes(model))) &&
    !usefulLines[1].includes(useful)
  ) {
    return `${useful} ${usefulLines[1]}`
  }

  if (brand && model && useful.includes(brand) && useful.includes(model)) {
    return useful
  }

  return useful
}

export function parseResearchMemo(rawMemo: string): ParsedResearchMemo {
  const foundPrices = extractPrices(rawMemo)
  const brandCandidate = findBrand(rawMemo)
  const modelNumberCandidate = findModel(rawMemo)
  const productNameCandidate = findProductName(rawMemo, brandCandidate, modelNumberCandidate)
  const foundAccessories = accessoryWords.filter((word) => rawMemo.includes(word))
  const cautions = []

  if (modelNumberCandidate) {
    cautions.push('型番が価格に影響する可能性があります。タイトルや説明文に型番を入れると検索されやすくなります。')
  }
  if (foundPrices.length >= 2 && Math.max(...foundPrices) >= Math.min(...foundPrices) * 1.8) {
    cautions.push('確認した価格に差があります。状態、付属品、送料込みかどうかを確認してください。')
  }
  if (foundAccessories.some((item) => ['本体のみ', '箱なし', '付属品なし'].includes(item))) {
    cautions.push('箱や付属品の有無で価格が変わる可能性があります。')
  }
  if (rawMemo.includes('ジャンク') || rawMemo.includes('動作未確認')) {
    cautions.push('動作未確認やジャンク扱いの場合は、説明文に必ず明記してください。')
  }
  if (brandCandidate) {
    cautions.push('ブランド名は写真やタグで確認し、断定できない場合は説明文で強く言い切らないでください。')
  }

  return {
    productNameCandidate,
    brandCandidate,
    modelNumberCandidate,
    foundPrices,
    priceMemo: createPriceMemo(foundPrices),
    accessoriesMemo: foundAccessories.length > 0 ? foundAccessories.join('、') : undefined,
    cautionMemo: cautions.join('\n') || undefined,
    productDescriptionMemo: productNameCandidate
      ? `${productNameCandidate}として見つかった情報です。仕様の詳細は型番や写真をご確認ください。`
      : undefined,
  }
}

export function createResearchInfo(rawMemo: string, current?: Partial<ResearchInfo>): ResearchInfo {
  const parsed = parseResearchMemo(rawMemo)
  const now = new Date().toISOString()

  return {
    rawMemo,
    searchQuery: current?.searchQuery,
    productNameCandidate: current?.productNameCandidate || parsed.productNameCandidate,
    brandCandidate: current?.brandCandidate || parsed.brandCandidate,
    modelNumberCandidate: current?.modelNumberCandidate || parsed.modelNumberCandidate,
    productDescriptionMemo: parsed.productDescriptionMemo,
    foundPrices: parsed.foundPrices,
    priceMemo: parsed.priceMemo,
    accessoriesMemo: parsed.accessoriesMemo,
    cautionMemo: parsed.cautionMemo,
    referenceUrls: current?.referenceUrls ?? [],
    updatedAt: now,
  }
}
