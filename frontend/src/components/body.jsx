import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";
import { PiFileDashedFill } from "react-icons/pi";

export default function Body() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(
    <div className="flex gap-3 items-center">
      <PiFileDashedFill className="h-20" />
      <h1>Upload Word File</h1>
    </div>
  );

  useEffect(() => {
    if (file) {
      console.log("Selected file:", file);
    }
  }, [file]);

  const onFileSelect = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please choose a .docx file to upload.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".docx")) {
      if (!window.confirm("File doesn't have .docx extension. Attempt conversion anyway?")) return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/convert-docx", formData, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      const filename =
        (file.name ? file.name.replace(/\.[^/.]+$/, "") : "document") + ".pdf";
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert("Conversion failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileName(
      <div className="flex gap-3 items-center">
        <PiFileDashedFill className="h-20" />
        <h1>Upload Word File</h1>
      </div>
    );
  };

  return (
    <main className="flex-grow">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          {loading ? (
            // Show only loading when processing
            <div className="flex justify-center items-center h-40">
              <Loading />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Upload Word (.docx) file
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Upload */}
                <label className="flex items-center justify-center w-72 h-12 px-4 bg-indigo-600 text-white rounded-md shadow-md cursor-pointer hover:bg-indigo-700 transition duration-300 truncate">
                  {fileName}
                  <input
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={onFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  >
                    Convert to PDF
                  </button>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Clear
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Note: Complex Word features (macros, advanced embedded content) may not always render perfectly.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

