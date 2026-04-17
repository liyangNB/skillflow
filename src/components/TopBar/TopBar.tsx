import { useSkillStore } from '../../store/skillStore'
import { serializeSkill, deserializeSkill } from '../../parser/serializer'

export function TopBar() {
  const { metadata, nodes, edges, isDirty, reset, setMetadata, setNodes, setEdges } = useSkillStore()

  const handleNew = () => {
    if (isDirty && !confirm('Discard unsaved changes?')) return
    reset()
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.skillgraph,.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const { meta, nodes: ns, edges: es } = deserializeSkill(text, file.name)
        setMetadata(meta)
        setNodes(ns)
        setEdges(es)
      } catch (err) {
        alert(`Import failed: ${err}`)
      }
    }
    input.click()
  }

  const handleExport = () => {
    const { name } = metadata
    const skillgraph = serializeSkill({ metadata, nodes, edges })
    const blob = new Blob([skillgraph], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.skillgraph`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveSKILL = () => {
    const skillmd = serializeSkill({ metadata, nodes, edges }, 'skillmd')
    const blob = new Blob([skillmd], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SKILL.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{
      height: 56,
      background: '#1e1e1e',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      fontFamily: 'system-ui, sans-serif',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        fontSize: 18,
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.02em',
        marginRight: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span>⚡</span>
        <span>SkillFlow</span>
      </div>

      <div style={{ width: 1, height: 24, background: '#333', margin: '0 4px' }} />

      {/* Skill name */}
      <div style={{
        fontSize: 13,
        color: '#aaa',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        📝
        <span style={{ color: '#fff', fontWeight: 600 }}>{metadata.name}</span>
        {isDirty && <span style={{ color: '#f97316', fontSize: 11 }}>●</span>}
      </div>

      <div style={{ flex: 1 }} />

      {/* Buttons */}
      <TopBtn label="New" onClick={handleNew} />
      <TopBtn label="Import" onClick={handleImport} />
      <TopBtn label="Export .skillgraph" onClick={handleExport} secondary />
      <TopBtn label="Export SKILL.md" onClick={handleSaveSKILL} secondary />
      <TopBtn label="💾 Save" onClick={handleSaveSKILL} primary />
    </div>
  )
}

function TopBtn({ label, onClick, primary, secondary }: {
  label: string
  onClick: () => void
  primary?: boolean
  secondary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 6,
        border: 'none',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'system-ui, sans-serif',
        background: primary ? '#22c55e' : secondary ? '#3d3d3d' : '#3d3d3d',
        color: primary ? '#fff' : '#ccc',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        if (primary) e.currentTarget.style.background = '#16a34a'
        else e.currentTarget.style.background = '#525252'
      }}
      onMouseLeave={(e) => {
        if (primary) e.currentTarget.style.background = '#22c55e'
        else e.currentTarget.style.background = '#3d3d3d'
      }}
    >
      {label}
    </button>
  )
}
