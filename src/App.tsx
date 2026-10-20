import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DesktopHeader } from './components/layout/DesktopHeader';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/ui/Toast';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProfessionalsPage = lazy(() => import('./pages/ProfessionalsPage'));
const ProfessionalDetailPage = lazy(() => import('./pages/ProfessionalDetailPage'));
const MaterialsPage = lazy(() => import('./pages/MaterialsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const MyWorkPage = lazy(() => import('./pages/MyWorkPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const QuotationsPage = lazy(() => import('./pages/QuotationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function PageLoader() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <LoadingSkeleton count={6} type="card" />
    </div>
  );
}

// Route-aware header: use mobile header on small screens, desktop on md+
function AppShell() {
  const location = useLocation();

  // Determine mobile header title for non-home pages
  const getMobileTitle = () => {
    if (location.pathname === '/') return null;
    if (location.pathname.startsWith('/professionals/')) return 'Professional Profile';
    if (location.pathname === '/professionals') return 'Find Professionals';
    if (location.pathname === '/materials') return 'Building Materials';
    if (location.pathname === '/cart') return 'Shopping Cart';
    if (location.pathname === '/checkout') return 'Checkout';
    if (location.pathname === '/my-work') return 'My Work';
    if (location.pathname === '/orders') return 'My Orders';
    if (location.pathname === '/quotations') return 'Quotations';
    if (location.pathname === '/profile') return 'My Profile';
    return null;
  };

  const mobileTitle = getMobileTitle();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      {/* Desktop header (hidden on mobile) */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        {mobileTitle ? (
          <MobileHeader title={mobileTitle} showBack={true} />
        ) : (
          <MobileHeader />
        )}
      </div>

      {/* Main content */}
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/professionals" element={<ProfessionalsPage />} />
            <Route path="/professionals/:id" element={<ProfessionalDetailPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-work" element={<MyWorkPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/quotations" element={<QuotationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={
              <div className="text-center py-24 px-4">
                <div className="text-6xl mb-4">🏗️</div>
                <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Page Not Found</h1>
                <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary btn-lg">Go Home</a>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      {/* Footer (desktop only) */}
      <Footer />

      {/* Mobile bottom navigation */}
      <MobileBottomNav />

      {/* Toast notifications */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
