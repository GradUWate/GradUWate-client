import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";
import {
  getCourseBackPathById,
  getCourseFrontPathById,
  type Node as APINode,
  type Link as APILink,
} from "@/hooks/CourseClient";

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

type GraphNode = {
  id: string;
  name: string;
  color?: string;

  // added dynamically by force-graph
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};

type GraphLink = {
  source: string | GraphNode;
  target: string | GraphNode;
};

export function CourseGraph({ targetCourseId }: { targetCourseId?: string }) {
  const [graphData, setGraphData] = useState<CoursePath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!targetCourseId) {
      setGraphData(null);
      return;
    }

    const loadPaths = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch both front and back paths
        const [frontPath, backPath] = await Promise.all([
          getCourseFrontPathById(targetCourseId),
          getCourseBackPathById(targetCourseId),
        ]);

        // Combine nodes and links from both paths
        const allNodes = new Map<string, Node>();
        const allLinks: Link[] = [];

        // Process front path (prerequisites - courses that come before)
        frontPath.nodes.forEach((node: APINode) => {
          if (!allNodes.has(node.id)) {
            allNodes.set(node.id, {
              id: node.id,
              name: node.code,
              color: "#f1c232ff", // yellow for prerequisites
            });
          }
        });

        frontPath.links.forEach((link: APILink) => {
          allLinks.push({
            source: link.start,
            target: link.end,
          });
        });

        // Process back path (courses that require this course)
        backPath.nodes.forEach((node: APINode) => {
          if (!allNodes.has(node.id)) {
            allNodes.set(node.id, {
              id: node.id,
              name: node.code,
              color: "#93c47dff", // green for courses that come after
            });
          }
        });

        backPath.links.forEach((link: APILink) => {
          allLinks.push({
            source: link.start,
            target: link.end,
          });
        });

        // Make sure the target course is included with a distinct color
        if (!allNodes.has(targetCourseId)) {
          allNodes.set(targetCourseId, {
            id: targetCourseId,
            name: targetCourseId,
            color: "#60a5fa", // blue for target course
          });
        }

        setGraphData({
          nodes: Array.from(allNodes.values()),
          links: allLinks,
        });
      } catch (err: unknown) {
        setError(`Failed to load course paths: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadPaths();
  }, [targetCourseId]);
  const NODE_RADIUS = 12;

  return (
    <Card className="h-full bg-gray-200 px-4">
      <h1 className="text-2xl font-semibold mb-4">Course Pathway Graph</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading course pathways...</p>}
      {!loading && !error && targetCourseId && graphData ? (
        <ForceGraph2D
          graphData={graphData}
          onNodeClick={(node) => {
            navigate(`/course-info/${node.id}`);
          }}
          linkDirectionalArrowLength={0} // disable built-in arrows
          linkCanvasObjectMode={() => "after"}
          linkCanvasObject={(link: GraphLink, ctx) => {
            const start = link.source as GraphNode;
            const end = link.target as GraphNode;

            if (!start.x || !start.y || !end.x || !end.y) return;

            const headSize = 8; // arrow head size
            const angle = Math.atan2(end.y - start.y, end.x - start.x);

            // Adjust arrow tip to be at the circle boundary instead of the center
            const endX = end.x - NODE_RADIUS * Math.cos(angle);
            const endY = end.y - NODE_RADIUS * Math.sin(angle);

            // Draw the line
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(endX, endY); // <-- use adjusted endpoint
            ctx.stroke();

            // Draw arrowhead (also using adjusted endpoint)
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - headSize * Math.cos(angle - Math.PI / 6),
              endY - headSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              endX - headSize * Math.cos(angle + Math.PI / 6),
              endY - headSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
          }}
          nodeCanvasObject={(node: GraphNode, ctx) => {
            if (!node.x || !node.y) return;
            const label = node.name;

            // Draw circle
            ctx.fillStyle =
              targetCourseId === node.id ? "#60a5fa" : node.color || "#60a5fa";
            ctx.beginPath();
            ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
            ctx.fill();

            // Draw text inside circle
            ctx.fillStyle = "#000"; // white text looks nicer
            ctx.font = "8px Sans-Serif"; // make text smaller
            ctx.textAlign = "center"; // horizontally centered
            ctx.textBaseline = "middle"; // vertically centered
            ctx.fillText(label, node.x, node.y); // draw in middle
          }}
        />
      ) : (
        !loading && !error && <p>Select a course to view its pathway graph</p>
      )}
    </Card>
  );
}
