import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableCourseTile } from "./CourseTile";
import type { Term } from "@/modules/mockData/schedule";

export function TermColumn({ term }: { term: Term }) {
  const { setNodeRef: setTermRef } = useDroppable({
    id: term.id,
    data: { type: "term" },
  });

  return (
    <div
      className="relative flex-1 min-w-[250px] bg-white border rounded-md p-4"
      ref={setTermRef}
    >
      <h2 className="text-lg font-semibold mb-3">{term.name}</h2>
      <SortableContext
        id={term.id}
        items={term.courses.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {term.courses.map((course) => (
            <SortableCourseTile key={course.id} course={course} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
