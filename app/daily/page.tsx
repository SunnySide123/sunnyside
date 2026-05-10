'use client'

import { useState, useEffect, useCallback } from 'react'
import { getDailyPhotos, deleteDailyPhoto } from '@/lib/api'
import type { DailyPhoto } from '@/lib/types'
import PhotoCard from '../components/PhotoCard'
import UploadModal from '../components/UploadModal'

type Filter = '3' | '7' | '30' | 'custom'

export default function DailyPage() {
  const [photos, setPhotos] = useState<DailyPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('30')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [showUpload, setShowUpload] = useState(false)

  const loadPhotos = useCallback(async () => {
    setLoading(true)
    let data
    if (filter === 'custom') {
      data = await getDailyPhotos({ from: customFrom || undefined, to: customTo || undefined })
    } else {
      data = await getDailyPhotos({ days: parseInt(filter) })
    }
    setPhotos(data || [])
    setLoading(false)
  }, [filter, customFrom, customTo])

  useEffect(() => { loadPhotos() }, [loadPhotos])

  const handleDelete = async (id: string) => {
    await deleteDailyPhoto(id)
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const handleUploadSuccess = (results: { image_url: string; date: string; city: string; note: string }[]) => {
    setShowUpload(false)
    const newPhotos: DailyPhoto[] = results.map((r: any) => ({
      id: r.id || Date.now().toString(),
      image_url: r.image_url,
      date: r.date,
      city: r.city || '',
      note: r.note || '',
      created_at: new Date().toISOString(),
    }))
    setPhotos((prev) => [...newPhotos, ...prev])
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-center mb-10 tracking-wider text-charcoal-light">
        {'///// 日常 /////'}
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {(['3', '7', '30'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={'btn-minimal text-xs ' + (filter === f ? 'bg-charcoal text-cream' : '')}>
            近{f}天
          </button>
        ))}
        <button onClick={() => setFilter('custom')}
          className={'btn-minimal text-xs ' + (filter === 'custom' ? 'bg-charcoal text-cream' : '')}>
          自定义
        </button>
        {filter === 'custom' && (
          <div className="flex items-center gap-2">
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="input-minimal text-xs w-32" />
            <span className="text-xs text-charcoal-light">至</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="input-minimal text-xs w-32" />
          </div>
        )}
        <button onClick={() => setShowUpload(true)} className="btn-minimal text-xs ml-4">+ 上传</button>
      </div>
      {loading ? (
        <p className="text-center text-charcoal-light py-20">加载中...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-charcoal-light py-20">暂无照片，上传第一张吧</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onDelete={handleDelete} />
          ))}
        </div>
      )}
      {showUpload && (
        <UploadModal mode="daily" onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess} />
      )}
    </div>
  )
}
