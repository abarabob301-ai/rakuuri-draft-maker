import type { CategoryConfig, CategoryId } from '../types/draft'

const commonPackaging =
  '傷や破損を防ぐため、必要に応じて緩衝材や袋を使ってください。'

export const categories: CategoryConfig[] = [
  {
    id: 'clothes',
    label: '服',
    researchLevel: 'low',
    researchMessage:
      '詳しい商品名がわからなくても出品しやすいカテゴリです。ブランド、サイズ、色、状態がわかれば十分に下書きを作れます。',
    checkPoints: ['ブランドタグ', 'サイズタグ', '色', '汚れや毛玉', '使用感'],
    photoChecklist: ['全体', 'ブランドタグ', 'サイズタグ', '汚れや傷がある部分', '生地感がわかる写真'],
    defaultPackagingMemo:
      '折りたたんでOPP袋やビニール袋に入れ、封筒または宅配袋で発送する想定です。',
    priceAdvice: '状態が伝わる写真を用意すると、迷っている人にも伝わりやすくなります。',
    safetyWarnings: ['ブランド名やサイズが不明な場合は、不明として説明文に入れましょう。'],
    titleParts: ['brand', 'roughName', 'color', 'size'],
  },
  {
    id: 'kidsClothes',
    label: '子ども服',
    researchLevel: 'low',
    researchMessage:
      'サイズと枚数がわかれば進めやすいカテゴリです。記名や汚れは写真と説明文で伝えると安心です。',
    checkPoints: ['サイズ', '枚数', '記名の有無', '汚れ', '季節感'],
    photoChecklist: ['全体', 'サイズタグ', '枚数がわかる写真', '汚れや記名部分', 'ブランドタグ'],
    defaultPackagingMemo:
      '折りたたんで防水用の袋に入れ、封筒または宅配袋で発送する想定です。',
    priceAdvice: '単品よりまとめ売りにすると、送料や出品作業の手間を減らしやすいです。',
    safetyWarnings: ['記名や汚れがある場合は、見落としがないよう写真にも残しましょう。'],
    titleParts: ['roughName', 'size', 'bundle', 'quantity'],
  },
  {
    id: 'books',
    label: '本・漫画',
    researchLevel: 'medium',
    researchMessage:
      'タイトルや巻数がわかると安心です。不明でも出品はできますが、日焼けや書き込みは写真で見せましょう。',
    checkPoints: ['タイトル', '巻数', '日焼け', '折れ', '書き込み', '帯や特典の有無'],
    photoChecklist: ['表紙', '裏表紙', '背表紙', '日焼け部分', '傷や汚れ部分', '巻数がわかる写真'],
    defaultPackagingMemo:
      '水濡れ対策をして、封筒や段ボールで発送する想定です。角折れが心配な場合は厚紙を添えると安心です。',
    priceAdvice: '巻数や状態がわかる写真を多めにすると、購入前の確認が減らせます。',
    safetyWarnings: ['書き込みや日焼けがある場合は、説明文に入れておきましょう。'],
    titleParts: ['roughName', 'quantity', 'bundle'],
  },
  {
    id: 'toys',
    label: 'おもちゃ',
    researchLevel: 'medium',
    researchMessage:
      'メーカー、シリーズ名、パーツ欠品、動作確認をできる範囲で見ましょう。わからない点は不明と書けます。',
    checkPoints: ['メーカー', 'シリーズ名', 'パーツ欠品', '動作確認', '対象年齢', '汚れ'],
    photoChecklist: ['全体', 'パーツ一覧', 'メーカー名やロゴ', '傷や汚れ', '動作する場合は動作確認写真'],
    defaultPackagingMemo: commonPackaging,
    priceAdvice: 'パーツが多いものは、写真に写っているものをすべて並べると伝わりやすいです。',
    safetyWarnings: ['小さなパーツの欠品が不明な場合は、不明として説明文に入れましょう。'],
    titleParts: ['brand', 'roughName', 'quantity'],
  },
  {
    id: 'appliances',
    label: '家電',
    researchLevel: 'high',
    researchMessage:
      '型番・動作確認・付属品の有無で価格やトラブルリスクが変わりやすいカテゴリです。本体裏、底面、箱、説明書に型番がないか確認しましょう。',
    checkPoints: ['型番', '年式', '動作確認', '付属品', '説明書', '箱', '傷や汚れ'],
    photoChecklist: ['本体全体', '型番ラベル', '付属品', '電源が入っている写真', '傷や汚れ部分'],
    defaultPackagingMemo:
      '緩衝材で包み、動かないように段ボールに入れる想定です。付属品はまとめて写真に写しておくと安心です。',
    priceAdvice: '型番と動作状況が確認できるほど、購入前の不安を減らせます。',
    safetyWarnings: ['型番不明や動作未確認の場合は、必ず説明文に入れましょう。'],
    titleParts: ['brand', 'modelNumber', 'roughName', 'accessories'],
  },
  {
    id: 'gadgets',
    label: 'ガジェット・PC周辺機器',
    researchLevel: 'high',
    researchMessage:
      '型番、接続方式、動作確認、バッテリー状態の確認がおすすめです。高額品やブランド品は断定しないようにしましょう。',
    checkPoints: ['型番', '接続方式', '動作確認', '付属品', 'バッテリー状態', '傷'],
    photoChecklist: ['本体全体', '型番ラベル', '端子部分', '付属品', '動作確認画面'],
    defaultPackagingMemo:
      '緩衝材で包み、端子や画面に傷がつかないようにして発送する想定です。',
    priceAdvice: '型番、端子、付属品が写真でわかると検討しやすくなります。',
    safetyWarnings: ['動作未確認の場合は、ジャンク扱いも検討してください。'],
    titleParts: ['brand', 'modelNumber', 'roughName', 'accessories'],
  },
  {
    id: 'bags',
    label: 'バッグ',
    researchLevel: 'medium',
    researchMessage:
      'ブランド、サイズ感、内側の汚れ、角スレ、持ち手の状態を確認できると安心です。',
    checkPoints: ['ブランド', 'サイズ感', '内側の汚れ', '角スレ', '持ち手の状態', '付属品'],
    photoChecklist: ['外観', '内側', '持ち手', '角', 'ブランドタグ', '汚れや傷'],
    defaultPackagingMemo:
      '型崩れを抑えつつ、防水用の袋や緩衝材を使って発送する想定です。',
    priceAdvice: '角や内側の状態がわかる写真があると、購入後の認識違いを減らせます。',
    safetyWarnings: ['ブランド品は真贋を断定せず、写真で確認してもらう表現にしましょう。'],
    titleParts: ['brand', 'roughName', 'color', 'size'],
  },
  {
    id: 'shoes',
    label: '靴',
    researchLevel: 'medium',
    researchMessage:
      'サイズ、ブランド、ソールの減り、汚れ、箱の有無を確認しましょう。状態写真が大事です。',
    checkPoints: ['サイズ', 'ブランド', 'ソールの減り', '汚れ', '箱の有無'],
    photoChecklist: ['両足全体', 'サイズ表記', 'ソール', 'かかと', '汚れや傷'],
    defaultPackagingMemo:
      '汚れ移りを防ぐため袋に入れ、箱または段ボールで発送する想定です。',
    priceAdvice: 'ソールとかかとの写真を入れると、使用感が伝わりやすくなります。',
    safetyWarnings: ['サイズ表記が不明な場合は、不明として説明文に入れましょう。'],
    titleParts: ['brand', 'roughName', 'color', 'size'],
  },
  {
    id: 'tableware',
    label: '食器',
    researchLevel: 'low',
    researchMessage:
      '個数、サイズ、欠けやヒビの有無がわかれば進めやすいカテゴリです。割れ物なので梱包は丁寧にしましょう。',
    checkPoints: ['個数', 'サイズ', '欠け', 'ヒビ', 'ブランド', '使用感'],
    photoChecklist: ['全体', '個数がわかる写真', '裏面', '欠けやヒビがある部分', 'ブランド刻印があればその部分'],
    defaultPackagingMemo:
      '割れ物のため、緩衝材でしっかり包み、箱の中で動かないようにしてください。',
    priceAdvice: '欠けやヒビがないか、光を当てて見える写真を入れると安心です。',
    safetyWarnings: ['欠けやヒビがある場合は、必ず説明文に入れましょう。'],
    titleParts: ['brand', 'roughName', 'quantity', 'size'],
  },
  {
    id: 'misc',
    label: '雑貨',
    researchLevel: 'low',
    researchMessage:
      '詳しい商品名がわからなくても、サイズ・個数・用途・状態が伝われば出品しやすいカテゴリです。',
    checkPoints: ['サイズ', '個数', '使用感', '傷や汚れ', '用途'],
    photoChecklist: ['全体', 'サイズ感がわかる写真', '傷や汚れ', '裏面や底面', '付属品'],
    defaultPackagingMemo: commonPackaging,
    priceAdvice: '単価が低そうなものは、まとめ売りにすると手間を減らせます。',
    safetyWarnings: ['用途が不明なものは、わかる範囲の説明に留めましょう。'],
    titleParts: ['roughName', 'color', 'size', 'quantity'],
  },
  {
    id: 'other',
    label: 'その他',
    researchLevel: 'medium',
    researchMessage:
      'サイズ、状態、付属品、使い方がわかると安心です。不明な点は不明として下書きに入れましょう。',
    checkPoints: ['サイズ', '用途', '状態', '付属品', '傷や汚れ', '型番やメーカー名'],
    photoChecklist: ['全体', 'サイズ感がわかる写真', '傷や汚れ', '裏面や底面', '付属品'],
    defaultPackagingMemo: commonPackaging,
    priceAdvice: '説明しづらいものほど、写真を多めに用意すると伝わりやすくなります。',
    safetyWarnings: ['高額品やブランド品は断定せず、写真で確認してもらう表現にしましょう。'],
    titleParts: ['brand', 'roughName', 'color', 'size', 'quantity'],
  },
]

export const getCategory = (categoryId: CategoryId) =>
  categories.find((category) => category.id === categoryId) ?? categories[0]

export const needsOperationCheck = (categoryId: CategoryId) =>
  ['appliances', 'gadgets', 'toys'].includes(categoryId)
