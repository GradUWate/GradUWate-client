import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  getCourseBackPathById,
  getCourseById,
  getCourseFrontPathById,
  type Course,
  type CoursePath,
} from "@/hooks/CourseClient";
import { useCourses } from "@/contexts/CoursesContext";

export function Test() {
  const [course, setCourse] = useState<Course | null>(null);
  const [frontPath, setFrontPath] = useState<CoursePath | null>(null);
  const [backPath, setBackPath] = useState<CoursePath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get normalized courses from context
  const { courses: allCourses } = useCourses();

  // Fetch course on mount
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const result = await getCourseById("CS-343"); // OR "123" depending on backend
        setCourse(result);
      } catch (err: unknown) {
        setError(`Failed to load course ${err}`);
      } finally {
        setLoading(false);
      }
    };

    const loadCourseFrontPath = async () => {
      try {
        const result = await getCourseFrontPathById("CS-341"); // OR "123" depending on backend
        setFrontPath(result);
      } catch (err: unknown) {
        setError(`Failed to load course ${err}`);
      } finally {
        setLoading(false);
      }
    };

    const loadCourseBackPath = async () => {
      try {
        const result = await getCourseBackPathById("CS-343"); // OR "123" depending on backend
        setBackPath(result);
      } catch (err: unknown) {
        setError(`Failed to load course ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
    loadCourseFrontPath();
    loadCourseBackPath();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Hi, Mr. Goose! 🎓</h1>
        <p className="text-lg mt-2">
          Let's start planning for{" "}
          <span className="font-semibold">GradUWation</span>!
        </p>
      </div>

      {/* Course Info */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Course Info</CardTitle>
          <CardDescription>Fetched from FastAPI backend</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading course…</p>}
          {error && <p className="text-red-500">{error}</p>}

          {course && (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Code:</span> {course.code}
              </p>
              <p>
                <span className="font-medium">Title:</span> {course.title}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {course.description}
              </p>
              <p>
                <span className="font-medium">Level:</span> {course.level}
              </p>

              <p className="font-medium mt-3">Prereqs:</p>
              {course.prereqs && course.prereqs?.length > 0 ? (
                <ul className="list-disc ml-6">
                  {course.prereqs?.map((p) => (
                    <li key={p.id}>{p.code}</li>
                  ))}
                </ul>
              ) : (
                <p>No prereqs</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Course Front Path</CardTitle>
          <CardDescription>Fetched from FastAPI backend</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading course…</p>}
          {error && <p className="text-red-500">{error}</p>}

          {frontPath && (
            <div className="space-y-2">
              <p className="font-medium mt-3">Front path nodes:</p>
              {frontPath.nodes && frontPath.nodes?.length > 0 ? (
                <ul className="list-disc ml-6">
                  {frontPath.nodes?.map((p) => (
                    <li key={p.id}>{p.code}</li>
                  ))}
                </ul>
              ) : (
                <p>No frontpath</p>
              )}
              <p className="font-medium mt-3">Front path links:</p>
              {frontPath.links && frontPath.links?.length > 0 ? (
                <ul className="list-disc ml-6">
                  {frontPath.links?.map((p) => (
                    <li key={p.start}>
                      Start: {p.start}. End: {p.end}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No frontpath</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Course Back Path</CardTitle>
          <CardDescription>Fetched from FastAPI backend</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading course…</p>}
          {error && <p className="text-red-500">{error}</p>}

          {backPath && (
            <div className="space-y-2">
              <p className="font-medium mt-3">Back path nodes:</p>
              {backPath.nodes && backPath.nodes?.length > 0 ? (
                <ul className="list-disc ml-6">
                  {backPath.nodes?.map((p) => (
                    <li key={p.id}>{p.code}</li>
                  ))}
                </ul>
              ) : (
                <p>No backpath</p>
              )}

              <p className="font-medium mt-3">Back path links:</p>
              {backPath.links && backPath.links?.length > 0 ? (
                <ul className="list-disc ml-6">
                  {backPath.links?.map((p) => (
                    <li key={p.start}>
                      Start: {p.start}. End: {p.end}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No backpath</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        {allCourses && (
          <div className="space-y-2">
            <p className="font-medium mt-3">All Courses:</p>
            {allCourses && allCourses?.length > 0 ? (
              <ul className="list-disc ml-6 list-none">
                {allCourses?.map((p) => (
                  <li key={p.id} className="border p-4 my-2 rounded-lg">
                    <p>
                      {p.code} - {p.title}
                    </p>
                    <p>{p.description}</p>
                    <p>{p.id}</p>
                    {p.offeredInTerms && (
                      <p>Offered in terms: {p.offeredInTerms.join(", ")}</p>
                    )}
                    {p.offeredOnlineOnly && <p>Offered online only</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No courses found</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
