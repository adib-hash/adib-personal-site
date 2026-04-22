import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Research from "./pages/Research";
import Writing from "./pages/Writing";
import Reading from "./pages/Reading";
import ReadingAdd from "./pages/ReadingAdd";

const GeAerospace = lazy(() => import("./pages/research/GeAerospace"));
const AiValueChain = lazy(() => import("./pages/research/AiValueChain"));
const LegacyHollywood = lazy(() => import("./pages/research/LegacyHollywood"));
const OpenAiOrigin = lazy(() => import("./pages/research/OpenAiOrigin"));
const NvidiaInventory = lazy(() => import("./pages/research/NvidiaInventory"));
const AiCapex = lazy(() => import("./pages/research/AiCapex"));
const AMDInventory = lazy(() => import("./pages/research/AMDInventory"));
const AiCapitalMap = lazy(() => import("./pages/research/AiCapitalMap"));

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div />}>
    <Routes>
      <Route path="/research/ge-aerospace" element={<GeAerospace />} />
      <Route path="/research/ai-value-chain" element={<AiValueChain />} />
      <Route path="/research/legacy-hollywood" element={<LegacyHollywood />} />
      <Route path="/research/openai-origin" element={<OpenAiOrigin />} />
      <Route path="/research/nvidia-inventory" element={<NvidiaInventory />} />
      <Route path="/research/ai-capex" element={<AiCapex />} />
      <Route path="/research/amd-inventory" element={<AMDInventory />} />
      <Route path="/research/ai-capital-map" element={<AiCapitalMap />} />

      {/* Legacy redirects — keep old /projects/research/:slug links working */}
      <Route path="/projects/research/ge-aerospace" element={<Navigate to="/research/ge-aerospace" replace />} />
      <Route path="/projects/research/ai-value-chain" element={<Navigate to="/research/ai-value-chain" replace />} />
      <Route path="/projects/research/legacy-hollywood" element={<Navigate to="/research/legacy-hollywood" replace />} />
      <Route path="/projects/research/openai-origin" element={<Navigate to="/research/openai-origin" replace />} />
      <Route path="/projects/research/nvidia-inventory" element={<Navigate to="/research/nvidia-inventory" replace />} />
      <Route path="/projects/research/ai-capex" element={<Navigate to="/research/ai-capex" replace />} />
      <Route path="/projects/research/amd-inventory" element={<Navigate to="/research/amd-inventory" replace />} />

      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/research" element={<MainLayout><Research /></MainLayout>} />
      <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
      <Route path="/writing" element={<MainLayout><Writing /></MainLayout>} />
      <Route path="/reading" element={<MainLayout><Reading /></MainLayout>} />
      <Route path="/reading/add" element={<MainLayout><ReadingAdd /></MainLayout>} />
    </Routes>
    </Suspense>
  );
}

export default App;
