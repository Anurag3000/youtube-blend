import { useState } from "react";
import { uploadCSV, findMatch } from "../services/api";

function UploadPage({ setPage, setResultData }) {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);


const handleUpload = async () => {
  if (!file) {
    alert("Please select a CSV file");
    return;
  }

  setLoading(true); // 🔹 START loading

  try {
    await uploadCSV(file);   // 🔹 backend call
    setUploaded(true);       // 🔹 success
  } catch (error) {
    alert("Upload failed");  // 🔹 error handling
  } finally {
    setLoading(false);       // 🔹 STOP loading (always)
  }
};

//find match through backend
 const handleFindMatch = async () => {
  setLoading(true); // 🔹 START loading

  try {
    const result = await findMatch(); // 🔹 backend call
    setResultData(result);            // 🔹 save data
    setPage("result");                // 🔹 navigate
  } catch (error) {
    alert("Failed to find match");
  } finally {
    setLoading(false); // 🔹 STOP loading (always)
  }
};

  return (
    <div>
      <h2>Upload YouTube Watch History</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
      />
      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
            </button>

            {uploaded && (
            <>
                <p>Upload successful ✅</p>

                <button
                onClick={handleFindMatch}
                disabled={loading}
                >
                {loading ? "Finding Match..." : "Find Match"}
                </button>
            </>
            )}

    </div>
  );
}

export default UploadPage;
