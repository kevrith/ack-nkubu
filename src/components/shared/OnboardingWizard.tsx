import { useState, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Check, Church, BookOpen, Bell, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { BibleVersion } from '@/types/bible'

const BIBLE_VERSIONS: BibleVersion[] = ['NIV', 'NLT', 'KJV']

const VERSION_DESC: Record<BibleVersion, string> = {
  NIV:  'New International Version — clear, modern English',
  NLT:  'New Living Translation — easy to read and understand',
  KJV:  'King James Version — traditional, poetic language',
}

interface Step {
  icon: React.ReactNode
  title: string
  subtitle: string
}

const STEPS: Step[] = [
  { icon: <Church className="w-8 h-8" />, title: 'Welcome to ACK St Francis', subtitle: 'Your digital parish home' },
  { icon: <BookOpen className="w-8 h-8" />, title: 'Choose Your Bible', subtitle: 'Pick a default reading version' },
  { icon: <Heart className="w-8 h-8" />, title: 'Join Your Cell Group', subtitle: 'Connect with your fellowship group' },
  { icon: <Bell className="w-8 h-8" />, title: 'Stay Connected', subtitle: 'Get notified about important events' },
]

interface OnboardingWizardProps {
  onComplete: () => void
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>('NIV')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [saving, setSaving] = useState(false)
  const [cellGroups, setCellGroups] = useState<string[]>([])

  useEffect(() => {
    loadCellGroups()
  }, [])

  async function loadCellGroups() {
    const { data } = await supabase
      .from('cell_groups')
      .select('name')
      .eq('is_active', true)
      .order('name')
    setCellGroups(data?.map(g => g.name) || [])
  }

  const isLast = step === STEPS.length - 1

  async function handleFinish() {
    if (!user) return
    setSaving(true)

    await supabase
      .from('profiles')
      .update({
        preferred_bible_version: selectedVersion,
        cell_group: selectedGroup || null,
      })
      .eq('id', user.id)

    if (notifEnabled && 'Notification' in window) {
      Notification.requestPermission()
    }

    // Mark onboarding as done in localStorage
    localStorage.setItem(`onboarding_done_${user.id}`, '1')
    setSaving(false)
    onComplete()
  }

  function next() {
    if (isLast) {
      handleFinish()
    } else {
      setStep(s => s + 1)
    }
  }

  function back() {
    setStep(s => Math.max(0, s - 1))
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="fixed inset-0 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < step ? 'bg-gold' : i === step ? 'bg-navy w-5' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Icon + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-navy/10 text-navy rounded-full mb-4">
              {STEPS[step].icon}
            </div>
            <h2 className="text-2xl font-playfair text-navy mb-1">{STEPS[step].title}</h2>
            <p className="text-gray-500 text-sm">{STEPS[step].subtitle}</p>
          </div>

          {/* Step content */}
          <div className="min-h-[200px]">
            {step === 0 && (
              <div className="space-y-4 text-center">
                <p className="text-gray-700 leading-relaxed">
                  Welcome, <span className="font-semibold text-navy">{user?.profile.full_name.split(' ')[0]}</span>!
                  We're glad you're here. Let's take a moment to set up your profile so you get the best experience.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: '📖', text: 'Read the Bible' },
                    { icon: '🙏', text: 'Daily Prayers' },
                    { icon: '🎵', text: 'Sermons & Worship' },
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

            {step === 1 && (
              <div className="space-y-2">
                {BIBLE_VERSIONS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVersion(v)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedVersion === v
                        ? 'border-navy bg-navy/5'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-navy">{v}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{VERSION_DESC[v]}</p>
                      </div>
                      {selectedVersion === v && (
                        <Check className="w-5 h-5 text-navy flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedGroup('')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedGroup === '' ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-700">Not in a group yet</span>
                </button>
                {cellGroups.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGroup(g)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedGroup === g ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{g}</span>
                      {selectedGroup === g && <Check className="w-5 h-5 text-navy" />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Enable push notifications to receive alerts for new sermons, upcoming events,
                  urgent notices, and prayer updates — even when the app is closed.
                </p>
                <div
                  onClick={() => setNotifEnabled(v => !v)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    notifEnabled ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
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
                <p className="text-xs text-gray-400 text-center">
                  You can change this anytime in your Profile settings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={next}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white rounded-lg hover:bg-navy-600 font-medium text-sm disabled:opacity-60"
          >
            {saving ? (
              'Saving…'
            ) : isLast ? (
              <>
                <Check className="w-4 h-4" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
