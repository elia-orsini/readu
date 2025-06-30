import LoadingSpinner from "../LoadingSpinner";

// This component handles file uploads and displays the upload status
export default function UploadComponent({
  handleFileChange,
  loading,
}: {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}) {
  return (
    <div className="mb-8">
      <label className="mb-2 block text-base font-medium text-gray-700">Upload EPUB File</label>
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center hover:border-gray-300">
        <div className="space-y-2">
          <svg
            className="mx-auto h-10 w-10 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            />
          </svg>
          <div className="flex justify-center text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none hover:text-blue-500"
            >
              <span>Upload an EPUB file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".epub"
                onChange={handleFileChange}
                className="sr-only"
                disabled={loading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">EPUB files up to 10MB</p>
        </div>
      </div>
      {loading && (
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <LoadingSpinner /> Processing EPUB file...
        </div>
      )}
    </div>
  );
}
