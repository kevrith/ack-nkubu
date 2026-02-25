import { useState } from 'react'
import { User, Phone, Users, BookOpen, LogOut, Save, Camera, Gift } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { normalizeKenyanPhone } from '@/lib/utils'
import { BibleVersion } from '@/types/bible'
import { AVAILABLE_VERSIONS } from '@/services/bible.service'
import { MediaUploader } from '@/components/shared/MediaUploader'
import { Link } from 'react-router-dom'

const versionInfo: Record<BibleVersion, string> = {
  NIV: 'New International Version',
  NLT: 'New Living Translation',
  KJV: 'King James Version',
}

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const { setUser } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.profile.full_name || '')
  const [phone, setPhone] = useState(user?.profile.phone || '')
  const [cellGroup, setCellGroup] = useState(user?.profile.cell_group || '')
  const [preferredBibleVersion, setPreferredBibleVersion] = useState<BibleVersion>(() => {
    const saved = user?.profile.preferred_bible_version
    return AVAILABLE_VERSIONS.includes(saved as BibleVersion) ? (saved as BibleVersion) : 'NIV'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.profile.avatar_url || '')

  async function handleSave() {
    if (!user) return

    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: normalizeKenyanPhone(phone) || null,
        cell_group: cellGroup || null,
        preferred_bible_version: preferredBibleVersion,
        avatar_url: avatarUrl || null,
      })
      .eq('id', user.id)

    if (!error) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          full_name: fullName,
          phone: normalizeKenyanPhone(phone) || null,
          cell_group: cellGroup || null,
          preferred_bible_version: preferredBibleVersion,
          avatar_url: avatarUrl || null,
        },
      })
      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  async function handleSignOut() {
    await signOut()
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-playfair text-navy">My Profile</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          ✓ Profile updated successfully
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            {editing && (
              <button
                onClick={() => setShowUploader(!showUploader)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:bg-gold-600"
              >
                <Camera className="w-4 h-4 text-navy" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-navy">{user.profile.full_name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-navy-50 text-navy text-xs rounded">
              {user.profile.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {showUploader && editing && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <MediaUploader accept="image/*" resourceType="image" onUploadComplete={(url) => { setAvatarUrl(url); setShowUploader(false); }} />
          </div>
        )}

        <div className="border-t pt-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!editing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!editing}
              placeholder="0712345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent disabled:bg-gray-50"
            />
            {editing && phone && normalizeKenyanPhone(phone) && (
              <p className="text-xs text-green-600 mt-1">✓ {normalizeKenyanPhone(phone)}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4" />
              Cell Group
            </label>
            <input
              type="text"
              value={cellGroup}
              onChange={(e) => setCellGroup(e.target.value)}
              disabled={!editing}
              placeholder="e.g., Westlands Cell Group"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4" />
              Preferred Bible Version
            </label>
            <select
              value={preferredBibleVersion}
              onChange={(e) => setPreferredBibleVersion(e.target.value as BibleVersion)}
              disabled={!editing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent disabled:bg-gray-50"
            >
              {AVAILABLE_VERSIONS.map((version) => (
                <option key={version} value={version}>
                  {version} - {versionInfo[version]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t pt-6 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-navy mb-4">Invite Friends</h3>
        <p className="text-gray-600 mb-4">Share your faith community and earn rewards</p>
        <Link
          to="/referrals"
          className="flex items-center gap-2 px-6 py-2 bg-gold text-navy rounded-lg hover:bg-gold-600 font-medium w-fit"
        >
          <Gift className="w-4 h-4" />
          View Referral Program
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-navy mb-4">Account Actions</h3>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
