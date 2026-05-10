import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await getSupabase().from('cities').delete().eq('id', params.id)
  return NextResponse.json({ success: true })
}
