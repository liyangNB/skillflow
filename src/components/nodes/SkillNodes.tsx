import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import type { SkillNodeData } from '../../types'

// ─── Trigger Node ───
export const TriggerNode = memo(function TriggerNode(props: NodeProps) {
  const data = props.data as SkillNodeData
  return (
    <BaseNode id={props.id} label={data.label} type="trigger" selected={props.selected}>
      <div style={{ marginTop: 4, fontSize: 10, opacity: 0.75, wordBreak: 'break-all' }}>
        {data.triggerExpression || '⚡ ON: manual'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#ef4444', width: 8, height: 8 }}
      />
    </BaseNode>
  )
})

// ─── Step Node ───
export const StepNode = memo(function StepNode(props: NodeProps) {
  const data = props.data as SkillNodeData
  return (
    <BaseNode id={props.id} label={data.label} type="step" selected={props.selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#3b82f6', width: 8, height: 8 }}
      />
      <div style={{ marginTop: 4, fontSize: 10, opacity: 0.75 }}>
        {data.description || '🔧 Action'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#3b82f6', width: 8, height: 8 }}
      />
    </BaseNode>
  )
})

// ─── Condition Node ───
export const ConditionNode = memo(function ConditionNode(props: NodeProps) {
  const data = props.data as SkillNodeData
  return (
    <BaseNode id={props.id} label={data.label} type="condition" selected={props.selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#eab308', width: 8, height: 8 }}
      />
      <div style={{ marginTop: 4, fontSize: 10, opacity: 0.75 }}>
        {data.conditionExpression || '❓ if / else'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ background: '#22c55e', width: 8, height: 8, top: '40%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ background: '#ef4444', width: 8, height: 8, top: '60%' }}
      />
      <div style={{ position: 'absolute', right: 4, top: '35%', fontSize: 9, color: '#166534' }}>T</div>
      <div style={{ position: 'absolute', right: 4, top: '58%', fontSize: 9, color: '#991b1b' }}>F</div>
    </BaseNode>
  )
})

// ─── SubSkill Node ───
export const SubSkillNode = memo(function SubSkillNode(props: NodeProps) {
  const data = props.data as SkillNodeData
  return (
    <BaseNode id={props.id} label={data.label} type="subskill" selected={props.selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#8b5cf6', width: 8, height: 8 }}
      />
      <div style={{ marginTop: 4, fontSize: 10, opacity: 0.75 }}>
        📦 {data.skillName || data.skillPath || 'sub-skill'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#8b5cf6', width: 8, height: 8 }}
      />
    </BaseNode>
  )
})

// ─── Output Node ───
export const OutputNode = memo(function OutputNode(props: NodeProps) {
  const data = props.data as SkillNodeData
  return (
    <BaseNode id={props.id} label={data.label} type="output" selected={props.selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#22c55e', width: 8, height: 8 }}
      />
      <div style={{ marginTop: 4, fontSize: 10, opacity: 0.75 }}>
        {data.outputExpression || '📤 return'}
      </div>
    </BaseNode>
  )
})

// ─── Loop Node ───
export const LoopNode = memo(function LoopNode(props: NodeProps) {
  const data = props.data as SkillNodeData
  return (
    <BaseNode id={props.id} label={data.label} type="loop" selected={props.selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#f97316', width: 8, height: 8 }}
      />
      <div style={{ marginTop: 4, fontSize: 10, opacity: 0.75 }}>
        🔁 {data.loopVariable ? `as ${data.loopVariable}` : 'for each'}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#f97316', width: 8, height: 8 }}
      />
    </BaseNode>
  )
})
