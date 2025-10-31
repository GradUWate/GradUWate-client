import { useState } from "react";
import {
  DndContext,
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

export function Schedule() {
  const [expanded, setExpanded] = useState({
    major: true,
    minor: false,
    specialization: false,
  });

  const [terms, setTerms] = useState<Term[]>(initialTerms);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const findContainer = (courseId: string) => {
    for (const term of terms) {
      if (term.courses.some((c) => c.code === courseId)) return term.id;
    }
    return null;
  };

  // flatten all available courses
  const allCourses = [
    ...terms.flatMap((term) => term.courses),
    ...Object.values(mockRequirements).flatMap((reqCourses) => reqCourses),
  ];

  function handleDragStart(event: any) {
    const { active } = event;
    const containerId = findContainer(active.id);

    // course dragged from sidebar
    if (!containerId) {
      const course = allCourses.find((c) => c.code === active.id);
      if (course) setActiveCourse(course);
      return;
    }

    // course dragged from a term
    const course = terms
      .find((t) => t.id === containerId)
      ?.courses.find((c) => c.code === active.id);
    if (course) setActiveCourse(course);
  }

  function handleDragOver(event: any) {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    // move between terms
    if (activeContainer && overContainer && activeContainer !== overContainer) {
      setTerms((prev) => {
        const activeTerm = prev.find((t) => t.id === activeContainer)!;
        const activeCourse = activeTerm.courses.find(
          (c) => c.code === active.id
        )!;
        return prev.map((t) => {
          if (t.id === activeContainer) {
            return {
              ...t,
              courses: t.courses.filter((c) => c.code !== active.id),
            };
          }
          if (t.id === overContainer) {
            return {
              ...t,
              courses: [...t.courses, activeCourse],
            };
          }
          return t;
        });
      });
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    // If dropped over a term
    if (
      over.data.current?.type === "term" &&
      active.data.current?.type === "course"
    ) {
      const droppedCourse = active.data.current.course;
      const termId = over.id;

      setTerms((prev) =>
        prev.map((t) =>
          t.id === termId ? { ...t, courses: [...t.courses, droppedCourse] } : t
        )
      );
    }
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] p-4 gap-4 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/4 h-full bg-white border rounded-md p-4 flex flex-col gap-4 overflow-y-auto">
        <h2>Relevant Courses</h2>
        <Section
          title="Major"
          expanded={expanded.major}
          onToggle={() => setExpanded({ ...expanded, major: !expanded.major })}
          items={mockRequirements.major}
        />
        <Section
          title="Minor"
          expanded={expanded.minor}
          onToggle={() => setExpanded({ ...expanded, minor: !expanded.minor })}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {terms.map((term) => (
              <TermColumn term={term} />
            ))}
            <DragOverlay>
              {activeCourse ? (
                <Card className="h-20 bg-gray-300 rounded-md shadow-inner opacity-70" />
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>
      </div>
    </div>
  );
}
