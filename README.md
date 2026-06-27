# ラク売り下書きメーカー

メルカリ出品前の面倒を減らす、無料運用前提のPWAです。商品名があいまいでも、カテゴリ・状態・付属品・不明点を入力すると、出品タイトル、説明文、写真チェックリスト、価格方針、梱包メモをルールベースで生成します。

公開URL: https://rakuuri-draft-maker.vercel.app

## 主な機能

- カテゴリ別フォームで、商品情報を整理
- リサーチメモから商品名・価格帯・注意点を整理
- PCでは入力フォームとライブプレビューを2ペイン表示
- 生成した下書きを端末内に保存
- PWAとしてホーム画面追加に対応

## 起動方法

```bash
npm install
npm run dev
```

## 確認

```bash
npm run build
```

## 方針

- 外部AI API、外部DB、認証、メルカリ自動化は使いません。
- 下書きは `localStorage` の `rakuuri_listing_drafts_v2` に保存します。
- PWAは `vite-plugin-pwa` で構成しています。
