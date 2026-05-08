import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMiniMenu from '../components/SideMiniMenu';
import NotesGrid from '../components/NotesGrid';
import { notesAPI, authAPI } from '../services/api';

function StarredNotesPage() {
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
        // Filter only starred notes
        const starredNotes = data.filter(note => note.starred);
        setNotes(starredNotes);
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
      <div className="flex min-h-screen">
        <SideMiniMenu />
        <div className="flex-1 flex min-h-screen items-center justify-center bg-richblack text-white">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
            <p className="text-xl">Loading your starred notes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <SideMiniMenu />
        <div className="flex-1 flex min-h-screen items-center justify-center bg-richblack text-white">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-4xl mb-4 text-red-500"></i>
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SideMiniMenu />
      <main className="flex-1 px-5 md:px-14 py-10 bg-richblack min-h-screen">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
            <i className="fas fa-star text-yellow-400"></i>
            Starred Notes
          </h1>
          <div className="flex mt-4 sm:mt-0">
            <div className="relative w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search starred notes..."
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 outline-none border-none placeholder:text-gray-400 focus:ring-2 focus:ring-customblue transition font-medium"
                style={{ fontSize: "1.05rem" }}
              />
            </div>
          </div>
        </div>
        {filteredNotes.length === 0 ? (
          <div className="text-center mt-20">
            <i className="far fa-star text-6xl text-gray-600 mb-4"></i>
            <p className="text-xl text-gray-400">
              {search ? 'No starred notes match your search.' : 'No starred notes yet. Star your favorite notes!'}
            </p>
          </div>
        ) : (
          <NotesGrid notes={filteredNotes} />
        )}
      </main>
    </div>
  );
}

export default StarredNotesPage;

