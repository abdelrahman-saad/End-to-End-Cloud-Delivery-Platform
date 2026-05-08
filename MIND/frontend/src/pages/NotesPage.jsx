import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMiniMenu from '../components/SideMiniMenu';
import NotesHeader from '../components/NotesHeader';
import NotesGrid from '../components/NotesGrid';
import { notesAPI, authAPI } from '../services/api';

function NotesPage() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Fetch notes
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const data = await notesAPI.getAll();
        setNotes(data);
      } catch (err) {
        setError(err.message);
        // If unauthorized, redirect to login
        if (err.message.includes('Unauthorized') || err.message.includes('token')) {
          authAPI.logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [navigate]);

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richblack text-white">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p className="text-xl">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richblack text-white">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-4xl mb-4 text-red-500"></i>
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SideMiniMenu/>
      <main className="flex-1 px-5 md:px-14 py-10 bg-richblack min-h-screen">
        <NotesHeader search={search} setSearch={setSearch} />
        {filteredNotes.length === 0 ? (
          <div className="text-center mt-20">
            <i className="far fa-sticky-note text-6xl text-gray-600 mb-4"></i>
            <p className="text-xl text-gray-400">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <NotesGrid notes={filteredNotes}/>
        )}
      </main>
    </div>
  );
}

export default NotesPage;

