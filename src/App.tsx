import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NavbarTabs } from "./components/NavbarTabs";
import { CourseInfo, Home, Schedule, Test } from "./routes";
import { TestGraph } from "./routes/TestGraph";
import { CourseInfoHome } from "./routes/CourseInfoHome";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/course-info/:courseId"
          element={
            <PageTransition>
              <CourseInfo />
            </PageTransition>
          }
        />
        <Route
          path="/course-info"
          element={
            <PageTransition>
              <CourseInfoHome />
            </PageTransition>
          }
        />
        <Route
          path="/schedule"
          element={
            <PageTransition>
              <Schedule />
            </PageTransition>
          }
        />
        <Route
          path="/test"
          element={
            <PageTransition>
              <Test />
            </PageTransition>
          }
        />
        <Route
          path="/test-graph"
          element={
            <PageTransition>
              <TestGraph />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.1, ease: "easeIn" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen py-4 overflow-y-hidden">
        <NavbarTabs />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
