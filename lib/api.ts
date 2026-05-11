// Client-side API helpers

import { getSupabaseClient } from './supabase-client'

const BASE = ''

async function get(path: string) {
  const res = await fetch(BASE + path)
  if (!res.ok) return null
  return res.json()
}

async function post(path: string, body?: any) {
  const opts: RequestInit = {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  }
  if (!(body instanceof FormData)) {
    opts.headers = { 'Content-Type': 'application/json' }
  }
  const res = await fetch(BASE + path, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

async function put(path: string, body: any) {
  const res = await fetch(BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
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

// Upload file — compress on client, upload directly to Supabase Storage
async function compressImage(file: File, maxSize = 2048, quality = 0.85): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file
  if (file.size < 500 * 1024) return file

  // HEIC can't be decoded by createImageBitmap in Chrome/Firefox — let server convert it
  const name = file.name.toLowerCase()
  if (name.endsWith('.heic') || name.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif') {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    let { width, height } = bitmap
    if (width <= maxSize && height <= maxSize) {
      bitmap.close()
      return file
    }

    const ratio = Math.min(maxSize / width, maxSize / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality)
    )

    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export async function uploadFile(file: File): Promise<string> {
  const compressed = await compressImage(file)

  const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') ||
                 file.type === 'image/heic' || file.type === 'image/heif'
  const isPng = file.type === 'image/png' && !isHeic

  // Determine extension and content type from the ACTUAL file content
  // compressImage converts non-HEIC images to JPEG; HEIC stays as-is
  const ext = isHeic ? 'heic' : (isPng && compressed === file ? 'png' : 'jpg')
  const contentType = isHeic ? 'image/heic' : (ext === 'png' ? 'image/png' : 'image/jpeg')
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const supabase = getSupabaseClient()
  const { error } = await supabase.storage
    .from('photos')
    .upload(fileName, compressed, {
      contentType,
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error.message)
    throw new Error(error.message)
  }

  const { data } = getSupabaseClient().storage.from('photos').getPublicUrl(fileName)
  return data.publicUrl
}
