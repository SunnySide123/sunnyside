// Client-side API helpers — call our own Next.js API routes

import { supabase } from './supabase-client'

const BASE = ''

async function get(path: string) {
  const res = await fetch(BASE + path)
  if (!res.ok) return null
  return res.json()
}

async function post(path: string, body?: any) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
  if (!res.ok) return null
  return res.json()
}

async function put(path: string, body: any) {
  const res = await fetch(BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return null
  return res.json()
}

async function del(path: string) {
  await fetch(BASE + path, { method: 'DELETE' })
}

// Profile
export async function getProfile() { return get('/api/profile') }
export async function updateProfile(fields: { avatar_url?: string; signature?: string }) {
  return put('/api/profile', fields)
}

// Daily Photos
export async function getDailyPhotos(opts?: { days?: number; from?: string; to?: string }) {
  const params = new URLSearchParams()
  if (opts?.days) params.set('days', String(opts.days))
  if (opts?.from) params.set('from', opts.from)
  if (opts?.to) params.set('to', opts.to)
  const qs = params.toString()
  return get('/api/daily' + (qs ? '?' + qs : ''))
}
export async function addDailyPhoto(data: { image_url: string; date: string; city: string; note: string }) {
  return post('/api/daily', data)
}
export async function deleteDailyPhoto(id: string) { return del('/api/daily/' + id) }

// Cities
export async function getCities(opts?: { province?: string; litOnly?: boolean; sortBy?: string }) {
  const params = new URLSearchParams()
  if (opts?.province) params.set('province', opts.province)
  if (opts?.litOnly) params.set('litOnly', 'true')
  if (opts?.sortBy) params.set('sortBy', opts.sortBy)
  const qs = params.toString()
  return get('/api/cities' + (qs ? '?' + qs : ''))
}
export async function addCity(data: { name: string; province: string; arrival_date: string | null }) {
  return post('/api/cities', data)
}

// City Photos
export async function getCityPhotos(cityId: string) {
  return get(`/api/cities/${cityId}/photos`)
}
export async function addCityPhoto(cityId: string, data: { image_url: string; date: string; note: string }) {
  return post(`/api/cities/${cityId}/photos`, data)
}
export async function deleteCityPhoto(id: string) { return del('/api/city-photos/' + id) }

// Upload file directly to Supabase Storage (bypasses Vercel 4.5MB limit)
export async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('photos')
    .upload(fileName, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error.message)
    return ''
  }

  const { data } = supabase.storage.from('photos').getPublicUrl(fileName)
  return data.publicUrl
}
