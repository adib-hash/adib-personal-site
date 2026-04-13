import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Writing from "./pages/Writing";
import Reading from "./pages/Reading";
import ReadingAdd from "./pages/ReadingAdd";
import GeAerospace from "./pages/research/GeAerospace";
import AiValueChain from "./pages/research/AiValueChain";

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
    <Routes>
      <Route
        path="/projects/research/ge-aerospace"
        element={<GeAerospace />}
      />
      <Route
        path="/projects/research/ai-value-chain"
        element={<AiValueChain />}
      />
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
      <Route path="/writing" element={<MainLayout><Writing /></MainLayout>} />
      <Route path="/reading" element={<MainLayout><Reading /></MainLayout>} />
      <Route path="/reading/add" element={<MainLayout><ReadingAdd /></MainLayout>} />
    </Routes>
  );
}

export default App;
