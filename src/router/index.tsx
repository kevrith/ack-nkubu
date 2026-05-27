import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { AppLayout } from '@/components/layout/AppLayout'

// Eagerly loaded — these are on the critical path (auth + first render)
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { HomePage } from '@/pages/app/HomePage'

// App pages — lazy loaded
const BiblePage = lazy(() => import('@/pages/app/BiblePage').then(m => ({ default: m.BiblePage })))
const PrayersPage = lazy(() => import('@/pages/app/PrayersPage').then(m => ({ default: m.PrayersPage })))
const SermonsPage = lazy(() => import('@/pages/app/SermonsPage').then(m => ({ default: m.SermonsPage })))
const PastorsCornerPage = lazy(() => import('@/pages/app/PastorsCornerPage').then(m => ({ default: m.PastorsCornerPage })))
const NoticesPage = lazy(() => import('@/pages/app/NoticesPage').then(m => ({ default: m.NoticesPage })))
const EventsPage = lazy(() => import('@/pages/app/EventsPage').then(m => ({ default: m.EventsPage })))
const EventDetailPage = lazy(() => import('@/pages/app/EventDetailPage').then(m => ({ default: m.EventDetailPage })))
const CommunityPage = lazy(() => import('@/pages/app/CommunityPage').then(m => ({ default: m.CommunityPage })))
const GivingPage = lazy(() => import('@/pages/app/GivingPage').then(m => ({ default: m.GivingPage })))
const PastoralCarePage = lazy(() => import('@/pages/app/PastoralCarePage').then(m => ({ default: m.PastoralCarePage })))
const ProfilePage = lazy(() => import('@/pages/app/ProfilePage').then(m => ({ default: m.ProfilePage })))
const MemberDirectory = lazy(() => import('@/pages/app/MemberDirectory').then(m => ({ default: m.MemberDirectory })))
const MembersPage = lazy(() => import('@/pages/app/MembersPage').then(m => ({ default: m.MembersPage })))
const NotificationsPage = lazy(() => import('@/pages/app/NotificationsPage').then(m => ({ default: m.NotificationsPage })))
const BCPPage = lazy(() => import('@/pages/app/BCPPage').then(m => ({ default: m.BCPPage })))
const TestimoniesPage = lazy(() => import('@/pages/app/TestimoniesPage').then(m => ({ default: m.TestimoniesPage })))
const CellGroupsPage = lazy(() => import('@/pages/app/CellGroupsPage').then(m => ({ default: m.CellGroupsPage })))
const CellGroupDetailPage = lazy(() => import('@/pages/app/CellGroupDetailPage').then(m => ({ default: m.CellGroupDetailPage })))
const MinistriesPage = lazy(() => import('@/pages/app/MinistriesPage').then(m => ({ default: m.MinistriesPage })))
const MinistryDetailPage = lazy(() => import('@/pages/app/MinistryDetailPage').then(m => ({ default: m.MinistryDetailPage })))
const SacramentsPage = lazy(() => import('@/pages/app/SacramentsPage').then(m => ({ default: m.SacramentsPage })))
const SacramentRequestPage = lazy(() => import('@/pages/app/SacramentRequestPage').then(m => ({ default: m.SacramentRequestPage })))
const SacramentDetailPage = lazy(() => import('@/pages/app/SacramentDetailPage').then(m => ({ default: m.SacramentDetailPage })))
const PledgesPage = lazy(() => import('@/pages/app/PledgesPage').then(m => ({ default: m.PledgesPage })))
const MakePledgePage = lazy(() => import('@/pages/app/MakePledgePage').then(m => ({ default: m.MakePledgePage })))
const PledgeDetailPage = lazy(() => import('@/pages/app/PledgeDetailPage').then(m => ({ default: m.PledgeDetailPage })))
const ReferralPage = lazy(() => import('@/pages/app/ReferralPage').then(m => ({ default: m.ReferralPage })))
const ThemesPage = lazy(() => import('@/pages/app/ThemesPage').then(m => ({ default: m.ThemesPage })))
const SongsPage = lazy(() => import('@/pages/app/SongsPage').then(m => ({ default: m.SongsPage })))
const MorePage = lazy(() => import('@/pages/app/PlaceholderPages').then(m => ({ default: m.MorePage })))

// Admin pages — lazy loaded
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminContentPage = lazy(() => import('@/pages/admin/AdminContentPage').then(m => ({ default: m.AdminContentPage })))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })))
const ClergyPastoralDashboard = lazy(() => import('@/pages/admin/ClergyPastoralDashboard').then(m => ({ default: m.ClergyPastoralDashboard })))
const MediaLibrary = lazy(() => import('@/pages/admin/MediaLibrary').then(m => ({ default: m.MediaLibrary })))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })))
const NotificationSender = lazy(() => import('@/pages/admin/NotificationSender').then(m => ({ default: m.NotificationSender })))
const ScheduledContent = lazy(() => import('@/pages/admin/ScheduledContent').then(m => ({ default: m.ScheduledContent })))
const PageEditor = lazy(() => import('@/pages/admin/PageEditor').then(m => ({ default: m.PageEditor })))
const FormBuilder = lazy(() => import('@/pages/admin/FormBuilder').then(m => ({ default: m.FormBuilder })))
const GivingReportsPage = lazy(() => import('@/pages/admin/GivingReportsPage').then(m => ({ default: m.GivingReportsPage })))
const AdminPledgesPage = lazy(() => import('@/pages/admin/AdminPledgesPage').then(m => ({ default: m.AdminPledgesPage })))
const AdminCellGroupsPage = lazy(() => import('@/pages/admin/AdminCellGroupsPage').then(m => ({ default: m.AdminCellGroupsPage })))
const AdminMinistriesPage = lazy(() => import('@/pages/admin/AdminMinistriesPage').then(m => ({ default: m.AdminMinistriesPage })))
const ClergyDashboard = lazy(() => import('@/pages/admin/ClergyDashboard').then(m => ({ default: m.ClergyDashboard })))
const PaybillSettingsPage = lazy(() => import('@/pages/admin/PaybillSettingsPage').then(m => ({ default: m.PaybillSettingsPage })))
const ClergySacramentsDashboard = lazy(() => import('@/pages/admin/ClergySacramentsDashboard').then(m => ({ default: m.ClergySacramentsDashboard })))
const AdminThemesPage = lazy(() => import('@/pages/admin/AdminThemesPage').then(m => ({ default: m.AdminThemesPage })))
const AdminHymnsPage = lazy(() => import('@/pages/admin/AdminHymnsPage').then(m => ({ default: m.AdminHymnsPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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

          <Route path="/events/:id" element={
            <ProtectedRoute>
              <AppLayout><EventDetailPage /></AppLayout>
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

          <Route path="/members" element={
            <ProtectedRoute>
              <RoleGuard requiredRole={['leader', 'clergy', 'admin']}>
                <AppLayout><MembersPage /></AppLayout>
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

          <Route path="/admin/paybill-settings" element={
            <ProtectedRoute>
              <RoleGuard requiredRole="admin">
                <AppLayout><PaybillSettingsPage /></AppLayout>
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

          <Route path="/admin/pledges" element={
            <ProtectedRoute>
              <RoleGuard requiredRole={['clergy', 'admin']}>
                <AppLayout><AdminPledgesPage /></AppLayout>
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

          <Route path="/clergy/sacraments" element={
            <ProtectedRoute>
              <RoleGuard requiredRole={['clergy', 'admin']}>
                <AppLayout><ClergySacramentsDashboard /></AppLayout>
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

          <Route path="/more" element={
            <ProtectedRoute>
              <AppLayout><MorePage /></AppLayout>
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

          <Route path="/sacraments/:id" element={
            <ProtectedRoute>
              <AppLayout><SacramentDetailPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/pledges" element={
            <ProtectedRoute>
              <AppLayout><PledgesPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/pledges/my/:pledgeId" element={
            <ProtectedRoute>
              <AppLayout><PledgeDetailPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/pledges/:campaignId" element={
            <ProtectedRoute>
              <AppLayout><MakePledgePage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/referrals" element={
            <ProtectedRoute>
              <AppLayout><ReferralPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/ministries/:id" element={
            <ProtectedRoute>
              <AppLayout><MinistryDetailPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/themes" element={
            <AppLayout><ThemesPage /></AppLayout>
          } />

          <Route path="/songs" element={
            <ProtectedRoute>
              <AppLayout><SongsPage /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/themes" element={
            <ProtectedRoute>
              <RoleGuard requiredRole={['clergy', 'admin']}>
                <AppLayout><AdminThemesPage /></AppLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />

          <Route path="/admin/hymns" element={
            <ProtectedRoute>
              <RoleGuard requiredRole={['clergy', 'admin']}>
                <AppLayout><AdminHymnsPage /></AppLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
