import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateNotePage from '@/pages/CreateNotePage';
import ViewNotePage from '@/pages/ViewNotePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateNotePage />} />
        <Route path="/note/:urlCode" element={<ViewNotePage />} />
      </Routes>
    </Router>
  );
}

export default App;
