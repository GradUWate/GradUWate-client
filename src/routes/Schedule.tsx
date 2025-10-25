import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  mockCourses,
  mockRequirements,
  terms,
  type Course,
  type Term,
} from "@/modules/mockData/schedule";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/atomic/SearchBar";

export default function Schedule() {
  const [expanded, setExpanded] = useState({
    major: true,
    minor: false,
    specialization: false,
  });

  return (
    <div className="flex h-[calc(100vh-3rem)] p-4 gap-4 overflow-hidden">
      <aside className="w-1/4 h-full bg-white border rounded-md p-4 space-y-4 shrink-0">
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
      <div className="flex flex-col gap-2 flex-1 min-w-0 h-full">
        <Card className="flex flex-row justify-between gap-4 px-4 items-center">
          <div>
            <span>Credit Count: </span>
            <span>12/24</span>
          </div>
          <Button>Add additional study term</Button>
        </Card>
        <main className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-thin">
          {terms.map((term: Term) => (
            <div
              key={term.id}
              className="flex-1 min-w-[250px] bg-white border rounded-md p-4"
            >
              <h2 className="text-lg font-semibold mb-3">{term.name}</h2>
              <div className="space-y-2">
                {term.courses.map((course: Course) => (
                  <Card
                    key={course.code}
                    className="flex flex-row items-start gap-2 p-3 bg-gray-100"
                  >
                    <GripVertical className="w-4 h-4 mt-1 text-gray-500" />
                    <div>
                      <p className="font-medium">{course.code}</p>
                      <p className="text-sm text-gray-500">
                        {course.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

type SectionProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  items: { code: string }[];
};

function Section({ title, expanded, onToggle, items }: SectionProps) {
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
            <Card
              key={item.code}
              className="flex flex-row items-center p-3 bg-gray-100"
            >
              <GripVertical className="w-4 h-4 text-gray-500" />
              <span>{item.code}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
