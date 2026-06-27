import type { DraftInput, ResearchInfo } from '../types/draft'

function appendMemo(existing: string | undefined, label: string, memo: string | undefined) {
  if (!memo) {
    return existing
  }

  const block = `${label}：\n${memo}`
  return existing ? `${existing}\n\n${block}` : block
}

export function applyResearchToDraftInput(research: ResearchInfo, currentInput: DraftInput): DraftInput {
  let freeMemo = currentInput.freeMemo
  freeMemo = appendMemo(freeMemo, 'リサーチ説明メモ', research.productDescriptionMemo)
  freeMemo = appendMemo(freeMemo, 'リサーチ価格メモ', research.priceMemo)
  freeMemo = appendMemo(freeMemo, 'リサーチ注意点', research.cautionMemo)

  return {
    ...currentInput,
    roughName: currentInput.roughName || research.productNameCandidate || currentInput.roughName,
    brand: currentInput.brand || research.brandCandidate,
    brandUnknown: currentInput.brand ? currentInput.brandUnknown : false,
    modelNumber: currentInput.modelNumber || research.modelNumberCandidate,
    modelNumberUnknown: currentInput.modelNumber ? currentInput.modelNumberUnknown : false,
    freeMemo,
    priceResearchMemo: research.priceMemo,
    updatedAt: new Date().toISOString(),
  }
}
