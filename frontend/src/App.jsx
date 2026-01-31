import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ResultPage from "./pages/ResultPage";

function App() {
  const [page, setPage] = useState("upload");

  // 🔹 NEW STATE: store result data
  const [resultData, setResultData] = useState(null);

  return (
    <div>
      {page === "upload" && (
        <UploadPage
          setPage={setPage}
          setResultData={setResultData}
        />
      )}

      {page === "result" && (
        <ResultPage resultData={resultData} />
      )}
    </div>
  );
}

export default App;
