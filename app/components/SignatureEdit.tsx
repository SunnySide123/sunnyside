'use client'

import { useState } from 'react'

interface Props {
  signature: string
  onSave: (text: string) => void
}

export default function SignatureEdit({ signature, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(signature)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(text)
      setEditing(false)
    } catch (err: any) {
      alert('保存失败: ' + (err.message || '未知错误'))
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-3 justify-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-minimal text-center text-lg italic font-serif min-w-[280px]"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave} disabled={saving} className="btn-minimal text-xs px-3 py-1">{saving ? '保存中...' : '保存'}</button>
        <button onClick={() => { setText(signature); setEditing(false) }} className="text-xs text-charcoal-light hover:text-charcoal">取消</button>
      </div>
    )
  }

  return (
    <p
      className="text-lg italic font-serif text-charcoal-light cursor-pointer hover:text-charcoal transition-colors"
      onClick={() => setEditing(true)}
      title="点击编辑个性签名"
    >
      &ldquo;{signature}&rdquo;
    </p>
  )
}
