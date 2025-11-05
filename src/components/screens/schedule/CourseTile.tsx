import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Course } from "@/modules/mockData/schedule";
import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { useDraggable } from "@dnd-kit/core";

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;

  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

export function SortableCourseTile({ course }: { course: Course }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: course.id,
    data: { type: "course", course },
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  const isTemp = course.id.startsWith("temp-");

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex flex-row items-start gap-2 p-3 
        cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-in-out
        ${
          isDragging
            ? "opacity-40 scale-105 shadow-lg rotate-1 z-50 bg-gray-200"
            : "opacity-100 scale-100 shadow-sm bg-gray-100"
        }
        ${
          isTemp
            ? "border-dashed border-2 border-blue-400 bg-blue-50 opacity-70"
            : ""
        }
        hover:shadow-md hover:bg-gray-50
      `}
    >
      <GripVertical
        className={`
          w-4 h-4 mt-1 transition-colors duration-200
          ${isDragging ? "text-blue-500" : "text-gray-500"}
        `}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{course.code}</p>
        {course.description && (
          <p className="text-sm text-gray-500 truncate">{course.description}</p>
        )}
      </div>
    </Card>
  );
}

export function DraggableCourseTile({ course }: { course: Course }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: course.id,
      data: { type: "course", course },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
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
