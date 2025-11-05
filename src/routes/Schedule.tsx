import { useState } from "react";
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
import { SearchSelect } from "@/components/atomic/SearchBar";
import {
  mockCourses,
  mockRequirements,
  mockTerms as initialTerms,
  type Course,
  type Term,
} from "@/modules/mockData/schedule";
import { TermColumn, Section } from "@/components/screens/schedule";
import { arrayMove } from "@dnd-kit/sortable";

export function Schedule() {
  const [expanded, setExpanded] = useState({
    major: true,
    minor: false,
    specialization: false,
  });

  const [terms, setTerms] = useState<Term[]>(initialTerms);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

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

  const allCourses = [
    ...terms.flatMap((term) => term.courses),
    ...Object.values(mockRequirements).flatMap((reqCourses) => reqCourses),
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
                const tempCourse: Course = {
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
      const newCourse: Course = {
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
          <h2>Relevant Courses</h2>
          <Section
            title="Major"
            expanded={expanded.major}
            onToggle={() =>
              setExpanded({ ...expanded, major: !expanded.major })
            }
            items={mockRequirements.major}
          />
          <Section
            title="Minor"
            expanded={expanded.minor}
            onToggle={() =>
              setExpanded({ ...expanded, minor: !expanded.minor })
            }
            items={mockRequirements.minor}
          />
          <Section
            title="Specialization"
            expanded={expanded.specialization}
            onToggle={() =>
              setExpanded({
                ...expanded,
                specialization: !expanded.specialization,
              })
            }
            items={mockRequirements.specialization}
          />
          <div className="flex flex-col gap-2">
            <h3>Search for more</h3>
            <SearchSelect
              options={mockCourses}
              placeholder="Search or select a course..."
              onValueChange={(val) => console.log("Selected course:", val)}
            />
          </div>
        </aside>

        {/* Terms */}
        <div className="flex flex-col gap-2 flex-1 min-w-0 h-full">
          <Card className="flex flex-row justify-between gap-4 px-4 items-center">
            <div>
              <span>Credit Count: </span>
              <span>12/24</span>
            </div>
            <Button>Add additional study term</Button>
          </Card>

          <main className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-thin">
            {terms.map((term) => (
              <TermColumn term={term} />
            ))}
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
