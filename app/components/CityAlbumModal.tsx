'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCityPhotos, deleteCityPhoto } from '@/lib/api'
import type { CityPhoto, City } from '@/lib/types'
import UploadModal from './UploadModal'

interface Props {
  city: City
  onClose: () => void
}

export default function CityAlbumModal({ city, onClose }: Props) {
  const [photos, setPhotos] = useState<CityPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)

  const loadPhotos = useCallback(async () => {
    setLoading(true)
    const data = await getCityPhotos(city.id)
    setPhotos(data || [])
    setLoading(false)
  }, [city.id])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const handleDelete = async (id: string) => {
    await deleteCityPhoto(id)
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const handleUploadSuccess = (results: { image_url: string; date: string; city: string; note: string }[]) => {
    setShowUpload(false)
    // Add new photos directly to state to avoid any refetch issues
    const newPhotos: CityPhoto[] = results.map((r: any) => ({
      id: r.id || Date.now().toString(),
      city_id: city.id,
      image_url: r.image_url,
      date: r.date,
      note: r.note,
      created_at: new Date().toISOString(),
    }))
    setPhotos((prev) => [...newPhotos, ...prev])
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto modal-backdrop" onClick={onClose}>
      <div className="min-h-screen flex items-start justify-center py-8 px-4">
        <div className="bg-cream border border-cream-dark w-full max-w-4xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-cream border-b border-cream-dark px-8 py-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl">{city.name}  {city.province}</h2>
              {city.arrival_date && (
                <p className="text-xs text-charcoal-light mt-1">首次到达: {city.arrival_date}</p>
              )}
            </div>
            <button onClick={onClose} className="btn-minimal text-xs">关闭</button>
          </div>
          <div className="px-8 py-4 border-b border-cream-dark">
            <button onClick={() => setShowUpload(true)} className="btn-minimal text-xs">
              + 上传照片到{city.name}
            </button>
          </div>
          <div className="p-8">
            {loading ? (
              <p className="text-center text-charcoal-light py-12">加载中...</p>
            ) : photos.length === 0 ? (
              <p className="text-center text-charcoal-light py-12">暂无照片，上传第一张吧</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="photo-card bg-white border border-cream-dark overflow-hidden">
                    <div className="aspect-[4/3] overflow-hidden bg-cream-dark">
                      <img src={photo.image_url} alt={photo.note || city.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex items-start justify-between">
                      <div>
                        <p className="text-xs text-charcoal-light">{photo.date}</p>
                        {photo.note && <p className="text-sm mt-0.5">{photo.note}</p>}
                      </div>
                      <button onClick={() => handleDelete(photo.id)} className="text-xs text-charcoal-light hover:text-red-500">&times;</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showUpload && (
        <UploadModal mode="city" cityId={city.id} defaultCity={city.name}
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess} />
      )}
    </div>
  )
}
