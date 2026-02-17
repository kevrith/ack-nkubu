import { AppRouter } from './router'
import { OfflineIndicator } from './components/shared/OfflineIndicator'
import { PushNotifications } from './components/shared/PushNotifications'
import { InstallPrompt } from './components/shared/InstallPrompt'
import './styles/globals.css'

function App() {
  return (
    <>
      <OfflineIndicator />
      <PushNotifications />
      <InstallPrompt />
      <AppRouter />
    </>
  )
}

export default App
