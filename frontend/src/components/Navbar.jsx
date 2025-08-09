export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-6 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-semibold">DOCX → PDF</h1>
        <p className="text-sm opacity-90">Upload a Word file and get a PDF</p>
      </div>
    </nav>
  );
}
