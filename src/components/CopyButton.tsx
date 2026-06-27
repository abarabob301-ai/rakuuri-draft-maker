import { useState } from 'react'
import { copyText } from '../utils/copy'

interface CopyButtonProps {
  label: string
  text: string
}

export function CopyButton({ label, text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button type="button" className="button button--secondary" onClick={handleCopy} aria-label={label}>
      {copied ? 'コピーしました' : label}
    </button>
  )
}
