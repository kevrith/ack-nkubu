import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  /** If true, shows a compact card instead of a full-screen error */
  inline?: boolean
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.inline) {
        return (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-3" />
            <h2 className="text-lg font-semibold text-navy mb-1">This page ran into an error</h2>
            <p className="text-gray-500 text-sm mb-4">Please try refreshing or go back.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-5 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 text-sm"
            >
              Try Again
            </button>
          </div>
        )
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-navy mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're sorry for the inconvenience. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-navy-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
