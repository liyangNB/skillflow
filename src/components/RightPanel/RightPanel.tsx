import { useCallback } from 'react'
import { useSkillStore } from '../../store/skillStore'
import type { SkillNodeData } from '../../types'
import { NODE_ICONS } from '../nodes'

// ─── Generic text input ───
function Field({ label, value, onChange, multiline, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4 }}>{label}</div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            minHeight: 80,
            padding: '8px 10px',
            border: '1px solid #e5e5e5',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fafafa',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff' }}
          onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.background = '#fafafa' }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #e5e5e5',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'system-ui, sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
            background: '#fafafa',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#fff' }}
          onBlur={(e) => { e.target.style.borderColor = '#e5e5e5'; e.target.style.background = '#fafafa' }}
        />
      )}
    </div>
  )
}

// ─── Code editor ───
function CodeEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4 }}>Code</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          minHeight: 140,
          padding: '10px',
          border: '1px solid #e5e5e5',
          borderRadius: 6,
          fontSize: 11,
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          background: '#1e1e1e',
          color: '#e5e5e5',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: 1.6,
        }}
        onFocus={(e) => { e.target.style.borderColor = '#3b82f6' }}
        onBlur={(e) => { e.target.style.borderColor = '#e5e5e5' }}
      />
    </div>
  )
}

// ─── Metadata editor ───
function MetadataEditor() {
  const { metadata, setMetadata } = useSkillStore()

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.05em', marginBottom: 12 }}>
        SKILL METADATA
      </div>

      <Field
        label="Name"
        value={metadata.name}
        onChange={(v) => setMetadata({ name: v })}
        placeholder="my-skill"
      />

      <Field
        label="Description"
        value={metadata.description ?? ''}
        onChange={(v) => setMetadata({ description: v })}
        placeholder="What does this skill do?"
      />

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4 }}>Icon</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: '#d0bfff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}>
            {metadata.icon ?? '🔧'}
          </div>
          <input
            value={metadata.icon ?? ''}
            onChange={(e) => setMetadata({ icon: e.target.value })}
            placeholder="🔧"
            style={{
              width: 60,
              padding: '6px 8px',
              border: '1px solid #e5e5e5',
              borderRadius: 6,
              fontSize: 12,
              outline: 'none',
              background: '#fafafa',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666', marginBottom: 4 }}>Tags</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(metadata.tags ?? []).map((tag) => (
            <span key={tag} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              background: '#e0e7ff',
              color: '#3730a3',
              borderRadius: 12,
              padding: '2px 8px',
            }}>
              {tag}
              <button
                onClick={() => setMetadata({ tags: metadata.tags?.filter((t) => t !== tag) })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3730a3', fontSize: 10, padding: 0 }}
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              const tag = prompt('Tag:')
              if (tag && !metadata.tags?.includes(tag)) {
                setMetadata({ tags: [...(metadata.tags ?? []), tag] })
              }
            }}
            style={{
              fontSize: 11,
              background: '#f0f0f0',
              border: '1px dashed #ccc',
              borderRadius: 12,
              padding: '2px 8px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Node editor by type ───
function NodeEditorPanel({ nodeId }: { nodeId: string }) {
  const { nodes, setNodes } = useSkillStore()
  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return null

  const updateData = useCallback(
    (key: keyof SkillNodeData, value: unknown) => {
      setNodes(
        nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, [key]: value } } : n
        )
      )
    },
    [nodes, nodeId, setNodes]
  )

  const { type, data } = node
  const icon = NODE_ICONS[type]

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        padding: '8px 10px',
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e5e5e5',
      }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {type} node
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1e1e1e' }}>
            {data.label}
          </div>
        </div>
      </div>

      <Field
        label="Label"
        value={data.label}
        onChange={(v) => updateData('label', v)}
        placeholder="Node label"
      />

      <Field
        label="Description"
        value={data.description ?? ''}
        onChange={(v) => updateData('description', v)}
        placeholder="What does this step do?"
      />

      {/* ─── Type-specific fields ─── */}
      {type === 'trigger' && (
        <Field
          label="Trigger Expression"
          value={data.triggerExpression ?? ''}
          onChange={(v) => updateData('triggerExpression', v)}
          placeholder='e.g. ON: /pr-review or event: "push"'
        />
      )}

      {(type === 'step' || type === 'loop') && (
        <CodeEditor
          value={data.code ?? ''}
          onChange={(v) => updateData('code', v)}
        />
      )}

      {type === 'condition' && (
        <>
          <Field
            label="Condition Expression"
            value={data.conditionExpression ?? ''}
            onChange={(v) => updateData('conditionExpression', v)}
            placeholder="e.g. result.status === 'success'"
          />
          <div style={{ fontSize: 10, color: '#aaa', marginTop: -8, marginBottom: 12 }}>
            Outputs: <span style={{ color: '#22c55e' }}>T</span> (true) / <span style={{ color: '#ef4444' }}>F</span> (false)
          </div>
        </>
      )}

      {type === 'subskill' && (
        <>
          <Field
            label="Skill Name"
            value={data.skillName ?? ''}
            onChange={(v) => updateData('skillName', v)}
            placeholder="e.g. git-commit"
          />
          <Field
            label="Skill Path"
            value={data.skillPath ?? ''}
            onChange={(v) => updateData('skillPath', v)}
            placeholder="~/.claude/skills/git-commit"
          />
        </>
      )}

      {type === 'output' && (
        <Field
          label="Output Expression"
          value={data.outputExpression ?? ''}
          onChange={(v) => updateData('outputExpression', v)}
          placeholder="e.g. { comment, status }"
          multiline
        />
      )}

      {type === 'loop' && (
        <>
          <Field
            label="Loop Items"
            value={data.loopItems ?? ''}
            onChange={(v) => updateData('loopItems', v)}
            placeholder="e.g. pullRequest.comments"
          />
          <Field
            label="Loop Variable"
            value={data.loopVariable ?? ''}
            onChange={(v) => updateData('loopVariable', v)}
            placeholder="e.g. comment"
          />
        </>
      )}
    </div>
  )
}

// ─── Main RightPanel ───
export function RightPanel() {
  const { selectedNodeId } = useSkillStore()

  return (
    <div style={{
      width: 300,
      height: '100%',
      background: '#f5f5f5',
      borderLeft: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #e5e5e5',
        background: '#fff',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.05em' }}>
          {selectedNodeId ? 'NODE EDITOR' : 'SKILL INFO'}
        </div>
        {selectedNodeId && (
          <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>
            Click canvas to deselect
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
        {selectedNodeId ? (
          <NodeEditorPanel nodeId={selectedNodeId} />
        ) : (
          <MetadataEditor />
        )}
      </div>
    </div>
  )
}
