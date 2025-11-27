import { SearchSelect } from "@/components/atomic/SearchBar";
import { useNavigate } from "react-router-dom";
import { useCourses } from "@/contexts/CoursesContext";

export function CourseInfoHome() {
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses();

  const handleSelect = (value: string) => {
    navigate(`/course-info/${value}`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center p-4">
      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <p>No course selected, pick a course!</p>
          <div className="w-1/2">
            <SearchSelect
              placeholder="Search or select a course..."
              onValueChange={handleSelect}
              courses={courses}
            />
          </div>
        </>
      )}
    </div>
  );
}
