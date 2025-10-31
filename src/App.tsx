import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavbarTabs } from "./components/NavbarTabs";
import "./App.css";
import { CourseInfo, Home, Schedule } from "./routes";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen py-4">
        <NavbarTabs />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course-info" element={<CourseInfo />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
