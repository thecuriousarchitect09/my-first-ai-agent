'use client'

import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
} from 'reactflow'

import 'reactflow/dist/style.css'

interface Props {
  nodes: Node[]
  edges: Edge[]
}

export default function ArchitectureFlow({
  nodes,
  edges,
}: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '700px',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}