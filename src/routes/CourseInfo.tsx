import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { mockCourses } from "@/modules/mockData/schedule";
import { SearchSelect } from "@/components/atomic/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

type CourseData = {
  value: string;
  label: string;
  easiness: number;
  usefulness: number;
  description: string;
  professors: string[];
};

const courseData: CourseData[] = [
  {
    value: "cs134",
    label: "CS 134 - Introduction to Computer Science",
    easiness: 78,
    usefulness: 85,
    description:
      "An introduction to the fundamentals of programming and computer science. Covers problem solving, algorithms, and basic programming constructs.",
    professors: ["Dr. Ada Lovelace"],
  },
  {
    value: "cs240",
    label: "CS 240 - Data Structures and Algorithms",
    easiness: 56,
    usefulness: 63,
    description:
      "Introduction to widely used and effective methods of data organization, focusing on data structures, their algorithms, and performance. Topics include priority queues, sorting, dictionaries, and text processing data structures.",
    professors: ["Mr Bean"],
  },
  {
    value: "cs320",
    label: "CS 320 - Artificial Intelligence",
    easiness: 48,
    usefulness: 92,
    description:
      "Covers the foundations of artificial intelligence, including search algorithms, machine learning, and reasoning under uncertainty.",
    professors: ["Dr. Alan Turing", "Prof. Marvin Minsky"],
  },
];

export function CourseInfo() {
  const { courseId } = useParams();
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const navigate = useNavigate();

  const handleSelect = (value: string) => {
    navigate(`/course-info/${value}`);
  };

  useEffect(() => {
    if (!courseId) {
      navigate("/course-info");
    }
    const courseFound = courseData.find((c) => c.value === courseId) || null;
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
          <SearchSelect
            options={mockCourses}
            placeholder="Search or select a course..."
            onValueChange={handleSelect}
          />
        </div>
        <Card className="flex-1 min-h-0 p-6 overflow-y-auto">
          {selectedCourse ? (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-600">
                  Selected Course:
                </h2>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedCourse.label.split("-")[0].trim()}
                </p>
              </div>

              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="font-semibold text-gray-700">
                    Easiness:{" "}
                  </span>
                  {selectedCourse.easiness}%
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Usefulness:{" "}
                  </span>
                  {selectedCourse.usefulness}%
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
                <h3 className="font-semibold text-gray-700 mb-2">
                  Recommended Professors
                </h3>
                {selectedCourse.professors.map((prof) => (
                  <div
                    key={prof}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Star className="h-4 w-4 text-gray-500" />
                    <span>{prof}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              <p>Select a course to view details</p>
            </div>
          )}
        </Card>
      </aside>
      <Card className="flex-1 flex-shrink-0 h-full bg-gray-200 px-4">
        Course Pathways
      </Card>
    </div>
  );
}
