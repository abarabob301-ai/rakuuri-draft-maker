import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  children: ReactNode
  tone?: 'normal' | 'notice' | 'success'
}

export function SectionCard({ title, children, tone = 'normal' }: SectionCardProps) {
  return (
    <section className={`section-card section-card--${tone}`}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
