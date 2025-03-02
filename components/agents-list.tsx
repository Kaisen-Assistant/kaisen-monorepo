import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { AGENT_CONFIGS } from '@/types/agent-config';
import { hasAgentConfig } from '@/utils/storage';
import AgentConfigDialog from './agent-config-dialog';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
}

interface AgentsListProps {
  agents: Agent[];
  activeAgent: string | null;
}

export default function AgentsList({ agents, activeAgent }: AgentsListProps) {
  const [selectedConfigAgent, setSelectedConfigAgent] = useState<string | null>(null);

  const getConfigurationStatus = (agentId: string) => {
    const configDef = AGENT_CONFIGS.find(config => config.id === agentId);
    if (!configDef) return true; // If no config needed, consider it configured
    return hasAgentConfig(agentId);
  };

  const handleConfigureClick = (agentId: string) => {
    setSelectedConfigAgent(agentId);
  };

  const selectedAgentConfig = selectedConfigAgent 
    ? AGENT_CONFIGS.find(config => config.id === selectedConfigAgent)
    : null;

  return (
    <div className="space-y-2">
      {agents.map((agent) => {
        const isConfigured = getConfigurationStatus(agent.id);
        const needsConfig = AGENT_CONFIGS.some(config => config.id === agent.id);

        return (
          <Card
            key={agent.id}
            className={`
              border-gray-800 bg-black hover:bg-gray-900/50 transition-colors
              ${activeAgent === agent.id ? 'ring-2 ring-gray-700' : ''}
            `}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  activeAgent === agent.id ? 'bg-gray-800' : 'bg-gray-900'
                }`}>
                  {agent.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white flex items-center">
                    {agent.name}
                    {needsConfig && !isConfigured && (
                      <span className="ml-2 text-xs text-yellow-500">
                        Needs setup
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400">{agent.description}</p>
                </div>
              </div>

              {needsConfig && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`shrink-0 ${
                    isConfigured ? 'text-green-500' : 'text-yellow-500'
                  } hover:bg-gray-900`}
                  onClick={() => handleConfigureClick(agent.id)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}

      {selectedAgentConfig && (
        <AgentConfigDialog
          open={true}
          onOpenChange={(open) => !open && setSelectedConfigAgent(null)}
          agentConfig={selectedAgentConfig}
          onConfigured={() => {
            // You might want to trigger a refresh of the agent list or update UI
          }}
        />
      )}
    </div>
  );
}

