'use client'

import { useState } from 'react'

import ArchitectureFlow from './components/ArchitectureFlow'

export default function Home() {
  const [requirement, setRequirement] =
    useState('')

  const [nodes, setNodes] =
    useState<any[]>([])

  const [edges, setEdges] =
    useState<any[]>([])

  const [review, setReview] =
    useState<any>()

  const [loading, setLoading] =
    useState(false)

  async function generate() {
    try {
      setLoading(true)

      const response = await fetch(
        '/api/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            requirement,
          }),
        }
      )

      const data =
        await response.json()

      const flowNodes =
        data.nodes.map(
          (
            node: any,
            index: number
          ) => ({
            id: node.id,
            position: {
              x:
                (index % 3) *
                250,
              y:
                Math.floor(
                  index / 3
                ) * 180,
            },
            data: {
              label: node.label,
            },
          })
        )

      const flowEdges =
        data.edges.map(
          (
            edge: any,
            index: number
          ) => ({
            id: `e-${index}`,
            source:
              edge.source,
            target:
              edge.target,
          })
        )

      setNodes(flowNodes)
      setEdges(flowEdges)

      setReview(data.review)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        padding: '32px',
        display: 'grid',
        gridTemplateColumns:
          '350px 1fr',
        gap: '24px',
        minHeight: '100vh',
      }}
    >
      <div>
        <h1>
          AI Architecture Copilot
        </h1>

        <textarea
          rows={12}
          style={{
            width: '100%',
          }}
          value={requirement}
          onChange={(e) =>
            setRequirement(
              e.target.value
            )
          }
        />

        <button
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? 'Generating...'
            : 'Generate'}
        </button>

        {review && (
          <>
            <h3>
              Strengths
            </h3>
            <ul>
              {review.strengths?.map(
                (
                  item: string
                ) => (
                  <li key={item}>
                    {item}
                  </li>
                )
              )}
            </ul>

            <h3>Risks</h3>
            <ul>
              {review.risks?.map(
                (
                  item: string
                ) => (
                  <li key={item}>
                    {item}
                  </li>
                )
              )}
            </ul>

            <h3>
              Recommendations
            </h3>
            <ul>
              {review.recommendations?.map(
                (
                  item: string
                ) => (
                  <li key={item}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </>
        )}
      </div>

      <ArchitectureFlow
        nodes={nodes}
        edges={edges}
      />
    </main>
  )
}