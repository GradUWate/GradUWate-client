import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SearchSelect } from "@/components/atomic/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseGraph } from "../components/screens/info/CourseGraph";
import { useCourses } from "@/contexts/CoursesContext";
import { getCourseById, type Course } from "@/hooks/CourseClient";

export function CourseInfo() {
  const { courseId } = useParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { courses: allCourses, loading } = useCourses();
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    navigate(`/course-info/${value}`);
  };

  useEffect(() => {
    const redirect = () => navigate("/course-info");

    const fetchCourse = async () => {
      if (!courseId) return redirect();
      const course = await getCourseById(courseId);
      if (!course) return redirect();

      setSelectedCourse(course);
    };

    fetchCourse();
  }, [courseId, navigate]);

  if (!selectedCourse) return null;

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
              {(selectedCourse.offeredInTerms ||
                selectedCourse.offeredOnlineOnly) && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Offerings
                    </h3>
                    {selectedCourse.offeredInTerms?.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-700 capitalize"
                      >
                        <Star className="h-4 w-4 text-gray-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                    {selectedCourse.offeredOnlineOnly && (
                      <div className="flex mt-2 items-center gap-2 text-sm text-gray-700 italic mt-1">
                        <span>Offered Online Only</span>
                      </div>
                    )}
                    {selectedCourse.offeredOnline && (
                      <div className="flex mt-2 items-center gap-2 text-sm text-gray-700 italic mt-1">
                        <span>Also offered online</span>
                      </div>
                    )}
                  </div>
                </>
              )}
              <Separator className="my-2" />
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Prereqs</h3>
                <p className="text-sm text-gray-600 leading-relaxed w-full word-wrap">
                  {selectedCourse.prereqs || "None"}
                </p>
              </div>
              {selectedCourse.antireqs && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">
                      Antireqs
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed w-full word-wrap">
                      {selectedCourse.antireqs}
                    </p>
                  </div>
                </>
              )}
              {selectedCourse.coreqs && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Coreqs</h3>
                    <p className="text-sm text-gray-600 leading-relaxed w-full word-wrap">
                      {selectedCourse.coreqs}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              <p>Select a course to view details</p>
            </div>
          )}
        </Card>
      </aside>
      <CourseGraph
        targetCourseId={selectedCourse?.id}
        targetCourseName={selectedCourse?.code}
      />
    </div>
  );
}
