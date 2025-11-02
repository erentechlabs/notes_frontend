import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from '@/contexts/ToastContext';
<<<<<<< HEAD
import { useTheme } from '@/hooks/useTheme';
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt';
import { Loader2 } from 'lucide-react';

// Lazy load route components for code splitting
const CreateNotePage = lazy(() => import('@/pages/CreateNotePage'));
const ViewNotePage = lazy(() => import('@/pages/ViewNotePage'));

// Loading component
function PageLoader() {
=======

// Lazy load pages for better performance
const CreateNotePage = lazy(() => import('@/pages/CreateNotePage'));
const ViewNotePage = lazy(() => import('@/pages/ViewNotePage'));

// Loading fallback component
function LoadingFallback() {
>>>>>>> e427749b6667a4cd25c877a5eba5b1df6ca0d931
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
<<<<<<< HEAD

function AppContent() {
  // Initialize theme globally
  useTheme();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<CreateNotePage />} />
        <Route path="/note/:urlCode" element={<ViewNotePage />} />
      </Routes>
    </Suspense>
  );
}
=======
>>>>>>> e427749b6667a4cd25c877a5eba5b1df6ca0d931

function App() {
  return (
    <ToastProvider>
      <Router>
<<<<<<< HEAD
        <AppContent />
        <PWAInstallPrompt />
=======
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<CreateNotePage />} />
            <Route path="/note/:urlCode" element={<ViewNotePage />} />
          </Routes>
        </Suspense>
>>>>>>> e427749b6667a4cd25c877a5eba5b1df6ca0d931
      </Router>
    </ToastProvider>
  );
}

export default App;
