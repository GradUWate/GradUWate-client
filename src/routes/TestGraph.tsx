import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";

type Node = {
  id: string;
  name: string;
  color?: string;
};

type Link = {
  source: string;
  target: string;
};

type CoursePath = {
  nodes: Node[];
  links: Link[];
};

const mockPath: CoursePath = {
  nodes: [
    { id: "course", name: "Main Course", color: "#0ea5e9" },
    { id: "p1", name: "Pathway 1", color: "#22c55e" },
    { id: "p2", name: "Pathway 2", color: "#eab308" },
    { id: "p3", name: "Pathway 3", color: "#ef4444" },
  ],
  links: [
    { source: "p1", target: "course" },
    { source: "p2", target: "course" },
    { source: "p3", target: "p2" },
  ],
};

export function TestGraph() {
  const [graphData, setGraphData] = useState<CoursePath | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setGraphData(mockPath); // now valid
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-4">Course Pathway Graph</h1>

      {graphData ? (
        <ForceGraph2D
          graphData={graphData}
          onNodeClick={(node) => {
            // You can do anything here:
            // - open a modal
            // - navigate to a course page
            // - highlight node
            // - print info
            navigate(`/course-info/${"cs134"}`);

            // Example: navigate if node has an id
            // router.push(`/courses/${node.id}`);
          }}
          nodeCanvasObject={(node: any, ctx: any) => {
            const label = node.name;
            ctx.fillStyle = node.color || "#000";
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#000";
            ctx.fillText(label, node.x + 12, node.y + 4);
          }}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkColor={() => "#999"}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
