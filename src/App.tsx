import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/contexts/ToastContext';
import { useTheme } from '@/hooks/useTheme';
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt';
import { Loader2 } from 'lucide-react';

// Lazy load route components for code splitting
const CreateNotePage = lazy(() => import('@/pages/CreateNotePage'));
const ViewNotePage = lazy(() => import('@/pages/ViewNotePage'));

// Loading component
function PageLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

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

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
        <PWAInstallPrompt />
      </Router>
    </ToastProvider>
  );
}

export default App;
