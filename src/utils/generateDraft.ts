import { getCategory } from '../data/categories'
import {
  conditionDescriptions,
  priceMemos,
  valueMessages,
} from '../data/templates'
import type { CategoryId, DraftInput, GeneratedDraft } from '../types/draft'
import { judgeValue } from './valueJudgement'

const tidy = (value?: string) => value?.trim()

const unique = (items: string[]) =>
  items.filter((item, index) => item && items.indexOf(item) === index)

function memoAsWritten(label: string, memo?: string) {
  const text = memo?.trim()

  if (!text) {
    return undefined
  }

  return `${label}：\n${text}`
}

function selectedAccessories(input: DraftInput) {
  if (input.accessoryUnknown || input.accessories.includes('付属品不明')) {
    return '付属品不明'
  }

  const accessories = unique(input.accessories)

  if (accessories.length === 0) {
    return '写真に写っているものがすべて'
  }

  if (accessories.includes('本体のみ')) {
    return '本体のみ'
  }

  if (accessories.includes('写真に写っているものがすべて')) {
    const others = accessories.filter((item) => item !== '写真に写っているものがすべて')
    return others.length > 0
      ? `写真に写っているものがすべて（${others.join('、')}）`
      : '写真に写っているものがすべて'
  }

  return accessories.join('、')
}

function shippingSentence(categoryId: CategoryId) {
  switch (categoryId) {
    case 'clothes':
    case 'kidsClothes':
      return '折りたたみ、防水対策をして発送します。'
    case 'books':
      return '水濡れ対策をして発送します。'
    case 'appliances':
    case 'gadgets':
      return '緩衝材で包み、段ボール等で発送します。'
    case 'tableware':
      return '緩衝材で包み、割れに注意して発送します。'
    default:
      return '必要に応じて緩衝材や袋を使って発送します。'
  }
}

function categoryDescriptionLine(input: DraftInput) {
  switch (input.categoryId) {
    case 'clothes':
      return 'ブランドタグ・サイズタグ・生地感がわかる写真を載せる予定です。'
    case 'kidsClothes':
      return 'サイズ、枚数、記名や汚れの有無がわかるように写真を載せる予定です。'
    case 'books':
      return '表紙、背表紙、日焼けや傷みがある部分を写真で確認できるようにします。'
    case 'toys':
      return 'パーツや付属品の状態は、写真に写っている内容をご確認ください。'
    case 'appliances':
      return '型番、付属品、動作状況はわかる範囲で記載しています。'
    case 'gadgets':
      return '型番、端子まわり、付属品、動作状況は写真と説明文をご確認ください。'
    case 'bags':
      return '外側、内側、持ち手、角の状態がわかるように写真を載せる予定です。'
    case 'shoes':
      return 'サイズ表記、ソール、かかと、汚れの状態がわかるように写真を載せる予定です。'
    case 'tableware':
      return '欠けやヒビの有無、裏面や刻印がわかるように写真を載せる予定です。'
    case 'misc':
      return 'サイズ感、使用感、傷や汚れがわかるように写真を載せる予定です。'
    default:
      return '状態や付属品は写真で確認できるようにします。'
  }
}

function operationLine(input: DraftInput) {
  if (!input.operationStatus) {
    return undefined
  }

  if (input.operationStatus.includes('未確認')) {
    return `動作状況：${input.operationStatus}です。`
  }

  return `動作状況：${input.operationStatus}です。`
}

function categoryUnknownHint(input: DraftInput) {
  if (input.categoryId === 'appliances' || input.categoryId === 'gadgets') {
    if (input.modelNumberUnknown || input.operationStatus?.includes('未確認')) {
      return '型番や動作状況に不明点があるため、写真をご確認のうえご検討ください。'
    }
  }

  if (input.categoryId === 'toys' && input.accessoryUnknown) {
    return 'パーツの欠品有無は不明です。写真に写っているものをご確認ください。'
  }

  if (input.categoryId === 'books' && input.sizeUnknown) {
    return '巻数や冊数に不明点がある場合は、写真をご確認ください。'
  }

  return undefined
}

export function generateTitle(input: DraftInput) {
  const parts = [
    input.brandUnknown ? undefined : tidy(input.brand),
    tidy(input.modelNumber),
    tidy(input.roughName),
    tidy(input.color),
    input.sizeUnknown ? undefined : tidy(input.size),
    tidy(input.quantity),
    input.sellingPriority === 'bundle' ? 'まとめ売り' : undefined,
    input.accessories.includes('本体のみ') ? '本体のみ' : undefined,
  ]

  return unique(parts.filter(Boolean) as string[]).join(' ') || '出品下書き'
}

function makeOverview(input: DraftInput) {
  const lines = []
  const name = tidy(input.roughName) || '商品'
  const brand = input.brandUnknown ? '' : tidy(input.brand)
  const color = tidy(input.color)
  const size = input.sizeUnknown ? '' : tidy(input.size)
  const model = input.modelNumberUnknown ? '' : tidy(input.modelNumber)

  lines.push(brand ? `${brand}の${name}です。` : `${name}です。`)

  const details = [
    color ? `カラーは${color}` : '',
    size ? `サイズは${size}` : '',
    model ? `型番は${model}` : '',
    input.quantity ? `個数は${input.quantity}` : '',
  ].filter(Boolean)

  if (details.length > 0) {
    lines.push(`${details.join('、')}です。`)
  }

  return lines.join('\n')
}

export function generateDescription(input: DraftInput) {
  const category = getCategory(input.categoryId)
  const sections = [
    makeOverview(input),
    conditionDescriptions[input.condition],
    categoryDescriptionLine(input),
    `付属品は${selectedAccessories(input)}です。`,
  ]

  const notes = []
  const operation = operationLine(input)
  const unknownHint = categoryUnknownHint(input)

  if (input.brandUnknown) {
    notes.push('ブランド名・詳しい商品名は不明です。')
  }
  if (input.sizeUnknown) {
    notes.push('サイズ表記は確認できていないため、写真をご確認ください。')
  }
  if (input.modelNumberUnknown) {
    notes.push('型番は確認できていないため、写真をご確認ください。')
  }
  if (input.accessoryUnknown || input.accessories.includes('付属品不明')) {
    notes.push('付属品の詳細は不明です。写真に写っているものがすべてです。')
  }
  if (input.operationStatus?.includes('未確認')) {
    notes.push('動作未確認のため、状態にご理解いただける方のみご購入をお願いします。')
  }
  if (input.operationStatus === 'ジャンク扱い') {
    notes.push('ジャンク扱いとしてご検討ください。')
  }
  if (operation) {
    notes.push(operation)
  }
  if (unknownHint) {
    notes.push(unknownHint)
  }

  const defectMemo = memoAsWritten('傷・汚れなど', input.defectMemo)
  const storageMemo = memoAsWritten('保管状況', input.storageMemo)
  const freeMemo = memoAsWritten('補足', input.freeMemo)

  if (defectMemo) {
    notes.push(defectMemo)
  }
  if (storageMemo) {
    notes.push(storageMemo)
  }
  if (freeMemo) {
    notes.push(freeMemo)
  }

  if (notes.length > 0) {
    sections.push(notes.join('\n'))
  }

  sections.push(shippingSentence(category.id))
  sections.push('状態は写真をご確認いただき、ご理解いただける方のみご購入をお願いします。')

  return sections.filter(Boolean).join('\n\n')
}

export function generateWarnings(input: DraftInput) {
  const category = getCategory(input.categoryId)
  const warnings = [...category.safetyWarnings]

  if (category.researchLevel === 'high') {
    warnings.push('型番・動作確認・付属品は、わかる範囲で確認すると安全です。')
  }
  if (input.modelNumberUnknown) {
    warnings.push('型番不明として説明文に入れています。')
  }
  if (input.operationStatus?.includes('未確認')) {
    warnings.push('動作未確認として説明文に入れています。')
  }
  if (input.brandUnknown) {
    warnings.push('ブランド名は断定せず、不明として扱っています。')
  }

  return unique(warnings)
}

export function generateDraft(input: DraftInput): GeneratedDraft {
  const category = getCategory(input.categoryId)
  const judgement = judgeValue(input)

  return {
    title: generateTitle(input),
    description: generateDescription(input),
    photoChecklist: category.photoChecklist,
    priceMemo: priceMemos[input.sellingPriority],
    packagingMemo: category.defaultPackagingMemo,
    valueJudgement: judgement.valueJudgement,
    valueJudgementLabel: judgement.valueJudgementLabel,
    warnings: unique([judgement.message, ...generateWarnings(input)]),
  }
}

export const getValueMessage = (valueJudgement: GeneratedDraft['valueJudgement']) =>
  valueMessages[valueJudgement]
