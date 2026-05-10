import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const BUCKET = 'photos'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Detect HEIC by magic bytes at offset 4
    const magic = buffer.slice(4, 12).toString()
    const isHeic = magic === 'ftypheic' || magic.startsWith('ftyphei') || magic === 'ftypmif1'

    const ext = isHeic ? 'jpg' : (file.name.split('.').pop()?.toLowerCase() || 'jpg')
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    let uploadBuffer: Buffer

    if (isHeic) {
      try {
        const sharp = await import('sharp')
        uploadBuffer = await sharp.default(buffer).jpeg({ quality: 90 }).toBuffer()
      } catch {
        uploadBuffer = buffer
      }
    } else {
      uploadBuffer = buffer
    }

    const { error } = await getSupabase().storage
      .from(BUCKET)
      .upload(fileName, uploadBuffer, {
        contentType: isHeic ? 'image/jpeg' : file.type || 'image/jpeg',
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = getSupabase().storage.from(BUCKET).getPublicUrl(fileName)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
