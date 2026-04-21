import { TREE_NODES, type TreeNode } from './treeData'

// ── Node progress (per-user, localStorage) ────────────────────────────────────

export interface NodeProgress {
  stars: 0 | 1 | 2 | 3
  bestAccuracy: number   // 0-100
  attempts: number
  completedAt?: number
}

export type NodeStatus = 'locked' | 'available' | 'complete' | 'mastered'

export interface NodeWithStatus extends TreeNode {
  status: NodeStatus
  progress: NodeProgress
}

const KEY = 'fm_skilltree_v1'

// ── Persistence ───────────────────────────────────────────────────────────────

export function loadTreeProgress(): Record<string, NodeProgress> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveNodeProgress(nodeId: string, p: NodeProgress): void {
  const all = loadTreeProgress()
  all[nodeId] = p
  localStorage.setItem(KEY, JSON.stringify(all))
}

/** Called after a session ends. Updates the node if better than previous. */
export function applySessionToNode(
  nodeId: string,
  starsEarned: 1 | 2 | 3,
  accuracy: number,   // 0–100
): NodeProgress {
  const all  = loadTreeProgress()
  const prev = all[nodeId] ?? { stars: 0, bestAccuracy: 0, attempts: 0 }
  const next: NodeProgress = {
    stars:        Math.max(prev.stars, starsEarned) as 0 | 1 | 2 | 3,
    bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
    attempts:     prev.attempts + 1,
    completedAt:  prev.completedAt ?? (starsEarned >= 1 ? Date.now() : undefined),
  }
  saveNodeProgress(nodeId, next)
  return next
}

// ── Status derivation ─────────────────────────────────────────────────────────

function deriveStatus(node: TreeNode, progress: Record<string, NodeProgress>): NodeStatus {
  const p = progress[node.id]
  if (p && p.stars >= 3) return 'mastered'
  if (p && p.stars >= 1) return 'complete'
  // Check prerequisites
  const allDone = node.requires.every(req => {
    const rp = progress[req]
    return rp && rp.stars >= 1
  })
  return allDone ? 'available' : 'locked'
}

/** Returns all tree nodes enriched with status and progress.
 *  Pass a custom nodes array for topic-specific trees; defaults to the
 *  global TREE_NODES when called with no argument. */
export function getTreeWithStatus(nodes: TreeNode[] = TREE_NODES): NodeWithStatus[] {
  const progress = loadTreeProgress()
  return nodes.map(node => ({
    ...node,
    status:   deriveStatus(node, progress),
    progress: progress[node.id] ?? { stars: 0, bestAccuracy: 0, attempts: 0 },
  }))
}

/** Find the first available (not yet complete) node — the suggested next step. */
export function findNextNode(nodes: NodeWithStatus[]): NodeWithStatus | undefined {
  return nodes.find(n => n.status === 'available')
}
