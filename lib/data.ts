import { supabase } from './supabase'
import type { Profile, DailyPhoto, City, CityPhoto } from './types'

// Profile
export async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').limit(1).single()
  return data
}

export async function updateProfile(fields: Partial<Profile>) {
  const { data: existing } = await supabase.from('profiles').select('id').limit(1).single()
  if (existing) {
    return supabase.from('profiles').update(fields).eq('id', existing.id)
  }
  return supabase.from('profiles').insert({ ...fields, id: 'default' }).select()
}

// Daily Photos
export async function getDailyPhotos(days?: number, dateFrom?: string, dateTo?: string) {
  let query = supabase.from('daily_photos').select('*').order('date', { ascending: false })

  if (days) {
    const since = new Date()
    since.setDate(since.getDate() - days)
    query = query.gte('date', since.toISOString().split('T')[0])
  }
  if (dateFrom) query = query.gte('date', dateFrom)
  if (dateTo) query = query.lte('date', dateTo)

  const { data } = await query
  return data as DailyPhoto[]
}

export async function addDailyPhoto(photo: Omit<DailyPhoto, 'id' | 'created_at'>) {
  const { data } = await supabase.from('daily_photos').insert(photo).select()
  return data
}

export async function deleteDailyPhoto(id: string) {
  return supabase.from('daily_photos').delete().eq('id', id)
}

// Cities
export async function getCities(province?: string, litOnly?: boolean): Promise<City[]> {
  let query = supabase.from('cities').select('*').order('arrival_date', { ascending: false })
  if (province) query = query.eq('province', province)
  if (litOnly) query = query.eq('is_lit', true)
  const { data } = await query
  return data || []
}

export async function addCity(city: Omit<City, 'id' | 'created_at'>) {
  const { data } = await supabase.from('cities').insert(city).select()
  return data
}

export async function updateCity(id: string, fields: Partial<City>) {
  return supabase.from('cities').update(fields).eq('id', id)
}

export async function deleteCity(id: string) {
  return supabase.from('cities').delete().eq('id', id)
}

// City Photos
export async function getCityPhotos(cityId: string): Promise<CityPhoto[]> {
  const { data } = await supabase
    .from('city_photos')
    .select('*')
    .eq('city_id', cityId)
    .order('date', { ascending: false })
  return data || []
}

export async function addCityPhoto(photo: Omit<CityPhoto, 'id' | 'created_at'>) {
  const { data } = await supabase.from('city_photos').insert(photo).select()
  return data
}

export async function deleteCityPhoto(id: string) {
  return supabase.from('city_photos').delete().eq('id', id)
}

// File upload
export async function uploadFile(file: File, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}
