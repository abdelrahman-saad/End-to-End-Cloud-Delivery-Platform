import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/NotesPage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import StarredNotesPage from './pages/StarredNotesPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/create-note" element={<CreateNotePage />} />
        <Route path="/edit-note/:id" element={<EditNotePage />} />
        <Route path="/starred" element={<StarredNotesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
