import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/contexts/ToastContext';
import CreateNotePage from '@/pages/CreateNotePage';
import ViewNotePage from '@/pages/ViewNotePage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CreateNotePage />} />
          <Route path="/note/:urlCode" element={<ViewNotePage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
