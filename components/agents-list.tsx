import { Card, CardContent } from "@/components/ui/card";
import { AGENT_CONFIGS } from '@/types/agent-config';
import { hasAgentConfig } from '@/utils/storage';

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
  const getConfigurationStatus = (agentId: string) => {
    const configDef = AGENT_CONFIGS.find(config => config.id === agentId);
    if (!configDef) return true; // If no config needed, consider it configured
    return hasAgentConfig(agentId);
  };

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
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg text-white ${
                  activeAgent === agent.id ? 'bg-gray-800' : 'bg-gray-900'
                }`}>
                  {agent.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-white leading-none">{agent.name}</span>
                    {needsConfig && !isConfigured && (
                      <span className="text-xs text-yellow-400 font-semibold leading-none">
                        Needs setup
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-300">{agent.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

