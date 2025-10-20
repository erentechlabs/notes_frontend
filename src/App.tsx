import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from '@/contexts/ToastContext';

// Lazy load pages for better performance
const CreateNotePage = lazy(() => import('@/pages/CreateNotePage'));
const ViewNotePage = lazy(() => import('@/pages/ViewNotePage'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<CreateNotePage />} />
            <Route path="/note/:urlCode" element={<ViewNotePage />} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
