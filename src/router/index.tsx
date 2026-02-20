import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { AppLayout } from '@/components/layout/AppLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { HomePage } from '@/pages/app/HomePage'
import { BiblePage } from '@/pages/app/BiblePage'
import { PrayersPage } from '@/pages/app/PrayersPage'
import { SermonsPage } from '@/pages/app/SermonsPage'
import { PastorsCornerPage } from '@/pages/app/PastorsCornerPage'
import { NoticesPage } from '@/pages/app/NoticesPage'
import { EventsPage } from '@/pages/app/EventsPage'
import { CommunityPage } from '@/pages/app/CommunityPage'
import { GivingPage } from '@/pages/app/GivingPage'
import { PastoralCarePage } from '@/pages/app/PastoralCarePage'
import { ProfilePage } from '@/pages/app/ProfilePage'
import { MemberDirectory } from '@/pages/app/MemberDirectory'
import { NotificationsPage } from '@/pages/app/NotificationsPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminContentPage } from '@/pages/admin/AdminContentPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { ClergyPastoralDashboard } from '@/pages/admin/ClergyPastoralDashboard'
import { MediaLibrary } from '@/pages/admin/MediaLibrary'
import { SettingsPage } from '@/pages/admin/SettingsPage'
import { NotificationSender } from '@/pages/admin/NotificationSender'
import { ScheduledContent } from '@/pages/admin/ScheduledContent'
import { PageEditor } from '@/pages/admin/PageEditor'
import { FormBuilder } from '@/pages/admin/FormBuilder'
import { MorePage } from '@/pages/app/PlaceholderPages'
import { GivingReportsPage } from '@/pages/admin/GivingReportsPage'
import { BCPPage } from '@/pages/app/BCPPage'
import { TestimoniesPage } from '@/pages/app/TestimoniesPage'
import { CellGroupsPage } from '@/pages/app/CellGroupsPage'
import { CellGroupDetailPage } from '@/pages/app/CellGroupDetailPage'
import { AdminCellGroupsPage } from '@/pages/admin/AdminCellGroupsPage'
import { MinistriesPage } from '@/pages/app/MinistriesPage'
import { AdminMinistriesPage } from '@/pages/admin/AdminMinistriesPage'
import { ClergyDashboard } from '@/pages/admin/ClergyDashboard'
import { SacramentsPage } from '@/pages/app/SacramentsPage'
import { SacramentRequestPage } from '@/pages/app/SacramentRequestPage'
import { ClergySacramentsDashboard } from '@/pages/admin/ClergySacramentsDashboard'
import { PledgesPage } from '@/pages/app/PledgesPage'
import { MakePledgePage } from '@/pages/app/MakePledgePage'
import { AdminPledgesPage } from '@/pages/admin/AdminPledgesPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/bible" element={<AppLayout><BiblePage /></AppLayout>} />
        
        <Route path="/home" element={
          <ProtectedRoute>
            <AppLayout><HomePage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/prayers" element={
          <ProtectedRoute>
            <AppLayout><PrayersPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/sermons" element={
          <ProtectedRoute>
            <AppLayout><SermonsPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/pastors-corner" element={
          <ProtectedRoute>
            <AppLayout><PastorsCornerPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/notices" element={
          <ProtectedRoute>
            <AppLayout><NoticesPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/events" element={
          <ProtectedRoute>
            <AppLayout><EventsPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/giving" element={
          <ProtectedRoute>
            <AppLayout><GivingPage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/community" element={
          <ProtectedRoute>
            <AppLayout><CommunityPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/pastoral-care" element={
          <ProtectedRoute>
            <AppLayout><PastoralCarePage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><ProfilePage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <AppLayout><NotificationsPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/directory" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['leader', 'clergy', 'admin']}>
              <AppLayout><MemberDirectory /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <RoleGuard requiredRole="admin">
              <AppLayout><AdminDashboard /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/content" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'leader', 'admin']}>
              <AppLayout><AdminContentPage /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute>
            <RoleGuard requiredRole="admin">
              <AppLayout><AdminUsersPage /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/clergy/pastoral-care" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><ClergyPastoralDashboard /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/media" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><MediaLibrary /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/settings" element={
          <ProtectedRoute>
            <RoleGuard requiredRole="admin">
              <AppLayout><SettingsPage /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/notifications" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><NotificationSender /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/scheduled" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><ScheduledContent /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/pages" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><PageEditor /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/forms" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><FormBuilder /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/giving-reports" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><GivingReportsPage /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />
        
        <Route path="/bcp" element={
          <ProtectedRoute>
            <AppLayout><BCPPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/testimonies" element={
          <ProtectedRoute>
            <AppLayout><TestimoniesPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/cell-groups" element={
          <ProtectedRoute>
            <AppLayout><CellGroupsPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/cell-groups/:id" element={
          <ProtectedRoute>
            <AppLayout><CellGroupDetailPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/ministries" element={
          <ProtectedRoute>
            <AppLayout><MinistriesPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/clergy/dashboard" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><ClergyDashboard /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/ministries" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['leader', 'clergy', 'admin']}>
              <AppLayout><AdminMinistriesPage /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/admin/cell-groups" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['leader', 'clergy', 'admin']}>
              <AppLayout><AdminCellGroupsPage /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/sacraments" element={
          <ProtectedRoute>
            <AppLayout><SacramentsPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/sacraments/new" element={
          <ProtectedRoute>
            <AppLayout><SacramentRequestPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/clergy/sacraments" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><ClergySacramentsDashboard /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/pledges" element={
          <ProtectedRoute>
            <AppLayout><PledgesPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/pledges/:campaignId" element={
          <ProtectedRoute>
            <AppLayout><MakePledgePage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin/pledges" element={
          <ProtectedRoute>
            <RoleGuard requiredRole={['clergy', 'admin']}>
              <AppLayout><AdminPledgesPage /></AppLayout>
            </RoleGuard>
          </ProtectedRoute>
        } />

        <Route path="/more" element={
          <ProtectedRoute>
            <AppLayout><MorePage /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
