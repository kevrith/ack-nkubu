import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Check, Church, BookOpen, Bell, Heart, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { BibleVersion } from '@/types/bible'

const BIBLE_VERSIONS: BibleVersion[] = ['NIV', 'NLT', 'KJV']

const VERSION_DESC: Record<BibleVersion, string> = {
  NIV: 'New International Version — clear, modern English',
  NLT: 'New Living Translation — easy to read and understand',
  KJV: 'King James Version — traditional, poetic language',
}

interface CellGroup {
  id: string
  name: string
}

interface Ministry {
  id: string
  name: string
  category: string
}

interface Step {
  icon: React.ReactNode
  title: string
  subtitle: string
}

const STEPS: Step[] = [
  { icon: <Church className="w-8 h-8" />,    title: 'Welcome to ACK St Francis', subtitle: 'Your digital parish home' },
  { icon: <BookOpen className="w-8 h-8" />,  title: 'Choose Your Bible',          subtitle: 'Pick a default reading version' },
  { icon: <Heart className="w-8 h-8" />,     title: 'Join Your Cell Group',        subtitle: 'Connect with your fellowship group' },
  { icon: <Briefcase className="w-8 h-8" />, title: 'Your Ministries',             subtitle: 'Which church ministries do you serve in?' },
  { icon: <Bell className="w-8 h-8" />,      title: 'Stay Connected',              subtitle: 'Get notified about important events' },
]

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>('NIV')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedMinistryIds, setSelectedMinistryIds] = useState<string[]>([])
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [saving, setSaving] = useState(false)
  const [cellGroups, setCellGroups] = useState<CellGroup[]>([])
  const [ministries, setMinistries] = useState<Ministry[]>([])

  useEffect(() => {
    supabase.from('cell_groups').select('id, name').eq('is_active', true).order('name')
      .then(({ data }) => setCellGroups(data || []))
    supabase.from('ministries').select('id, name, category').eq('is_active', true).order('category').order('name')
      .then(({ data }) => setMinistries(data || []))
  }, [])

  const isLast = step === STEPS.length - 1

  function toggleMinistry(id: string) {
    setSelectedMinistryIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  async function handleFinish() {
    if (!user) return
    setSaving(true)

    const selectedGroup = cellGroups.find(g => g.id === selectedGroupId)

    // 1. Update profile: bible version + cell_group name (for display)
    await supabase.from('profiles').update({
      preferred_bible_version: selectedVersion,
      cell_group: selectedGroup?.name || null,
    }).eq('id', user.id)

    // 2. Place into cell_group_members
    if (selectedGroupId) {
      // Avoid duplicate if they re-run onboarding
      const { data: existing } = await supabase
        .from('cell_group_members')
        .select('id')
        .eq('cell_group_id', selectedGroupId)
        .eq('member_id', user.id)
        .maybeSingle()

      if (!existing) {
        await supabase.from('cell_group_members').insert({
          cell_group_id: selectedGroupId,
          member_id: user.id,
          is_active: true,
        })
      }
    }

    // 3. Place into ministry_members for each selected ministry
    if (selectedMinistryIds.length > 0) {
      // Fetch existing to avoid duplicates
      const { data: existingMemberships } = await supabase
        .from('ministry_members')
        .select('ministry_id')
        .eq('member_id', user.id)
        .in('ministry_id', selectedMinistryIds)

      const alreadyIn = new Set(existingMemberships?.map(m => m.ministry_id) || [])
      const toInsert = selectedMinistryIds
        .filter(id => !alreadyIn.has(id))
        .map(id => ({ ministry_id: id, member_id: user.id, role: 'member', is_active: true }))

      if (toInsert.length > 0) {
        await supabase.from('ministry_members').insert(toInsert)
      }
    }

    // 4. Notifications
    if (notifEnabled && 'Notification' in window) {
      Notification.requestPermission()
    }

    localStorage.setItem(`onboarding_done_${user.id}`, '1')
    setSaving(false)
    onComplete()
  }

  function next() {
    if (isLast) handleFinish()
    else setStep(s => s + 1)
  }

  function back() {
    setStep(s => Math.max(0, s - 1))
  }

  const progress = ((step + 1) / STEPS.length) * 100

  // Group ministries by category for the ministry step
  const ministryByCategory = ministries.reduce<Record<string, Ministry[]>>((acc, m) => {
    const cat = m.category || 'General'
    acc[cat] = acc[cat] ? [...acc[cat], m] : [m]
    return acc
  }, {})

  return (
    <div className="fixed inset-0 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-8">
          {/* Dot indicators */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i < step ? 'bg-gold w-2' : i === step ? 'bg-navy w-5' : 'bg-gray-200 w-2'}`} />
              ))}
            </div>
          </div>

          {/* Icon + Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-navy/10 text-navy rounded-full mb-4">
              {STEPS[step].icon}
            </div>
            <h2 className="text-2xl font-playfair text-navy mb-1">{STEPS[step].title}</h2>
            <p className="text-gray-500 text-sm">{STEPS[step].subtitle}</p>
          </div>

          {/* Step content */}
          <div className="min-h-[200px] max-h-[340px] overflow-y-auto">

            {/* Step 0 — Welcome */}
            {step === 0 && (
              <div className="space-y-4 text-center">
                <p className="text-gray-700 leading-relaxed">
                  Welcome, <span className="font-semibold text-navy">{user?.profile.full_name.split(' ')[0]}</span>!
                  We're glad you're here. Let's take a moment to set up your profile.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: '📖', text: 'Read the Bible' },
                    { icon: '🙏', text: 'Daily Prayers' },
                    { icon: '🎵', text: 'Songs & Worship' },
                    { icon: '💝', text: 'Give via M-Pesa' },
                    { icon: '📅', text: 'Events Calendar' },
                    { icon: '🤝', text: 'Community Feed' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">{icon}</span>
                      <span className="text-gray-700 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Bible version */}
            {step === 1 && (
              <div className="space-y-2">
                {BIBLE_VERSIONS.map(v => (
                  <button key={v} onClick={() => setSelectedVersion(v)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedVersion === v ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-navy">{v}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{VERSION_DESC[v]}</p>
                      </div>
                      {selectedVersion === v && <Check className="w-5 h-5 text-navy flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2 — Cell group */}
            {step === 2 && (
              <div className="space-y-2">
                <button onClick={() => setSelectedGroupId('')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedGroupId === '' ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-300'}`}>
                  <span className="font-medium text-gray-500 italic">Not in a cell group yet</span>
                </button>
                {cellGroups.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Loading groups…</p>
                )}
                {cellGroups.map(g => (
                  <button key={g.id} onClick={() => setSelectedGroupId(g.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedGroupId === g.id ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{g.name}</span>
                      {selectedGroupId === g.id && <Check className="w-5 h-5 text-navy" />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3 — Ministries */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-gray-500">Select all that apply — you can change this later.</p>
                {ministries.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Loading ministries…</p>
                ) : (
                  Object.entries(ministryByCategory).map(([category, items]) => (
                    <div key={category}>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">{category}</p>
                      <div className="space-y-1.5">
                        {items.map(m => {
                          const selected = selectedMinistryIds.includes(m.id)
                          return (
                            <button key={m.id} onClick={() => toggleMinistry(m.id)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all flex items-center justify-between ${selected ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200'}`}>
                              <span className="font-medium text-gray-700 text-sm">{m.name}</span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'bg-navy border-navy' : 'border-gray-300'}`}>
                                {selected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))
                )}
                <button onClick={() => setSelectedMinistryIds([])}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border-2 transition-all ${selectedMinistryIds.length === 0 ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200'}`}>
                  <span className="font-medium text-gray-500 italic text-sm">Not serving in any ministry yet</span>
                </button>
              </div>
            )}

            {/* Step 4 — Notifications */}
            {step === 4 && (
              <div className="space-y-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Enable push notifications to receive alerts for new sermons, upcoming events,
                  urgent notices, and prayer updates — even when the app is closed.
                </p>
                <div onClick={() => setNotifEnabled(v => !v)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${notifEnabled ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <Bell className={`w-6 h-6 ${notifEnabled ? 'text-navy' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium text-gray-800">Push Notifications</p>
                      <p className="text-xs text-gray-500">Sermons, events & urgent notices</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-all relative ${notifEnabled ? 'bg-navy' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifEnabled ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">You can change this anytime in your Profile settings.</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <button onClick={back} disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-0 disabled:pointer-events-none">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button onClick={next} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white rounded-lg hover:bg-navy/90 font-medium text-sm disabled:opacity-60">
            {saving ? 'Setting up your account…' : isLast ? (
              <><Check className="w-4 h-4" /> Get Started</>
            ) : (
              <>Next <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
