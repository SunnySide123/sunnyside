import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const BUCKET = 'photos'

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true })
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Detect HEIC by magic bytes at offset 4
  const magic = buffer.slice(4, 12).toString()
  const isHeic = magic === 'ftypheic' || magic.startsWith('ftyphei') || magic === 'ftypmif1'

  await ensureBucket()

  const ext = isHeic ? 'jpg' : (file.name.split('.').pop()?.toLowerCase() || 'jpg')
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  let uploadBuffer: Buffer

  if (isHeic) {
    try {
      const sharp = await import('sharp')
      uploadBuffer = await sharp.default(buffer).jpeg({ quality: 90 }).toBuffer()
    } catch {
      // HEIC conversion not supported, save original
      uploadBuffer = buffer
    }
  } else {
    uploadBuffer = buffer
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, uploadBuffer, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

  return NextResponse.json({ url: urlData.publicUrl })
}
