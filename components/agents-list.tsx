import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  active: boolean
}

interface AgentsListProps {
  agents: Agent[]
  activeAgent: string | null
}

export default function AgentsList({ agents, activeAgent }: AgentsListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">Available Agents</h3>

      {agents.map((agent) => (
        <Card
          key={agent.id}
          className={`bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors ${
            activeAgent === agent.id ? "ring-1 ring-purple-500" : ""
          }`}
        >
          <CardHeader className="p-3 pb-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-slate-700 p-1.5 rounded-md text-purple-400">{agent.icon}</div>
                <CardTitle className="text-sm text-white">{agent.name}</CardTitle>
              </div>

              {activeAgent === agent.id ? (
                <Loader2 className="h-3 w-3 text-purple-500 animate-spin" />
              ) : (
                <Badge variant="outline" className="text-xs bg-green-900/20 border-green-800 text-green-400">
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <CardDescription className="text-xs text-slate-400">{agent.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

