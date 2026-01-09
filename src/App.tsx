import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "./context/DemoContext";
import Landing from "./pages/Landing";
import TemplateSelection from "./pages/TemplateSelection";
import DataSourceSimulation from "./pages/DataSourceSimulation";
import ReviewPage from "./pages/ReviewPage";
import DemoPage from "./pages/DemoPage";
import AIDrafting from "./pages/AIDrafting";
import DocumentPreview from "./pages/DocumentPreview";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/templates" element={<TemplateSelection />} />
          <Route path="/data-source" element={<DataSourceSimulation />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/drafting" element={<AIDrafting />} />
          <Route path="/preview" element={<DocumentPreview />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </DemoProvider>
  );
}

export default App;

