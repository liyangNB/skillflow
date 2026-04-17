import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange } from '@xyflow/react'
import type { SkillStore, SkillMetadata, SkillNode, SkillNodeData, SkillNodeType } from '../types'
import { nanoid } from './nanoid'

const defaultMetadata: SkillMetadata = {
  name: 'untitled-skill',
  description: '',
  icon: '🔧',
  tags: [],
  trigger: 'manual',
}

export const useSkillStore = create<SkillStore>((set, get) => ({
  // ─── Metadata ───
  metadata: { ...defaultMetadata },

  setMetadata: (meta) =>
    set((s) => ({ metadata: { ...s.metadata, ...meta }, isDirty: true })),

  // ─── Nodes ───
  nodes: [],

  setNodes: (nodes) => set({ nodes, isDirty: true }),

  onNodesChange: (changes: NodeChange<SkillNode>[]) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes), isDirty: true })),

  // ─── Edges ───
  edges: [],

  setEdges: (edges) => set({ edges, isDirty: true }),

  onEdgesChange: (changes: EdgeChange[]) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges), isDirty: true })),

  // ─── Selection ───
  selectedNodeId: null,
  setSelectedNodeId: (id) => {
    const node = id ? get().nodes.find((n) => n.id === id) ?? null : null
    set({ selectedNodeId: id, selectedNode: node })
  },
  selectedNode: null,

  // ─── Skill Library ───
  skills: [],

  addSkill: (skill) =>
    set((s) => ({ skills: [...s.skills, skill] })),

  removeSkill: (name) =>
    set((s) => ({ skills: s.skills.filter((sk) => sk.name !== name) })),

  // ─── File ───
  filePath: null,
  isDirty: false,
  setFilePath: (path) => set({ filePath: path }),
  setDirty: (dirty) => set({ isDirty: dirty }),

  // ─── Reset ───
  reset: () =>
    set({
      metadata: { ...defaultMetadata },
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedNode: null,
      filePath: null,
      isDirty: false,
    }),

  // ─── Convenience: add a node ───
  addNode: (type: SkillNodeType, data: Partial<SkillNodeData>, position?: { x: number; y: number }) => {
    const id = nanoid()
    const newNode: SkillNode = {
      id,
      type,
      position: position ?? { x: 250, y: 250 },
      data: {
        label: type,
        ...data,
      },
    }
    set((s) => ({ nodes: [...s.nodes, newNode], isDirty: true }))
    return id
  },
}))

// ─── Selector helpers ───
export const selectSelectedNode = (s: SkillStore) =>
  s.selectedNodeId ? s.nodes.find((n) => n.id === s.selectedNodeId) ?? null : null
