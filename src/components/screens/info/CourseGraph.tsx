import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
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

export function CourseGraph({
  targetCourseId,
  targetCourseName,
}: {
  targetCourseId: string;
  targetCourseName: string;
}) {
  const [graphData, setGraphData] = useState<CoursePath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const graphRef = useRef<any>(null);
  const NODE_RADIUS = 20;

  useEffect(() => {
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
        frontPath.nodes?.forEach((node: APINode) => {
          if (!allNodes.has(node.id)) {
            allNodes.set(node.id, {
              id: node.id,
              name: node.code,
              color: "#e8d49bff",
            });
          }
        });

        frontPath.links?.forEach((link: APILink) => {
          allLinks.push({
            source: link.start,
            target: link.end,
          });
        });

        // Process back path (subsequent courses - courses that come after)
        backPath.nodes?.forEach((node: APINode) => {
          if (!allNodes.has(node.id)) {
            allNodes.set(node.id, {
              id: node.id,
              name: node.code,
              color: "#85b4c3ff",
            });
          }
        });

        backPath.links?.forEach((link: APILink) => {
          allLinks.push({
            source: link.end,
            target: link.start,
          });
        });

        allNodes.set(targetCourseId, {
          id: targetCourseId,
          name: targetCourseName,
          color: "#aeacacff",
        });

        const linkedNodeFrontIds = new Set<string>();
        const linkedNodeBackIds = new Set<string>();

        allLinks.forEach((link) => {
          if (link.source === targetCourseId)
            linkedNodeFrontIds.add(link.target);
          if (link.target === targetCourseId)
            linkedNodeBackIds.add(link.source);
        });

        allNodes.forEach((node, id) => {
          if (id !== targetCourseId && linkedNodeFrontIds.has(id)) {
            node.color = "#f1c232ff";
          }
          if (id !== targetCourseId && linkedNodeBackIds.has(id)) {
            node.color = "#119dccff";
          }
        });

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

  useEffect(() => {
    // Access the link force and set a custom distance
    graphRef?.current?.d3Force("link").distance(NODE_RADIUS * 4);
    // Set fixed distance to 100px

    // You can also provide a function to set distances dynamically per link
    // fgRef.current.d3Force('link').distance(link => link.myDesiredDistanceAttribute);

    // Increase the charge (repulsion force) between nodes to spread them out further
    // The default strength is -30, a larger negative value increases repulsion
    // graphRef.current.d3Force("charge").strength(-120);
  }, [graphData, graphRef]);

  return (
    <Card className="w-full h-full bg-gray-100 px-4 py-4 flex flex-col overflow-hidden">
      <h1 className="text-2xl font-semibold mb-4">Course Pathway Graph</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading course pathways...</p>}
      {!loading && !error && targetCourseId && graphData ? (
        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
          {/* If there's only one node, show a fixed centered circle */}
          {graphData.nodes.length === 1 ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: graphData.nodes[0].color || "#ccc",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {graphData.nodes[0].name}
              </div>
            </div>
          ) : (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              width={undefined}
              height={undefined}
              onNodeClick={(node) => {
                navigate(`/course-info/${node.id}`);
              }}
              linkDirectionalArrowLength={0}
              linkCanvasObjectMode={() => "after"}
              linkCanvasObject={(link: GraphLink, ctx) => {
                const start = link.source as GraphNode;
                const end = link.target as GraphNode;
                if (!start.x || !start.y || !end.x || !end.y) return;

                const headSize = 8;
                const angle = Math.atan2(end.y - start.y, end.x - start.x);

                const endX = end.x - NODE_RADIUS * Math.cos(angle);
                const endY = end.y - NODE_RADIUS * Math.sin(angle);

                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

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

                ctx.fillStyle = node.color || "#888";
                ctx.beginPath();
                ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = "#000";
                ctx.font = "8px Sans-Serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(label, node.x, node.y);
              }}
            />
          )}
        </div>
      ) : (
        !loading && !error && <p>Select a course to view its pathway graph</p>
      )}
    </Card>
  );
}
