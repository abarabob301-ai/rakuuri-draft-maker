import type { ListingStatus } from '../types/draft'

const statusLabels: Record<ListingStatus, string> = {
  researching: 'リサーチ中',
  draftReady: '下書き作成済み',
  listed: '出品済み',
  onHold: '保留',
  skipped: '出品しない',
}

interface StatusBadgeProps {
  status: ListingStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{statusLabels[status]}</span>
}
