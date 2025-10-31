import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { SortableCourseTile } from "./CourseTile";
import type { Term } from "@/modules/mockData/schedule";

export function TermColumn({ term }: { term: Term }) {
  const { setNodeRef } = useDroppable({
    id: term.id,
    data: { type: "term" },
  });

  return (
    <div
      ref={setNodeRef}
      key={term.id}
      className="flex-1 min-w-[250px] bg-white border rounded-md p-4 transition-all"
    >
      <h2 className="text-lg font-semibold mb-3">{term.name}</h2>
      <SortableContext
        items={term.courses.map((c) => c.code)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {term.courses.map((course) => (
            <SortableCourseTile key={course.code} course={course} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
