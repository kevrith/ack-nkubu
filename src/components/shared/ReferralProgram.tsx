import { useState, useEffect } from 'react'
import { Users, Copy, Check, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { shareViaWhatsApp } from '@/lib/whatsapp'

export function ReferralProgram() {
  const { user } = useAuth()
  const [referralCode, setReferralCode] = useState('')
  const [referrals, setReferrals] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadReferralData()
  }, [user])

  async function loadReferralData() {
    if (!user) return
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single()
      
      if (profile) setReferralCode(profile.referral_code)

      // Simple query without joins
      const { data, error: refError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })
      
      if (refError) {
        console.error('Referrals error:', refError)
        setError('Could not load referrals. Please try again later.')
      } else {
        // Fetch referred user details separately
        if (data && data.length > 0) {
          const referredIds = data.map(r => r.referred_id)
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', referredIds)
          
          const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
          const enrichedData = data.map(r => ({
            ...r,
            referred: profileMap.get(r.referred_id)
          }))
          setReferrals(enrichedData)
        } else {
          setReferrals([])
        }
      }
    } catch (err) {
      console.error('Error loading referrals:', err)
      setError('Failed to load referrals. Please refresh the page.')
    }
  }

  const referralLink = `${window.location.origin}/register?ref=${referralCode}`

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareLink() {
    shareViaWhatsApp(
      `Join ACK St Francis Nkubu Parish! 🙏\n\nUse my referral link to register:`,
      referralLink
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-navy to-navy-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-semibold">Invite Friends</h2>
            <p className="text-navy-100 text-sm">Share your faith community</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-navy-100 mb-2">Your Referral Code</p>
          <p className="text-2xl font-bold tracking-wider">{referralCode}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-navy px-4 py-3 rounded-lg hover:bg-gray-100 font-medium"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={shareLink}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share via WhatsApp
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-navy mb-4">
          Your Referrals ({referrals.length})
        </h3>
        {referrals.length > 0 ? (
          <div className="space-y-3">
            {referrals.map(ref => (
              <div key={ref.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                  {ref.referred?.full_name?.[0] || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{ref.referred?.full_name || 'New Member'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(ref.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  ref.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {ref.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No referrals yet. Start inviting friends!</p>
        )}
      </div>
    </div>
  )
}
