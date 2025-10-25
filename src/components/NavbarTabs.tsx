import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

export function NavbarTabs() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath =
    location.pathname === "/" ? "home" : location.pathname.slice(1);

  return (
    <nav className="Navbar w-full flex justify-center">
      <Tabs
        value={currentPath}
        onValueChange={(val) => navigate(val === "home" ? "/" : `/${val}`)}
      >
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="course-info">Course Info</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
      </Tabs>
    </nav>
  );
}
