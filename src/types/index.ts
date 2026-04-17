import type { Node, Edge } from '@xyflow/react'

// ──────────────────────────────────────────────
// Node Types
// ──────────────────────────────────────────────

export type SkillNodeType = 'trigger' | 'step' | 'condition' | 'subskill' | 'output' | 'loop'

export interface SkillNodeData extends Record<string, unknown> {
  label: string
  description?: string
  // Step / Code
  code?: string
  parameters?: Parameter[]
  // Condition
  conditionExpression?: string
  // SubSkill
  skillPath?: string
  skillName?: string
  // Output
  outputExpression?: string
  // Loop
  loopItems?: string
  loopVariable?: string
  // Trigger
  triggerExpression?: string
}

export type SkillNode = Node<SkillNodeData, SkillNodeType>

export interface Parameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  defaultValue?: unknown
  description?: string
}

// ──────────────────────────────────────────────
// Skill Metadata
// ──────────────────────────────────────────────

export interface SkillMetadata {
  name: string
  description?: string
  icon?: string
  tags?: string[]
  version?: string
  author?: string
  trigger?: string
}

// ──────────────────────────────────────────────
// Graph / Project format
// ──────────────────────────────────────────────

export interface SkillGraph {
  version: string
  source: string
  metadata: SkillMetadata
  nodes: SkillNode[]
  edges: Edge[]
}

// ──────────────────────────────────────────────
// Store Types
// ──────────────────────────────────────────────

export interface SkillStore {
  // Skill metadata
  metadata: SkillMetadata
  setMetadata: (meta: Partial<SkillMetadata>) => void

  // Nodes & Edges
  nodes: SkillNode[]
  edges: Edge[]
  setNodes: (nodes: SkillNode[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: any[]) => void
  onEdgesChange: (changes: any[]) => void

  // Selection
  selectedNodeId: string | null
  setSelectedNodeId: (id: string | null) => void
  selectedNode: SkillNode | null

  // Skill library
  skills: SkillMetadata[]
  addSkill: (skill: SkillMetadata) => void
  removeSkill: (name: string) => void

  // File state
  filePath: string | null
  isDirty: boolean
  setFilePath: (path: string | null) => void
  setDirty: (dirty: boolean) => void

  // Add node
  addNode: (type: SkillNodeType, data: Partial<SkillNodeData>, position?: { x: number; y: number }) => string

  // Reset
  reset: () => void
}

// ──────────────────────────────────────────────
// Node Palette item
// ──────────────────────────────────────────────

export interface PaletteItem {
  type: SkillNodeType
  label: string
  icon: string
  color: string
  description: string
}
