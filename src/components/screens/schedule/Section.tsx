import { ChevronDown, ChevronUp } from "lucide-react";
import { SortableCourseTile } from "./CourseTile";
import type { Course } from "@/modules/mockData/schedule";

type SectionProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  items: Course[];
};

export function Section({ title, expanded, onToggle, items }: SectionProps) {
  return (
    <div className="border-b pb-2">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left font-semibold text-gray-700"
      >
        <span>{title}</span>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {items.map((item) => (
            <SortableCourseTile key={item.code} course={item} />
          ))}
        </div>
      )}
    </div>
  );
}
