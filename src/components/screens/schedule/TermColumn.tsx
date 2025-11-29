import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableCourseTile } from "./CourseTile";
import type { ScheduleTerm } from "@/contexts/SchedulesContext";

export function TermColumn({ term }: { term: ScheduleTerm }) {
  const { setNodeRef: setTermRef, isOver } = useDroppable({
    id: term.id,
    data: { type: "term" },
  });

  return (
    <div
      className={`relative flex-1 min-w-[300px] bg-white border rounded-md p-4 transition-all duration-200 ${
        isOver ? "border-purple-500 border-2 bg-purple-50 shadow-lg" : ""
      }`}
      ref={setTermRef}
    >
      <h2 className="text-lg font-semibold mb-3">{term.name}</h2>
      <SortableContext
        id={term.id}
        items={term.courses.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 min-h-[100px] transition-all duration-200">
          {term.courses.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-gray-400 text-sm border-2 border-dashed rounded-md">
              Drop courses here
            </div>
          ) : (
            term.courses.map((course) => (
              <SortableCourseTile key={course.id} course={course} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
