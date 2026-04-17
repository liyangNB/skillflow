import { memo, type CSSProperties } from 'react'
import type { SkillNodeType } from '../../types'

// ─── Color mapping ───
export const NODE_COLORS: Record<SkillNodeType, { bg: string; border: string; text: string }> = {
  trigger:    { bg: '#ffc9c9', border: '#ef4444', text: '#991b1b' },
  step:       { bg: '#a5d8ff', border: '#3b82f6', text: '#1e40af' },
  condition:  { bg: '#fff3bf', border: '#eab308', text: '#854d0e' },
  subskill:   { bg: '#d0bfff', border: '#8b5cf6', text: '#5b21b6' },
  output:     { bg: '#b2f2bb', border: '#22c55e', text: '#166534' },
  loop:       { bg: '#ffd8a8', border: '#f97316', text: '#9a3412' },
}

export const NODE_ICONS: Record<SkillNodeType, string> = {
  trigger:  '⚡',
  step:     '🔧',
  condition:'❓',
  subskill: '📦',
  output:   '📤',
  loop:     '🔁',
}

interface BaseNodeProps {
  id?: string
  label: string
  type: SkillNodeType
  style?: CSSProperties
  className?: string
  showHandle?: boolean
  children?: React.ReactNode
  selected?: boolean
}

export const BaseNode = memo(function BaseNode({
  label,
  type,
  style,
  className = '',
  showHandle = true,
  children,
  selected,
}: BaseNodeProps) {
  const colors = NODE_COLORS[type]

  return (
    <div
      className={`skill-node ${className} ${selected ? 'selected' : ''}`}
      style={{
        backgroundColor: colors.bg,
        borderColor: selected ? colors.border : 'transparent',
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 8,
        padding: '10px 14px',
        minWidth: 160,
        minHeight: 52,
        boxShadow: selected
          ? `0 0 0 2px ${colors.border}, 0 4px 12px rgba(0,0,0,0.15)`
          : '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      {showHandle && (
        <div
          style={{
            position: 'absolute',
            left: -7,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: colors.border,
            border: '2px solid #fff',
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 16 }}>{NODE_ICONS[type]}</span>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: colors.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: 130,
        }}>
          {label}
        </span>
      </div>

      {children && (
        <div style={{ marginTop: 6, fontSize: 11, color: colors.text, opacity: 0.8 }}>
          {children}
        </div>
      )}
    </div>
  )
})
