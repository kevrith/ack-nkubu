import { ReferralProgram } from '@/components/shared/ReferralProgram'

export function ReferralPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-playfair text-navy mb-2">Invite Friends</h1>
        <p className="text-gray-600">Share your faith community and grow together</p>
      </div>
      <ReferralProgram />
    </div>
  )
}
