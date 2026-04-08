// socialGraph.ts
export interface Edge {
  from: string;   // uid
  to: string;     // uid
  weight: number; // strength of relationship
  tags: string[]; // e.g. ["mentor","ally","team"]
}

export interface SocialGraph {
  nodes: Set<string>;
  edges: Edge[];
}

export function addInteraction(
  graph: SocialGraph,
  from: string,
  to: string,
  delta: number,
  tag?: string
): SocialGraph {
  const next: SocialGraph = {
    nodes: new Set(graph.nodes),
    edges: [...graph.edges]
  };

  next.nodes.add(from);
  next.nodes.add(to);

  const edge = next.edges.find(e => e.from === from && e.to === to);
  if (edge) {
    edge.weight += delta;
    if (tag && !edge.tags.includes(tag)) edge.tags.push(tag);
  } else {
    next.edges.push({
      from,
      to,
      weight: delta,
      tags: tag ? [tag] : []
    });
  }

  return next;
}

export function getNeighbors(graph: SocialGraph, uid: string): Edge[] {
  return graph.edges.filter(e => e.from === uid || e.to === uid);
}
