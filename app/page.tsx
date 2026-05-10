'use client'

import { useState, useEffect } from 'react'
import { getProfile, updateProfile } from '@/lib/api'
import type { Profile } from '@/lib/types'
import AvatarUpload from './components/AvatarUpload'
import SignatureEdit from './components/SignatureEdit'

export default function HomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile().then((data) => { setProfile(data); setLoading(false) })
  }, [])

  const handleAvatarUpdate = async (url: string) => {
    await updateProfile({ avatar_url: url })
    setProfile((prev) => prev ? { ...prev, avatar_url: url } : null)
  }

  const handleSignatureSave = async (text: string) => {
    await updateProfile({ signature: text })
    setProfile((prev) => prev ? { ...prev, signature: text } : null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-charcoal-light">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-24">
      <div className="text-center space-y-12 max-w-lg mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif tracking-wider text-charcoal-light">
          {'///// 主页 /////'}
        </h1>
        <AvatarUpload avatarUrl={profile?.avatar_url || null} onUpdate={handleAvatarUpdate} />
        <SignatureEdit
          signature={profile?.signature || '用理性写代码，用感性看世界。'}
          onSave={handleSignatureSave}
        />
      </div>
    </div>
  )
}
