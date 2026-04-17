# SkillFlow

> Visual drag-and-drop editor for AI Agent Skills. Build, edit, and compose skill workflows like n8n.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)

## Overview

SkillFlow is a visual editor for creating and managing AI Agent Skills — reusable workflow units that power agents like OpenClaw and Hermes.

Instead of writing SKILL.md by hand, you get a canvas where you drag nodes, connect them, and configure properties visually.

## Features

- [x] **Visual Canvas** — Drag-and-drop workflow editor powered by React Flow
- [x] **Skill Parsing** — Import existing SKILL.md files and view them as node graphs
- [x] **Node Editor** — Click any node to edit its properties, parameters, and code
- [x] **Skill Composition** — Drag a Skill into a canvas to use it as a sub-node (nested workflows)
- [x] **Skill Management** — Icon, tags, name, description, search, CRUD
- [x] **Dual Export** — Save as SKILL.md (compatible) or `.skillgraph` (project format)
- [x] **OpenClaw & Hermes** — Direct integration with both platforms

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript + Vite |
| Canvas Engine | [React Flow (@xyflow/react)](https://reactflow.dev/) |
| State Management | Zustand |
| Styling | CSS Modules / Tailwind (planned) |
| Storage | Local file system (SKILL.md) |
| Runtime | Node.js |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/liyangNB/skillflow.git
cd skillflow

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Architecture

```
Frontend (React + React Flow)
    │
    ├── Canvas (drag/drop nodes + edges)
    ├── Node Palette (draggable node types)
    ├── Skill Library (skill browser)
    └── Node Editor (properties panel)
    │
Core Engine (Node.js — optional for CLI mode)
    ├── SKILL.md Parser → Graph Model
    ├── Graph Validator
    └── SKILL.md Serializer ← → .skillgraph JSON
    │
Data Layer
    ├── SKILL.md files (OpenClaw/Hermes compatible)
    └── .skillgraph JSON (project format)
```

## Node Types

| Color | Type | Description |
|-------|------|-------------|
| 🔴 Red | Trigger | Entry point — when this skill is invoked |
| 🔵 Blue | Step | A single action or function call |
| 🟡 Yellow | Condition | Branch logic (if/else) |
| 🟣 Purple | Sub-Skill | Nested skill call (composition) |
| 🟢 Green | Output | Return value or side effect |
| 🟠 Orange | Loop | Iterate over a list |

## Project Status

**Phase 1 (In Progress):** MVP — Canvas + Node Palette + Basic Node Editor

**Phase 2 (Planned):** Skill Library + Metadata CRUD + Icon/Tags

**Phase 3 (Planned):** Sub-Skill composition + OpenClaw/Hermes integration

## Contributing

Contributions welcome! Open an issue first for major changes.

## License

MIT
