function NotesHeader({ search, setSearch }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Notes</h1>
      <div className="flex mt-4 sm:mt-0">
        <div className="relative w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"><i className="fas fa-search"></i></span>
          <input 
            type="text" 
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search" 
            className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 outline-none border-none placeholder:text-gray-400 focus:ring-2 focus:ring-customblue transition font-medium"
            style={{fontSize: "1.05rem"}}
          />
        </div>
      </div>
    </div>
  );
}

export default NotesHeader;

