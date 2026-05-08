import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function CreateNotePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('customyellow');
  const [status, setStatus] = useState('note');
  const [isStarred, setIsStarred] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    // Check authentication
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      await notesAPI.create({
        title: title.trim(),
        content: content.trim(),
        color: selectedColor,
        status: status,
      });
      
      navigate('/notes');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideMiniMenu />
      <main className="flex-1 px-5 md:px-14 py-10 bg-richblack min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
              <i className="fas fa-plus-circle text-customblue"></i>
              Create Note
            </h1>
            <button
              onClick={() => navigate('/notes')}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition flex items-center gap-2"
            >
              <i className="fas fa-times"></i>
              Cancel
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-600 text-red-400 rounded-lg">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
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
                Star Note
              </button>

              <button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="px-6 py-3 rounded-lg bg-customblue text-white font-bold text-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-customblue transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Create Note
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

export default CreateNotePage;

