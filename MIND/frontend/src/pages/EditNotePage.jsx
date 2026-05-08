import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SideMiniMenu from '../components/SideMiniMenu';
import { notesAPI, authAPI } from '../services/api';

const COLORS = [
  { name: 'Yellow', value: 'customyellow', bg: 'bg-customyellow', text: 'text-richblack' },
  { name: 'Red', value: 'customred', bg: 'bg-customred', text: 'text-white' },
  { name: 'Green', value: 'customgreen', bg: 'bg-customgreen', text: 'text-richblack' },
  { name: 'Blue', value: 'customblue', bg: 'bg-customblue', text: 'text-white' },
  { name: 'Purple', value: 'custompurple', bg: 'bg-custompurple', text: 'text-white' },
];

const STATUSES = [
  { value: 'note', label: 'Note', icon: 'far fa-sticky-note' },
  { value: 'todo:inprogress', label: 'In Progress', icon: 'fas fa-spinner' },
  { value: 'todo:done', label: 'Done', icon: 'fas fa-check-circle' },
  { value: 'todo:nostatus', label: 'No Status', icon: 'far fa-circle' },
];

function EditNotePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('customyellow');
  const [status, setStatus] = useState('note');
  const [isStarred, setIsStarred] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Fetch note data
    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const note = await notesAPI.getById(id);
        setTitle(note.title || '');
        setContent(note.content || '');
        setSelectedColor(note.color || 'customyellow');
        setStatus(note.status || 'note');
        setIsStarred(note.starred || false);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Unauthorized') || err.message.includes('token')) {
          authAPI.logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      await notesAPI.update(id, {
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
        status: status,
        starred: isStarred,
      });
      
      navigate('/notes');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await notesAPI.delete(id);
      navigate('/notes');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-richblack text-white">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p className="text-xl">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SideMiniMenu />
      <main className="flex-1 px-5 md:px-14 py-10 bg-richblack min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
              <i className="fas fa-edit text-customblue"></i>
              Edit Note
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white transition flex items-center gap-2"
              >
                <i className="fas fa-trash"></i>
                Delete
              </button>
              <button
                onClick={() => navigate('/notes')}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition flex items-center gap-2"
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-600 text-red-400 rounded-lg">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          {showDeleteConfirm && (
            <div className="mb-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 text-yellow-400 rounded-lg">
              <p className="mb-3">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="input-glass w-full rounded-lg px-4 py-3 bg-opacity-90 text-white border border-gray-700 focus:ring-2 focus:ring-customblue outline-none font-medium transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content..."
                rows="8"
                className="input-glass w-full rounded-lg px-4 py-3 bg-opacity-90 text-white border border-gray-700 focus:ring-2 focus:ring-customblue outline-none font-medium transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Color
                </label>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-12 h-12 rounded-lg ${color.bg} transition transform hover:scale-110 ${
                        selectedColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-richblack' : ''
                      }`}
                      aria-label={color.name}
                    >
                      {selectedColor === color.value && (
                        <i className="fas fa-check text-current"></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((stat) => (
                    <button
                      key={stat.value}
                      type="button"
                      onClick={() => setStatus(stat.value)}
                      className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                        status === stat.value
                          ? 'bg-customblue text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <i className={stat.icon}></i>
                      {stat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  isStarred
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <i className={`fas fa-star ${isStarred ? 'text-yellow-300' : ''}`}></i>
                {isStarred ? 'Starred' : 'Star Note'}
              </button>

              <button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="px-6 py-3 rounded-lg bg-customblue text-white font-bold text-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-customblue transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditNotePage;
