import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function NavbarTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const currentPath =
    location.pathname === "/" ? "home" : location.pathname.slice(1);

  return (
    <nav className="Navbar w-full flex justify-center items-center relative p-2">
      {/* Tabs */}
      <Tabs
        value={currentPath}
        onValueChange={(val) => navigate(val === "home" ? "/" : `/${val}`)}
        className="transition-all"
      >
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="course-info">Course Info</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* User Info (Only Logged In state needed now) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        {user && (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL || ""}
              alt="user"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-gray-200"
            />
            <button
              onClick={logOut} // ProtectedRoute will auto-redirect to Login when this happens
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
