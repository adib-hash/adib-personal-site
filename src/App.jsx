import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Writing from "./pages/Writing";
import Reading from "./pages/Reading";
import ReadingAdd from "./pages/ReadingAdd";

const GeAerospace = lazy(() => import("./pages/research/GeAerospace"));
const AiValueChain = lazy(() => import("./pages/research/AiValueChain"));
const LegacyHollywood = lazy(() => import("./pages/research/LegacyHollywood"));
const OpenAiOrigin = lazy(() => import("./pages/research/OpenAiOrigin"));
const NvidiaInventory = lazy(() => import("./pages/research/NvidiaInventory"));

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
      <Route
        path="/projects/research/ge-aerospace"
        element={<GeAerospace />}
      />
      <Route
        path="/projects/research/ai-value-chain"
        element={<AiValueChain />}
      />
      <Route
        path="/projects/research/legacy-hollywood"
        element={<LegacyHollywood />}
      />
      <Route
        path="/projects/research/openai-origin"
        element={<OpenAiOrigin />}
      />
      <Route
        path="/projects/research/nvidia-inventory"
        element={<NvidiaInventory />}
      />
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
      <Route path="/writing" element={<MainLayout><Writing /></MainLayout>} />
      <Route path="/reading" element={<MainLayout><Reading /></MainLayout>} />
      <Route path="/reading/add" element={<MainLayout><ReadingAdd /></MainLayout>} />
    </Routes>
    </Suspense>
  );
}

export default App;
