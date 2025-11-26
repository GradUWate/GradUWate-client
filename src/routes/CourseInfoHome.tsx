import { SearchSelect } from "@/components/atomic/SearchBar";
import { mockCourses } from "@/modules/mockData/schedule";
import { useNavigate } from "react-router-dom";

export function CourseInfoHome() {
  const navigate = useNavigate();
  const handleSelect = (value: string) => {
    navigate(`/course-info/${value}`);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <p>No course selected, pick a course!</p>
      <SearchSelect
        options={mockCourses}
        placeholder="Search or select a course..."
        onValueChange={handleSelect}
      />
    </div>
  );
}
