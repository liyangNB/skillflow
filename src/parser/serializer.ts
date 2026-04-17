import type { SkillMetadata, SkillNode, SkillGraph } from '../types'

// ──────────────────────────────────────────────
// SKILL.md Parser
// ──────────────────────────────────────────────

export function parseSkillMD(content: string): {
  metadata: SkillMetadata
  nodes: SkillNode[]
  edges: any[]
} {
  const lines = content.split('\n')

  if (!lines[0]?.startsWith('---')) {
    throw new Error('Invalid SKILL.md: missing frontmatter')
  }

  let frontmatterEnd = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { frontmatterEnd = i; break }
  }
  if (frontmatterEnd === -1) throw new Error('Invalid SKILL.md: unclosed frontmatter')

  const yamlStr = lines.slice(1, frontmatterEnd).join('\n')
  const yaml = parseYAML(yamlStr) as Record<string, unknown>

  const steps = (yaml['steps'] ?? []) as any[]
  const nodes: SkillNode[] = []
  const edges: any[] = []

  // Trigger node
  nodes.push({
    id: 'trigger-0',
    type: 'trigger',
    position: { x: 50, y: 200 },
    data: {
      label: 'Trigger',
      triggerExpression: (yaml['trigger'] as string) ?? 'manual',
    },
  })

  let prevId = 'trigger-0'

  steps.forEach((step: any, idx: number) => {
    const id = `step-${idx}`
    nodes.push({
      id,
      type: 'step',
      position: { x: 280 + idx * 220, y: 200 },
      data: {
        label: step.name ?? `Step ${idx + 1}`,
        description: step.description ?? '',
        code: step.code ?? '',
        parameters: step.parameters ?? [],
      },
    })
    edges.push({
      id: `e-${prevId}-${id}`,
      source: prevId,
      target: id,
      type: 'smoothstep',
      animated: false,
    })
    prevId = id
  })

  if (steps.length > 0) {
    const outId = `output-${steps.length}`
    nodes.push({
      id: outId,
      type: 'output',
      position: { x: 280 + steps.length * 220, y: 200 },
      data: { label: 'Output', outputExpression: 'return result' },
    })
    edges.push({
      id: `e-${prevId}-${outId}`,
      source: prevId,
      target: outId,
      type: 'smoothstep',
      animated: false,
    })
  }

  return {
    metadata: {
      name: (yaml['name'] as string) ?? 'untitled',
      description: (yaml['description'] as string) ?? '',
      icon: (yaml['icon'] as string) ?? '🔧',
      tags: (yaml['tags'] as string[]) ?? [],
      trigger: yaml['trigger'] as string | undefined,
    },
    nodes,
    edges,
  }
}

// ──────────────────────────────────────────────
// SKILL.md Serializer
// ──────────────────────────────────────────────

export function serializeSkillMD(
  meta: SkillMetadata,
  nodes: SkillNode[]
): string {
  const stepNodes = nodes.filter((n) => n.type === 'step')
  const steps = stepNodes.map((n) => ({
    name: n.data.label,
    description: n.data.description ?? '',
    code: n.data.code ?? '',
    parameters: n.data.parameters ?? [],
  }))

  const frontmatter: string[] = [
    `name: ${jsonDump(meta.name)}`,
    `description: ${jsonDump(meta.description ?? '')}`,
    `icon: ${jsonDump(meta.icon ?? '🔧')}`,
    `tags: [${(meta.tags ?? []).map((t) => jsonDump(t)).join(', ')}]`,
    `trigger: ${jsonDump(meta.trigger ?? 'manual')}`,
  ]

  if (steps.length > 0) {
    frontmatter.push('steps:')
    for (const step of steps) {
      frontmatter.push(`  - name: ${jsonDump(step.name)}`)
      if (step.description) {
        frontmatter.push(`    description: ${jsonDump(step.description)}`)
      }
      if (step.code) {
        frontmatter.push(`    code: |`)
        for (const line of step.code.split('\n')) {
          frontmatter.push(`      ${line}`)
        }
      }
      if (step.parameters && step.parameters.length > 0) {
        frontmatter.push(`    parameters:`)
        for (const p of step.parameters) {
          frontmatter.push(`      - name: ${jsonDump(p.name)}`)
          frontmatter.push(`        type: ${p.type}`)
          frontmatter.push(`        required: ${p.required}`)
        }
      }
    }
  }

  return `---\n${frontmatter.join('\n')}\n---\n`
}

function jsonDump(val: unknown): string {
  if (val === null || val === undefined) return 'null'
  if (typeof val === 'string') return `"${val.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  return JSON.stringify(val)
}

// ──────────────────────────────────────────────
// .skillgraph JSON Serializer / Parser
// ──────────────────────────────────────────────

export function serializeSkill(
  data: { metadata: SkillMetadata; nodes: SkillNode[]; edges: any[] },
  format?: 'skillmd'
): string {
  if (format === 'skillmd') {
    return serializeSkillMD(data.metadata, data.nodes)
  }

  const graph: SkillGraph = {
    version: '1.0.0',
    source: 'skillflow',
    metadata: data.metadata,
    nodes: data.nodes,
    edges: data.edges,
  }

  return JSON.stringify(graph, null, 2)
}

export function deserializeSkill(text: string, filename: string): {
  meta: SkillMetadata
  nodes: SkillNode[]
  edges: any[]
} {
  if (filename.endsWith('.md') || filename.endsWith('SKILL.md')) {
    const result = parseSkillMD(text)
    return { meta: result.metadata, nodes: result.nodes, edges: result.edges }
  }
  const graph = JSON.parse(text) as SkillGraph
  return {
    meta: graph.metadata,
    nodes: graph.nodes,
    edges: graph.edges,
  }
}

// ──────────────────────────────────────────────
// Minimal YAML parser
// ──────────────────────────────────────────────

function parseYAML(yamlStr: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const lines = yamlStr.split('\n')
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()

    if (!line || line.startsWith('#')) { i++; continue }

    // Array item under current key
    if (line.startsWith('- ')) {
      const key = result._lastKey as string
      if (!Array.isArray(result[key])) result[key] = []
      const itemStr = line.slice(2)
      ;(result[key] as unknown[]).push(parseValue(itemStr))
      i++; continue
    }

    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) { i++; continue }

    const key = line.slice(0, colonIdx).trim()
    const rest = line.slice(colonIdx + 1).trim()
    result._lastKey = key

    if (!rest) {
      // Check for block scalar
      if (i + 1 < lines.length && lines[i + 1]?.match(/^ {2,}\S/)) {
        i++
        const blockLines: string[] = []
        while (i < lines.length && lines[i]?.match(/^ {2,}\S/)) {
          blockLines.push(lines[i].slice(2))
          i++
        }
        result[key] = blockLines.join('\n')
        continue
      }
      result[key] = null
    } else {
      result[key] = parseValue(rest)
    }
    i++
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _lastKey: _skip, ...rest } = result
  void _skip
  return rest
}

function parseValue(val: string): unknown {
  if (val === 'true') return true
  if (val === 'false') return false
  if (val === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val)
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }
  return val
}
