import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <img src="/icon.svg" alt="" className="app-mark" />
          <div>
            <p className="eyebrow">メルカリ出品前のメモ作成ツール</p>
            <h1>ラク売り下書きメーカー</h1>
          </div>
        </div>
        <div className="app-header__status" aria-hidden="true">
          下書き
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}
