'use client'

import { useState } from 'react'
import { uploadFile, addDailyPhoto, addCityPhoto } from '@/lib/api'

interface Props {
  onClose: () => void
  onSuccess: (results: { image_url: string; date: string; city: string; note: string }[]) => void
  defaultCity?: string
  mode: 'daily' | 'city'
  cityId?: string
}

export default function UploadModal({ onClose, onSuccess, defaultCity, mode, cityId }: Props) {
  const [files, setFiles] = useState<File[]>([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [city, setCity] = useState(defaultCity || '')
  const [note, setNote] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')

  const handleSubmit = async () => {
    if (files.length === 0) return alert('请选择文件')
    setUploading(true)

    const results: { image_url: string; date: string; city: string; note: string }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(`${i + 1}/${files.length}`)

      try {
        const imageUrl = await uploadFile(file)
        if (!imageUrl) {
          alert(`第 ${i + 1} 张上传失败`)
          continue
        }

        if (mode === 'daily') {
          const saved = await addDailyPhoto({ image_url: imageUrl, date, city, note })
          if (saved) results.push(saved)
        } else if (cityId) {
          const saved = await addCityPhoto(cityId, { image_url: imageUrl, date, note })
          if (saved) results.push(saved)
        }
      } catch (err) {
        alert(`上传出错: ${err}`)
      }
    }

    setUploading(false)
    onSuccess(results)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
      <div className="bg-cream border border-cream-dark p-8 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl">上传照片</h2>
          <button onClick={onClose} className="text-charcoal-light hover:text-charcoal text-lg">&times;</button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-charcoal-light mb-2 tracking-wide">
              选择文件 (可多选)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="text-sm"
            />
            {files.length > 0 && (
              <p className="text-xs text-charcoal-light mt-1">已选择 {files.length} 个文件</p>
            )}
          </div>
          <div>
            <label className="block text-xs text-charcoal-light mb-2 tracking-wide">日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-minimal w-full" />
          </div>
          <div>
            <label className="block text-xs text-charcoal-light mb-2 tracking-wide">城市</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="输入城市名" className="input-minimal w-full" />
          </div>
          <div>
            <label className="block text-xs text-charcoal-light mb-2 tracking-wide">备注 (可选)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="一句话描述" className="input-minimal w-full" />
          </div>
          <button onClick={handleSubmit} disabled={uploading} className="btn-minimal w-full">
            {uploading ? `上传中... ${progress}` : '确认上传'}
          </button>
        </div>
      </div>
    </div>
  )
}
