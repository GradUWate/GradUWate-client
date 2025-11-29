import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NavbarTabs } from "./components/NavbarTabs";
import { ProtectedRoute } from "./components/ProtectedRoute"; // <--- Import
import { AuthProvider } from "./context/AuthContext";

// Import your routes
import { Login } from "./routes/Login"; // <--- Import Login
import { CourseInfo, Home, Schedule, Test } from "./routes";

// A wrapper component for the "Private" part of the app
// This includes the Navbar + The Animated Routes
const PrivateLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen py-4 overflow-y-hidden">
      <NavbarTabs />
      <main className="flex-1">
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
              path="/course-info"
              element={
                <PageTransition>
                  <CourseInfo />
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
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

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
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1. PUBLIC ROUTE: The Login Page */}
          <Route path="/login" element={<Login />} />

          {/* 2. PRIVATE ROUTES: Everything else */}
          <Route
            path="/*" // Catches all other paths
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
