export interface Profile {
  id: string
  avatar_url: string | null
  signature: string
  updated_at: string
}

export interface DailyPhoto {
  id: string
  image_url: string
  date: string
  city: string
  note: string
  created_at: string
}

export interface City {
  id: string
  name: string
  province: string
  arrival_date: string | null
  is_lit: boolean
  created_at: string
}

export interface CityPhoto {
  id: string
  city_id: string
  image_url: string
  date: string
  note: string
  created_at: string
}

export interface ProvinceGroup {
  province: string
  total: number
  lit: number
  cities: City[]
}

export interface FootprintStats {
  totalCities: number
  totalProvinces: number
  fullProvinces: { name: string; lit: number; total: number }[]
}
