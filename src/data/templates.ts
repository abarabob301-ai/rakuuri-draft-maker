import type { Condition, SellingPriority, ValueJudgement } from '../types/draft'

export const conditionLabels: Record<Condition, string> = {
  new: '新品・未使用',
  likeNew: 'ほぼ使っていない',
  good: '目立った傷や汚れなし',
  slightlyDamaged: 'やや傷や汚れあり',
  damaged: '傷や汚れあり',
  poor: '全体的に状態が悪い',
  unknown: '状態不明',
}

export const conditionDescriptions: Record<Condition, string> = {
  new: '未使用の品です。保管中の細かな状態は写真をご確認ください。',
  likeNew: '使用回数は少なめですが、自宅保管品のため細かな状態は写真をご確認ください。',
  good: '目立つ傷や汚れは見当たりませんが、中古品のため細かな使用感はご了承ください。',
  slightlyDamaged: 'やや傷や汚れがあります。気になる部分は写真をご確認ください。',
  damaged: '傷や汚れがあります。状態にご理解いただける方のみご検討ください。',
  poor: '全体的に使用感があります。状態を写真でご確認のうえご検討ください。',
  unknown: '状態の詳細は不明です。写真をご確認いただき、ご理解いただける方のみご購入をお願いします。',
}

export const priorityLabels: Record<SellingPriority, string> = {
  fast: 'とにかく早く手放したい',
  normal: 'そこそこ売れればいい',
  high: '少し高めでも待てる',
  bundle: 'まとめ売りしたい',
  avoidLoss: '送料・手数料で損したくない',
}

export const priceMemos: Record<SellingPriority, string> = {
  fast: '早く手放したい場合は、相場より少し安めを意識し、数日売れなければさらに値下げする方針がおすすめです。',
  normal: '迷う場合は少し高めに出して、閲覧やいいねの反応を見ながら調整するのがおすすめです。',
  high: '少し高めでも待てる場合は、写真と説明文を丁寧にして、値下げを急がない方針がおすすめです。',
  bundle: '単品ではなく、関連する商品をまとめることで送料や出品作業の手間を減らせます。',
  avoidLoss: '送料・手数料で手取りが少なくなりそうな場合は、単品出品よりまとめ売りや処分も検討してください。',
}

export const valueLabels: Record<ValueJudgement, string> = {
  recommend: '出品おすすめ',
  bundleRecommended: 'まとめ売り推奨',
  needsCheck: '確認してから出品',
  maybeSkip: '出品しない選択肢もあり',
}

export const valueMessages: Record<ValueJudgement, string> = {
  recommend: 'この商品は、写真と説明文を整えれば出品しやすい商品です。',
  bundleRecommended: '単品だと手間が大きい可能性があります。まとめ売りがおすすめです。',
  needsCheck: 'この商品は、型番・動作確認・付属品の確認をした方が安全です。不明な場合は不明と明記して出品しましょう。',
  maybeSkip: '送料や梱包の手間を考えると、出品よりもまとめ売り・譲渡・処分の方が楽な可能性があります。',
}

export const accessoryOptions = [
  '本体のみ',
  '箱あり',
  '説明書あり',
  'ケーブルあり',
  '充電器あり',
  'パーツあり',
  '写真に写っているものがすべて',
  '付属品不明',
]

export const operationOptions = [
  '動作確認済み',
  '簡単な動作のみ確認済み',
  '動作未確認',
  '電池切れ・充電切れで未確認',
  'ジャンク扱い',
]
