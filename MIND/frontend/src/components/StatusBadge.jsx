import { statusMap } from '../data/notesData';

function StatusBadge({ status }) {
  const data = statusMap[status];
  return (
    <span className={`absolute right-3 bottom-3 flex items-center space-x-2 px-2 py-1 rounded bg-opacity-70 ${data.bg} ${data.color} text-xs font-semibold`}>
      <span><i className={data.iconClass} /></span>
      <span>{data.text}</span>
    </span>
  );
}

export default StatusBadge;

