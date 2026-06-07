import { NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_URL!
const OLLAMA_MODEL = process.env.OLLAMA_MODEL!

function extractJson(text: string) {
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  return JSON.parse(
    cleaned.substring(start, end + 1)
  )
}

export async function POST(req: Request) {
  try {
    const { requirement } = await req.json()

    const prompt = `
You are a senior software architect and distributed systems designer.

Convert the given requirement into a deeply detailed, multi-level architecture graph.

You must produce a hierarchical architecture that can represent N-level decomposition (system → subsystems → services → internal modules).

Return ONLY valid JSON. No markdown, no explanations.

========================
OUTPUT SCHEMA
========================

{
  "nodes": [
    {
      "id": "unique-id",
      "label": "Human readable name",
      "type": "system | service | module | database | queue | cache | external | frontend | backend | agent | api",
      "level": 0,
      "parentId": "optional-parent-node-id",
      "position": { "x": 0, "y": 0 },
      "metadata": {
        "description": "what this component does",
        "tech": ["optional tech stack"],
        "responsibilities": ["key responsibilities"]
      }
    }
  ],
  "edges": [
    {
      "id": "edge-id",
      "source": "node-id",
      "target": "node-id",
      "type": "data-flow | control-flow | async | sync | event",
      "label": "optional label"
    }
  ],
  "hierarchy": {
    "maxDepth": "number",
    "tree": {
      "nodeId": "root",
      "children": []
    }
  },
  "review": {
    "architectureStyle": "microservices | monolith | event-driven | hybrid",
    "strengths": [
      "..."
    ],
    "risks": [
      "..."
    ],
    "bottlenecks": [
      "..."
    ],
    "recommendations": [
      "..."
    ],
    "scalabilityNotes": [
      "..."
    ]
  }
}

========================
RULES
========================

1. MUST support N-level nesting:
   - System → Subsystems → Services → Modules → Submodules
   - Use parentId to represent hierarchy
   - Each level must be decomposed meaningfully

2. MUST include real-world architecture components:
   - Frontend (web/mobile)
   - API Gateway
   - Backend services
   - Databases (SQL + NoSQL)
   - Cache layer
   - Message queues / event bus
   - External integrations
   - Optional AI/LLM agents if relevant

3. Layout rules:
   - Assign "level" (0 = root, deeper = more detailed)
   - Keep IDs unique and stable
   - Ensure edges only connect valid node IDs

4. Edge rules:
   - Use async edges for queues/events
   - Use sync for API calls
   - Clearly label communication type

5. Depth requirement:
   - MUST NOT stop at high-level architecture
   - MUST break at least 3 levels deep where applicable
   - Example:
     System → Auth Service → Token Module → Refresh Token Handler

6. Include a hierarchy tree:
   - Must reflect full nested structure
   - Should match nodes exactly

7. Review section:
   - Analyze scalability
   - Identify risks and bottlenecks
   - Suggest improvements

========================
EXAMPLE NODE (DO NOT COPY EXACTLY)
========================

{
  "id": "auth-token-service",
  "label": "Token Service",
  "type": "service",
  "level": 2,
  "parentId": "auth-service",
  "metadata": {
    "description": "Handles JWT and refresh tokens",
    "tech": ["Node.js", "Redis"],
    "responsibilities": ["token generation", "token validation"]
  }
}

========================
INPUT REQUIREMENT
========================

${requirement}
`;

    const response = await fetch(
      `${OLLAMA_URL}/api/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
        }),
      }
    )

    const data = await response.json()

    const architecture =
      extractJson(data.response)

    return NextResponse.json(
      architecture
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          'Failed to generate architecture',
      },
      {
        status: 500,
      }
    )
  }
}