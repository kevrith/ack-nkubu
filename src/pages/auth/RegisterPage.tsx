import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { normalizeKenyanPhone, isValidKenyanPhone } from '@/lib/utils'
import { Cross } from 'lucide-react'

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const normalizedPhone = phone ? normalizeKenyanPhone(phone) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (phone && !isValidKenyanPhone(phone)) {
      setError('Please enter a valid Kenyan phone number')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password, fullName, normalizedPhone || undefined)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-700 to-navy-600 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-4">
              <Cross className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-3xl font-playfair text-navy mb-2">Join ACK St Francis Nkubu</h1>
            <p className="text-gray-600 text-center">Become part of our community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
              {phone && normalizedPhone && (
                <p className="text-xs text-green-600 mt-1">✓ {normalizedPhone}</p>
              )}
              {phone && !normalizedPhone && (
                <p className="text-xs text-red-600 mt-1">Invalid Kenyan phone number</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy text-white py-3 rounded-lg hover:bg-navy-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-navy hover:text-gold font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
