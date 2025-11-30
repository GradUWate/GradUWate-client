import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NavbarTabs } from "./components/NavbarTabs";
import { CourseInfo, Home, Schedule } from "./routes";
import { CourseInfoHome } from "./routes/CourseInfoHome";
import { CoursesProvider } from "./contexts/CoursesContext";
import { SchedulesProvider } from "./contexts/SchedulesContext";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./routes/Login"; // <--- Import Login

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
          path="/schedule/:scheduleId"
          element={
            <PageTransition>
              <Schedule />
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

// 2. PRIVATE LAYOUT (The "Inside" of the app)
// We moved the Providers HERE. This ensures we only fetch courses/schedules
// if the user is actually logged in.
const PrivateLayout = () => {
  return (
    <CoursesProvider>
      <SchedulesProvider>
        <div className="flex flex-col min-h-screen py-4 overflow-y-hidden">
          <NavbarTabs />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
        </div>
      </SchedulesProvider>
    </CoursesProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC: Login Page (No Navbar, No Data Fetching) */}
          <Route path="/login" element={<Login />} />

          {/* PRIVATE: Everything else */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
