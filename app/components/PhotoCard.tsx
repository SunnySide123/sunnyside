'use client'

import type { DailyPhoto } from '@/lib/types'

interface Props {
  photo: DailyPhoto
  onDelete: (id: string) => void
}

export default function PhotoCard({ photo, onDelete }: Props) {
  return (
    <div className="photo-card bg-white border border-cream-dark overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-cream-dark">
        <img src={photo.image_url} alt={photo.note || photo.city} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-charcoal-light">{photo.date}</p>
            <p className="text-sm font-medium mt-0.5">{photo.city || '未知城市'}</p>
            {photo.note && <p className="text-xs text-charcoal-light mt-1">{photo.note}</p>}
          </div>
          <button
            onClick={() => onDelete(photo.id)}
            className="text-xs text-charcoal-light hover:text-red-500 transition-colors shrink-0"
            title="删除"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  )
}
