import NoteCard from './NoteCard';

function NotesGrid({ notes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
      {notes.map((note, idx) => (
        <NoteCard key={idx} {...note} />
      ))}
    </div>
  );
}

export default NotesGrid;

