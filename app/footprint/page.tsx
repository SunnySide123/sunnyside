'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCities } from '@/lib/api'
import type { City } from '@/lib/types'
import ChinaMap from '../components/ChinaMap'
import AddCityModal from '../components/AddCityModal'
import CityAlbumModal from '../components/CityAlbumModal'

const PROVINCE_TOTALS: Record<string, number> = {
  '直辖市': 4, '浙江省': 11, '云南省': 16, '吉林省': 9, '江苏省': 13,
  '福建省': 9, '河北省': 11, '江西省': 11, '山东省': 16, '甘肃省': 14,
  '广东省': 21, '贵州省': 9, '辽宁省': 14, '内蒙古': 12,
  '安徽省': 16, '湖北省': 17, '山西省': 11, '四川省': 21, '陕西省': 10,
  '港澳台': 3, '河南省': 17, '湖南省': 14, '广西': 14, '海南省': 4,
  '西藏': 7, '新疆': 14, '青海省': 8, '宁夏': 5, '黑龙江省': 13,
}

export default function FootprintPage() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [provinceFilter, setProvinceFilter] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')
  const [litOnly, setLitOnly] = useState(true)
  const [showAddCity, setShowAddCity] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [expanded, setExpanded] = useState(true)

  const loadCities = useCallback(async () => {
    setLoading(true)
    const data = await getCities({ province: provinceFilter || undefined, litOnly, sortBy })
    setCities(data || [])
    setLoading(false)
  }, [provinceFilter, sortBy, litOnly])

  useEffect(() => { loadCities() }, [loadCities])

  const grouped = cities.reduce((acc: Record<string, City[]>, city) => {
    if (!acc[city.province]) acc[city.province] = []
    acc[city.province].push(city)
    return acc
  }, {})

  const totalLit = cities.filter((c) => c.is_lit).length
  const totalProvinces = Object.keys(grouped).length
  const fullProvinces = Object.entries(PROVINCE_TOTALS)
    .filter(([prov, total]) => (grouped[prov] || []).filter((c) => c.is_lit).length >= total)
    .map(([prov]) => prov)

  const displayProvinces = expanded
    ? Object.entries(grouped)
    : Object.entries(grouped).slice(0, 5)

  const handleCityClick = (cityName: string) => {
    const city = cities.find((c) => c.name === cityName)
    if (city) setSelectedCity(city)
  }

  const sortedProvinceNames = Object.keys(PROVINCE_TOTALS)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl text-center mb-6 tracking-wider text-charcoal-light">
        {'///// 足迹 /////'}
      </h1>

      <div className="text-center mb-8">
        <p className="text-charcoal">
          已点亮 <span className="font-serif text-2xl">{totalLit}</span> 城
          {' | '}覆盖 <span className="font-serif text-2xl">{totalProvinces}</span> 省/地区
          {fullProvinces.filter((p) => !['直辖市', '港澳台'].includes(p)).length > 0 && (
            <span className="text-warm">
              {' | '}{fullProvinces.filter((p) => !['直辖市', '港澳台'].includes(p)).join('、')} 全点亮
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <select value={provinceFilter} onChange={(e) => setProvinceFilter(e.target.value)}
          className="input-minimal bg-transparent text-xs">
          <option value="">按省份筛选</option>
          {sortedProvinceNames.map((p) => (
            <option key={p} value={p}>{p} ({(grouped[p] || []).filter((c) => c.is_lit).length}/{PROVINCE_TOTALS[p]})</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
          className="input-minimal bg-transparent text-xs">
          <option value="date">按时间排序</option>
          <option value="name">按名称排序</option>
        </select>
        <button onClick={() => setLitOnly(!litOnly)}
          className={'btn-minimal text-xs ' + (litOnly ? 'bg-charcoal text-cream' : '')}>
          {litOnly ? '仅看已点亮' : '显示全部'}
        </button>
        <button onClick={() => setShowAddCity(true)} className="btn-minimal text-xs ml-2">
          + 点亮新城市
        </button>
      </div>

      {loading ? (
        <p className="text-center text-charcoal-light py-20">加载中...</p>
      ) : (
        <div className="space-y-6 mb-12">
          {displayProvinces.map(([province, provinceCities]) => {
            const total = PROVINCE_TOTALS[province] || provinceCities.length
            const lit = provinceCities.filter((c) => c.is_lit).length
            const isFull = lit >= total
            return (
              <div key={province} className="border border-cream-dark p-5">
                <h3 className="text-sm font-medium mb-3 tracking-wide">
                  {province} {lit}/{total}
                  {isFull && <span className="text-warm ml-2">&starf;全点亮</span>}
                </h3>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {provinceCities
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map((city) => (
                      <button key={city.id} onClick={() => setSelectedCity(city)}
                        className="text-sm text-charcoal-light hover:text-charcoal transition-colors cursor-pointer">
                        {city.name}{city.arrival_date ? '(' + city.arrival_date.slice(0, 7) + ')' : ''}
                      </button>
                    ))}
                </div>
              </div>
            )
          })}
          {Object.keys(grouped).length > 5 && (
            <button onClick={() => setExpanded(!expanded)} className="btn-minimal text-xs mx-auto block">
              {expanded ? '收起完整列表' : '展开完整列表'}
            </button>
          )}
        </div>
      )}

      <div className="mt-12 border border-cream-dark p-4">
        <div className="flex items-center justify-center gap-6 mb-4 text-xs text-charcoal-light">
          <span><span className="inline-block w-3 h-3 rounded-full bg-warm mr-1"></span> 已点亮 {totalLit}城</span>
          <span><span className="inline-block w-3 h-3 rounded-full border border-warm mr-1"></span> 未点亮</span>
          <span><span className="text-warm">&starf;</span> 全省点亮</span>
        </div>
        <ChinaMap cities={cities} fullProvinces={fullProvinces} onCityClick={handleCityClick} />
      </div>

      {showAddCity && (
        <AddCityModal onClose={() => setShowAddCity(false)}
          onSuccess={() => { setShowAddCity(false); loadCities() }} />
      )}
      {selectedCity && (
        <CityAlbumModal city={selectedCity} onClose={() => setSelectedCity(null)} />
      )}
    </div>
  )
}
