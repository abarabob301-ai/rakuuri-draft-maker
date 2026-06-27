import { getCategory } from '../data/categories'
import { valueLabels, valueMessages } from '../data/templates'
import type { DraftInput, ValueJudgement } from '../types/draft'

const bundleFriendly = ['kidsClothes', 'books', 'misc', 'toys']
const largeOrCareful = ['appliances', 'tableware', 'gadgets']

export function judgeValue(input: DraftInput): {
  valueJudgement: ValueJudgement
  valueJudgementLabel: string
  message: string
} {
  const category = getCategory(input.categoryId)
  const operationUnknown =
    input.operationStatus?.includes('未確認') || input.operationStatus === 'ジャンク扱い'

  let valueJudgement: ValueJudgement = 'recommend'

  if (
    input.condition === 'poor' ||
    input.sellingPriority === 'avoidLoss' ||
    (largeOrCareful.includes(input.categoryId) && input.accessoryUnknown && operationUnknown)
  ) {
    valueJudgement = 'maybeSkip'
  } else if (
    bundleFriendly.includes(input.categoryId) &&
    (input.sellingPriority === 'bundle' || Boolean(input.quantity))
  ) {
    valueJudgement = 'bundleRecommended'
  } else if (
    category.researchLevel === 'high' ||
    input.modelNumberUnknown ||
    input.accessoryUnknown ||
    operationUnknown ||
    input.condition === 'unknown'
  ) {
    valueJudgement = 'needsCheck'
  }

  return {
    valueJudgement,
    valueJudgementLabel: valueLabels[valueJudgement],
    message: valueMessages[valueJudgement],
  }
}
