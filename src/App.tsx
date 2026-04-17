import { ReactFlowProvider } from '@xyflow/react'
import { TopBar } from './components/TopBar'
import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import { SkillCanvas } from './components/Canvas'
import './App.css'

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="app">
        {/* Top Bar */}
        <TopBar />

        {/* Body: Left + Canvas + Right */}
        <div className="body">
          <LeftPanel />
          <div className="canvas">
            <SkillCanvas />
          </div>
          <RightPanel />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
