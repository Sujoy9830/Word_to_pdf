export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-center py-4 mt-auto">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm">© {new Date().getFullYear()} DOCX Converter</p>
      </div>
    </footer>
  );
}
