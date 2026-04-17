import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  addEdge,
  type OnConnect,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useSkillStore } from '../../store/skillStore'
import {
  TriggerNode,
  StepNode,
  ConditionNode,
  SubSkillNode,
  OutputNode,
  LoopNode,
} from '../nodes'
import type { SkillNodeType } from '../../types'

// ─── Node type map ───
const nodeTypes: NodeTypes = {
  trigger:   TriggerNode as any,
  step:      StepNode as any,
  condition: ConditionNode as any,
  subskill:  SubSkillNode as any,
  output:    OutputNode as any,
  loop:      LoopNode as any,
}

export function SkillCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setEdges,
    setSelectedNodeId,
    addNode,
  } = useSkillStore()

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges(addEdge(connection, edges))
    },
    [edges, setEdges]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNodeId(node.id)
    },
    [setSelectedNodeId]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])

  // ─── Handle drop from palette ───
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/skillflow-nodetype') as SkillNodeType
      if (!type) return

      const reactFlowBounds = event.currentTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left - 80,
        y: event.clientY - reactFlowBounds.top - 26,
      }

      addNode(type, { label: type }, position)
    },
    [addNode]
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange as any}
        onEdgesChange={onEdgesChange as any}
        onConnect={onConnect as any}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
        style={{ background: '#fafafa' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#e2e8f0"
        />
        <Controls
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
          }}
        />
        <MiniMap
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
          }}
          nodeColor={(node) => {
            const map: Record<string, string> = {
              trigger:   '#ffc9c9',
              step:      '#a5d8ff',
              condition: '#fff3bf',
              subskill:  '#d0bfff',
              output:    '#b2f2bb',
              loop:      '#ffd8a8',
            }
            return map[node.type as string] ?? '#e5e5e5'
          }}
        />
      </ReactFlow>
    </div>
  )
}
