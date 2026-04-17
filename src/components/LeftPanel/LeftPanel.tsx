import { useState, type DragEvent } from 'react'
import { useSkillStore } from '../../store/skillStore'
import type { PaletteItem } from '../../types'
import { NODE_COLORS } from '../nodes'

// ─── Palette items ───
const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'trigger',   label: 'Trigger',   icon: '⚡', color: NODE_COLORS.trigger.bg,   description: 'Entry point' },
  { type: 'step',      label: 'Step',      icon: '🔧', color: NODE_COLORS.step.bg,      description: 'Action step' },
  { type: 'condition', label: 'Condition', icon: '❓', color: NODE_COLORS.condition.bg, description: 'If / Else' },
  { type: 'subskill',  label: 'Sub-Skill', icon: '📦', color: NODE_COLORS.subskill.bg,  description: 'Nested skill' },
  { type: 'output',    label: 'Output',    icon: '📤', color: NODE_COLORS.output.bg,    description: 'Return value' },
  { type: 'loop',      label: 'Loop',      icon: '🔁', color: NODE_COLORS.loop.bg,      description: 'For each item' },
]

function PaletteItemCard({ item }: { item: PaletteItem }) {
  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData('application/skillflow-nodetype', item.type)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: 6,
        cursor: 'grab',
        fontSize: 12,
        fontFamily: 'system-ui, sans-serif',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'
        e.currentTarget.style.cursor = 'grab'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
      title={`Drag to add ${item.label} node`}
    >
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: item.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        flexShrink: 0,
      }}>
        {item.icon}
      </div>
      <div>
        <div style={{ fontWeight: 600, color: '#1e1e1e' }}>{item.label}</div>
        <div style={{ color: '#888', fontSize: 10 }}>{item.description}</div>
      </div>
    </div>
  )
}

export function LeftPanel() {
  const [search, setSearch] = useState('')
  const skills = useSkillStore((s) => s.skills)
  const addSkill = useSkillStore((s) => s.addSkill)
  const addNode = useSkillStore((s) => s.addNode)

  const filtered = skills.filter((sk) =>
    sk.name.toLowerCase().includes(search.toLowerCase()) ||
    sk.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{
      width: 260,
      height: '100%',
      background: '#f5f5f5',
      borderRight: '1px solid #e5e5e5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* ─── Node Palette ─── */}
      <div style={{ padding: '16px 14px 8px', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.05em', marginBottom: 8 }}>
          NODE PALETTE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {PALETTE_ITEMS.map((item) => (
            <PaletteItemCard key={item.type} item={item} />
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#aaa', marginTop: 6, textAlign: 'center' }}>
          ↑ Drag nodes onto the canvas
        </div>
      </div>

      {/* ─── Skill Library ─── */}
      <div style={{ flex: 1, padding: '12px 14px', overflowY: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.05em', marginBottom: 8 }}>
          SKILL LIBRARY
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 6,
          padding: '6px 10px',
          marginBottom: 10,
          gap: 6,
        }}>
          <span style={{ color: '#aaa', fontSize: 12 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 12,
              width: '100%',
              fontFamily: 'system-ui, sans-serif',
            }}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#aaa', fontSize: 12 }}>
            {skills.length === 0
              ? 'No skills yet.\nImport or create one.'
              : 'No matches found.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {filtered.map((sk) => (
              <div
                key={sk.name}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/skillflow-nodetype', 'subskill')
                  e.dataTransfer.setData('application/skillflow-skillname', sk.name)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  background: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: 6,
                  cursor: 'grab',
                  fontSize: 12,
                }}
              >
                <div style={{ fontSize: 18 }}>{sk.icon ?? '📦'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#1e1e1e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sk.name}
                  </div>
                  {sk.tags && sk.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 2 }}>
                      {sk.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{
                          fontSize: 9,
                          background: '#e0e7ff',
                          color: '#3730a3',
                          borderRadius: 10,
                          padding: '1px 6px',
                        }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => addNode('subskill', { label: sk.name, skillName: sk.name, skillPath: sk.name }, { x: 300, y: 200 })}
                  style={{
                    background: '#d0bfff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '3px 6px',
                    fontSize: 10,
                    cursor: 'pointer',
                    color: '#5b21b6',
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: 10,
          border: '1px dashed #ccc',
          borderRadius: 6,
          padding: '10px',
          textAlign: 'center',
          fontSize: 12,
          color: '#888',
          cursor: 'pointer',
        }}
        onClick={() => {
          const name = prompt('Skill name:')
          if (name) {
            addSkill({ name, icon: '🔧', tags: [] })
          }
        }}
        >
          + New Skill
        </div>
      </div>
    </div>
  )
}
