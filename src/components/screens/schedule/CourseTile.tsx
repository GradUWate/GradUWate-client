import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Course } from "@/modules/mockData/schedule";
import { useDraggable } from "@dnd-kit/core";

export function SortableCourseTile({ course }: { course: Course }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: course.code });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-row items-start gap-2 p-3 bg-gray-100 cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="w-4 h-4 mt-1 text-gray-500" />
      <div>
        <p className="font-medium">{course.code}</p>
        {course.description && (
          <p className="text-sm text-gray-500">{course.description}</p>
        )}
      </div>
    </Card>
  );
}

export function DraggableCourseTile({ course }: { course: Course }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: course.code,
      data: { type: "course", course },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Card className="p-2 bg-gray-100 rounded-md shadow-sm">
        <div className="font-semibold">{course.code}</div>
        <div className="text-sm text-gray-500">{course.description}</div>
      </Card>
    </div>
  );
}
