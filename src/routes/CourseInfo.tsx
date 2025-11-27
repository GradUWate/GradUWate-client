import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SearchSelect } from "@/components/atomic/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseGraph } from "../components/screens/info/CourseGraph";
import { useCourses } from "@/contexts/CoursesContext";
import type { Course } from "@/hooks/CourseClient";

export function CourseInfo() {
  const { courseId } = useParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { courses: allCourses, loading } = useCourses();
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    navigate(`/course-info/${value}`);
  };

  useEffect(() => {
    if (!courseId) {
      navigate("/course-info");
    }
    const courseFound = allCourses.find((c) => c.id === courseId) || null;
    if (!courseFound) {
      navigate("/course-info");
      return;
    }
    setSelectedCourse(courseFound);
  }, [courseId, navigate]);

  return (
    <div className="flex h-[calc(100vh-3rem)] p-4 gap-4 overflow-hidden">
      <aside className="w-1/4 flex-shrink-0 h-full bg-white border rounded-md p-4 flex flex-col">
        <div className="mb-4 w-full min-w-0">
          {loading ? (
            <p className="text-sm text-gray-500">Loading courses...</p>
          ) : (
            <SearchSelect
              placeholder="Search or select a course..."
              onValueChange={handleSelect}
              courses={allCourses}
            />
          )}
        </div>
        <Card className="flex-1 min-h-0 p-6 overflow-y-auto">
          {selectedCourse ? (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-600">
                  Selected Course:
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedCourse.code}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Course Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>
              <Separator className="my-2" />
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Offered</h3>
                {selectedCourse.offeredInTerms?.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Star className="h-4 w-4 text-gray-500" />
                    <span>{t}</span>
                  </div>
                ))}
                {selectedCourse.offeredOnlineOnly && (
                  <div className="flex mt-2 items-center gap-2 text-sm text-gray-700 font-semibold mt-1">
                    <span>Offered Online Only</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              <p>Select a course to view details</p>
            </div>
          )}
        </Card>
      </aside>
      <CourseGraph targetCourseId={selectedCourse?.id} />
    </div>
  );
}
