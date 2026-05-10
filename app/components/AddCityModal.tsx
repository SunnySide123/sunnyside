'use client'

import { useState } from 'react'
import { addCity } from '@/lib/api'

const PROVINCES = [
  '直辖市', '浙江省', '云南省', '吉林省', '江苏省', '福建省', '河北省',
  '江西省', '山东省', '甘肃省', '广东省', '贵州省', '辽宁省', '内蒙古',
  '安徽省', '湖北省', '山西省', '四川省', '陕西省', '港澳台',
  '河南省', '湖南省', '广西', '海南省', '西藏', '新疆', '青海省', '宁夏', '黑龙江省',
]

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function AddCityModal({ onClose, onSuccess }: Props) {
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!province || !city) return alert('请填写省份和城市')
    setSubmitting(true)
    await addCity({ name: city, province, arrival_date: arrivalDate || null })
    setSubmitting(false)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
      <div className="bg-cream border border-cream-dark p-8 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl">点亮新城市</h2>
          <button onClick={onClose} className="text-charcoal-light hover:text-charcoal text-lg">&times;</button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-xs text-charcoal-light mb-2 tracking-wide">省份</label>
            <select value={province} onChange={(e) => setProvince(e.target.value)} className="input-minimal w-full bg-transparent">
              <option value="">选择省份</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-charcoal-light mb-2 tracking-wide">城市</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="输入城市名" className="input-minimal w-full" />
          </div>
          <div>
            <label className="block text-xs text-charcoal-light mb-2 tracking-wide">到达日期</label>
            <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} className="input-minimal w-full" />
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="btn-minimal w-full">
            {submitting ? '添加中...' : '确认点亮'}
          </button>
        </div>
      </div>
    </div>
  )
}
