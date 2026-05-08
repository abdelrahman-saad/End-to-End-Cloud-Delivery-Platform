function Star({ active }) {
  return (
    <span className="absolute right-3 top-3">
      <i className={`fa-star ${active ? "fas text-yellow-400" : "far text-gray-300"} text-lg`} />
    </span>
  );
}

export default Star;

