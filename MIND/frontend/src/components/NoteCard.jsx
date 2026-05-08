import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import Star from './Star';
import { notesAPI } from '../services/api';

function NoteCard({ id, title, date, status, color, starred }) {
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(starred);
  const [isToggling, setIsToggling] = useState(false);

  const cardColors = {
    "customyellow": "bg-customyellow text-richblack",
    "customred": "bg-customred text-white",
    "customgreen": "bg-customgreen text-richblack",
    "customblue": "bg-customblue text-white",
    "custompurple": "bg-custompurple text-white",
  };

  const handleStarClick = async (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setIsToggling(true);
    try {
      await notesAPI.toggleStar(id);
      setIsStarred(!isStarred);
    } catch (err) {
      console.error('Failed to toggle star:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/edit-note/${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div 
      className={`relative rounded-xl note-card shadow-lg px-6 py-6 min-h-[158px] ${cardColors[color]} transition cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="font-semibold text-lg leading-tight mb-6 max-h-28 line-clamp-4">{title}</div>
      <div className="absolute left-6 bottom-3 text-[14px] text-opacity-70 font-medium">{formatDate(date || new Date().toISOString())}</div>
      <StatusBadge status={status} />
      <div className="absolute right-3 top-3" onClick={handleStarClick}>
        <i className={`fa-star ${isStarred ? "fas text-yellow-400" : "far text-gray-300"} text-lg transition ${!isToggling && 'hover:scale-110'}`} />
      </div>
    </div>
  );
}

export default NoteCard;
