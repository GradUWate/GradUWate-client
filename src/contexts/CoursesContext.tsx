import { createContext, useContext, useEffect, useState } from "react";
import { getAllCourses, type Course } from "@/hooks/CourseClient";

interface CoursesContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllCourses = async () => {
      try {
        const result = await getAllCourses();
        setCourses(result);
      } catch (err: unknown) {
        setError(`Failed to load courses: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadAllCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses, loading, error }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }
  return context;
}
