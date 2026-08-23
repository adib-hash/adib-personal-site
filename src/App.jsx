import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Research from "./pages/Research";
import Writing from "./pages/Writing";
import Reading from "./pages/Reading";
import ReadingAdd from "./pages/ReadingAdd";
import NotFound from "./pages/NotFound";
import { researchItems } from "./data/research";
import AudioLab from "./pages/AudioLab";
import MotionLab from "./pages/MotionLab";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="route-fallback">
      <div className="route-fallback-monogram">AC</div>
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {researchItems
            .filter((item) => !item.external)
            .map((item) => {
              const Piece = item.component;
              return (
                <Route key={item.slug} path={item.path} element={<Piece />} />
              );
            })}

          {/* Legacy redirects — keep old /projects/research/:slug links working */}
          {researchItems
            .filter((item) => item.legacyPaths?.length)
            .flatMap((item) =>
              item.legacyPaths.map((legacyPath) => (
                <Route
                  key={legacyPath}
                  path={legacyPath}
                  element={<Navigate to={item.path} replace />}
                />
              ))
            )}

          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/research" element={<MainLayout><Research /></MainLayout>} />
          <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
          <Route path="/writing" element={<MainLayout><Writing /></MainLayout>} />
          <Route path="/reading" element={<MainLayout><Reading /></MainLayout>} />
          <Route path="/reading/add" element={<MainLayout><ReadingAdd /></MainLayout>} />
          {import.meta.env.DEV && <Route path="/audio-lab" element={<AudioLab />} />}
          {import.meta.env.DEV && <Route path="/motion-lab" element={<MotionLab />} />}

          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
