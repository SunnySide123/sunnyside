'use client'

import { useState } from 'react'
import { uploadFile } from '@/lib/api'

const DEFAULT_AVATAR = 'https://lmvazzuggqdpelcucxhw.supabase.co/storage/v1/object/public/photos/avatar-default.png'

interface Props {
  avatarUrl: string | null
  onUpdate: (url: string) => void
}

export default function AvatarUpload({ avatarUrl, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file)
      if (url) await onUpdate(url)
      else alert('上传失败')
    } catch (err: any) {
      alert('上传失败: ' + (err.message || '未知错误'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="cursor-pointer group relative">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-cream-dark flex items-center justify-center">
          <img
            src={avatarUrl || DEFAULT_AVATAR}
            alt="头像"
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              if (img.src !== DEFAULT_AVATAR) {
                img.src = DEFAULT_AVATAR
              }
            }}
          />
        </div>
        <div className="absolute inset-0 rounded-full bg-charcoal/0 group-hover:bg-charcoal/10 transition-all flex items-center justify-center">
          <span className="text-xs text-charcoal opacity-0 group-hover:opacity-100 transition-opacity text-center leading-tight">
            {uploading ? '上传中...' : '点击更换'}
          </span>
        </div>
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
    </div>
  )
}
