import { Connection, Node } from "@/generated/prisma/client";
import { error } from "console";
import { err } from "inngest/types";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  //if there is no connection return nodes as-is means they are all independent
  if (connections.length === 0) {
    return nodes;
  }

  // creat edge araay  for toposort
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  // add nodes with no connection as self edges to ensurre they are included in the toposort
  const connectedNodesIds = new Set<string>();
  for (const conn of connections) {
    connectedNodesIds.add(conn.fromNodeId);
    connectedNodesIds.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodesIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // perform topological sort
  let sortedNodesIds: string[];
  try {
    sortedNodesIds = toposort(edges);
    //remove dublicates from self - edges
    sortedNodesIds = [...new Set(sortedNodesIds)];
  } catch (e) {
    if (
      error instanceof Error &&
      error.message.includes("Cyclic dependency detected")
    ) {
      throw new Error("Cyclic dependency detected in workflow nodes");
    }
    throw error;
  }

  // Map sorted Ids back to nodes objects
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return sortedNodesIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
