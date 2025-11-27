import { useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { SearchSelect } from "@/components/atomic/SearchBar";
import { TermColumn, Section } from "@/components/screens/schedule";
import { arrayMove } from "@dnd-kit/sortable";
import { useCourses } from "@/contexts/CoursesContext";
import {
  useSchedules,
  type ScheduleTerm,
  type ScheduleCourse,
} from "@/contexts/SchedulesContext";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export function Schedule() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const { courses: apiCourses } = useCourses();
  const { getScheduleById, updateSchedule } = useSchedules();

  const [expanded, setExpanded] = useState({
    allCourses: true,
  });

  const [terms, setTerms] = useState<ScheduleTerm[]>([]);
  const [activeCourse, setActiveCourse] = useState<ScheduleCourse | null>(null);

  // Load schedule data when component mounts or scheduleId changes
  useEffect(() => {
    if (!scheduleId) {
      navigate("/");
      return;
    }

    const schedule = getScheduleById(scheduleId);
    if (!schedule) {
      navigate("/");
      return;
    }

    // Convert ScheduleTerm[] to Term[] for compatibility
    const convertedTerms: ScheduleTerm[] = schedule.terms.map((term) => ({
      id: term.id,
      name: term.name,
      courses: term.courses,
    }));

    setTerms(convertedTerms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  // Save terms to schedule context whenever they change
  useEffect(() => {
    if (!scheduleId) return;

    const convertedTerms: ScheduleTerm[] = terms.map((term) => ({
      id: term.id,
      name: term.name,
      courses: term.courses,
    }));

    updateSchedule(scheduleId, { terms: convertedTerms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, scheduleId]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const findContainer = (courseId: string) => {
    for (const term of terms) {
      if (term.courses.some((c) => c.id === courseId)) return term.id;
    }
    return null;
  };

  // Convert API courses to match the mock Course type format for drag-and-drop
  const sidebarCourses: ScheduleCourse[] = apiCourses.map((course) => ({
    id: course.id,
    code: course.code,
    description: course.title || course.description || "",
  }));

  const allCourses = [
    ...terms.flatMap((term) => term.courses),
    ...sidebarCourses,
    // ...Object.values(mockRequirements).flatMap((reqCourses) => reqCourses),
  ];

  function handleDragStart(event: any) {
    const { active } = event;
    const containerId = findContainer(active.id);

    //sidebar course
    if (!containerId) {
      const course = allCourses.find((c) => c.id === active.id);
      if (course) setActiveCourse(course);
      return;
    }

    //pre-existing course
    const course = terms
      .find((t) => t.id === containerId)
      ?.courses.find((c) => c.id === active.id);
    if (course) setActiveCourse(course);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    const moveBetweenTerms =
      activeContainer && overContainer && activeContainer !== overContainer;
    if (moveBetweenTerms) {
      setTerms((prev) => {
        const activeTerm = prev.find((t) => t.id === activeContainer)!;
        const activeCourse = activeTerm.courses.find(
          (c) => c.id === active.id
        )!;

        return prev.map((t) => {
          if (t.id === activeContainer) {
            return {
              ...t,
              courses: t.courses.filter((c) => c.id !== active.id),
            };
          }
          if (t.id === overContainer) {
            const overIndex = t.courses.findIndex((c) => c.id === over.id);
            const newCourses = [...t.courses];
            newCourses.splice(overIndex, 0, activeCourse);
            return {
              ...t,
              courses: newCourses,
            };
          }
          return t;
        });
      });
    }

    if (!activeContainer && overContainer) {
      const activeData = active.data.current;
      if (activeData?.type === "course") {
        const activeCourse = activeData.course;
        setTerms((prev) => {
          return prev.map((t) => {
            if (t.id === overContainer) {
              const tempCourseExists = t.courses.some((c) =>
                c.id.startsWith(`temp-${activeCourse.id}`)
              );

              if (tempCourseExists) {
                const tempCourse = t.courses.find((c) =>
                  c.id.startsWith(`temp-${activeCourse.id}`)
                )!;
                const currentIndex = t.courses.indexOf(tempCourse);
                const overIndex = t.courses.findIndex((c) => c.id === over.id);

                if (overIndex !== -1 && currentIndex !== overIndex) {
                  const newCourses = t.courses.filter((c) => c !== tempCourse);
                  newCourses.splice(overIndex, 0, tempCourse);
                  return { ...t, courses: newCourses };
                }
              } else {
                const tempCourse: ScheduleCourse = {
                  ...activeCourse,
                  id: `temp-${activeCourse.id}`,
                };

                const overIndex = t.courses.findIndex((c) => c.id === over.id);
                const newCourses = [...t.courses];

                if (overIndex !== -1) {
                  newCourses.splice(overIndex, 0, tempCourse);
                } else {
                  newCourses.push(tempCourse);
                }

                return { ...t, courses: newCourses };
              }
            } else {
              return {
                ...t,
                courses: t.courses.filter(
                  (c) => !c.id.startsWith(`temp-${activeCourse.id}`)
                ),
              };
            }
            return t;
          });
        });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setTerms((prev) =>
      prev.map((t) => ({
        ...t,
        courses: t.courses.filter((c) => !c.id.startsWith("temp-")),
      }))
    );

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const targetTermId =
      overData?.sortable?.containerId ??
      (overData?.type === "term" ? over.id : null);

    if (!targetTermId) return;

    const targetTerm = terms.find((t) => t.id === targetTermId);
    if (!targetTerm) return;

    const fromSidebar = !activeData?.sortable?.containerId;

    if (fromSidebar && activeData?.type === "course") {
      const activeCourse = activeData.course;
      const newCourse: ScheduleCourse = {
        ...activeCourse,
        id: `${activeCourse.id}-${Math.random().toString(36).slice(2, 6)}`,
        code: activeCourse.code,
      };

      const overIndex = targetTerm.courses.findIndex((c) => c.id === over.id);

      setTerms((prevTerms) =>
        prevTerms.map((t) => {
          if (t.id === targetTermId) {
            const newCourses = [...t.courses];
            if (overIndex !== -1) {
              newCourses.splice(overIndex, 0, newCourse);
            } else {
              newCourses.push(newCourse);
            }
            return { ...t, courses: newCourses };
          }
          return t;
        })
      );
    } else if (activeData?.type === "course") {
      const activeCourse = activeData.course;
      const activeIndex = targetTerm.courses.findIndex(
        (c) => c.id === activeCourse.id
      );
      const overIndex = targetTerm.courses.findIndex((c) => c.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setTerms((prevTerms) =>
          prevTerms.map((t) =>
            t.id === targetTermId
              ? {
                  ...t,
                  courses: arrayMove(t.courses, activeIndex, overIndex),
                }
              : t
          )
        );
      }
    }
  }

  const handleAddTerm = () => {
    const newTermNumber = terms.length + 1;
    const newTerm: ScheduleTerm = {
      id: `term-${Date.now()}`,
      name: `Term ${newTermNumber}`,
      courses: [],
    };
    setTerms([...terms, newTerm]);
  };

  const getTotalCourses = () => {
    return terms.reduce((acc, term) => acc + term.courses.length, 0);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] p-4 gap-4 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Sidebar */}
        <aside className="w-1/4 h-full bg-white border rounded-md p-4 flex flex-col gap-4 overflow-y-auto">
          <h2>All Courses</h2>
          <Section
            title="All Courses"
            expanded={expanded.allCourses}
            onToggle={() =>
              setExpanded({ ...expanded, allCourses: !expanded.allCourses })
            }
            items={sidebarCourses}
          />
        </aside>

        {/* Terms */}
        <div className="flex flex-col gap-2 flex-1 min-w-0 h-full">
          <Card className="flex flex-row justify-between gap-4 px-4 items-center">
            <div>
              <span className="font-medium">Total Courses: </span>
              <span>{getTotalCourses()}</span>
            </div>
            <Button onClick={handleAddTerm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Study Term
            </Button>
          </Card>

          <main className="flex gap-4 overflow-x-auto h-full scrollbar-thin">
            {terms.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">
                    No terms yet. Add a term to start building your schedule!
                  </p>
                  <Button onClick={handleAddTerm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Term
                  </Button>
                </div>
              </div>
            ) : (
              terms.map((term) => <TermColumn key={term.id} term={term} />)
            )}
          </main>
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 300,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeCourse ? (
            <Card className="h-20 bg-gray-300 rounded-md shadow-inner opacity-70" />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
