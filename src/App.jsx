import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Writing from "./pages/Writing";
import Reading from "./pages/Reading";
import ReadingAdd from "./pages/ReadingAdd";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/reading/add" element={<ReadingAdd />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
