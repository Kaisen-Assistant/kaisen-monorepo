export type AgentConfigField = {
  key: string;
  label: string;
  type: 'text' | 'password';
  required: boolean;
  description?: string;
};

export type AgentConfig = {
  [key: string]: string;
};

export type AgentConfigDefinition = {
  id: string;
  name: string;
  fields: AgentConfigField[];
};

export const AGENT_CONFIGS: AgentConfigDefinition[] = [
  {
    id: 'twitter-agent',
    name: 'Twitter Trends',
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        description: 'Twitter API Key from your Twitter Developer Account'
      },
      {
        key: 'api_secret',
        label: 'API Secret',
        type: 'password',
        required: true,
        description: 'Twitter API Secret from your Twitter Developer Account'
      }
    ]
  },
  {
    id: 'finance-agent',
    name: 'Finance Agent',
    fields: [
      {
        key: 'alpha_vantage_key',
        label: 'Alpha Vantage API Key',
        type: 'password',
        required: true,
        description: 'API Key for accessing financial data'
      }
    ]
  },
  {
    id: 'search-agent',
    name: 'Web Search',
    fields: [
      {
        key: 'google_api_key',
        label: 'Google API Key',
        type: 'password',
        required: true,
        description: 'Google Custom Search API Key'
      },
      {
        key: 'search_engine_id',
        label: 'Search Engine ID',
        type: 'text',
        required: true,
        description: 'Google Custom Search Engine ID'
      }
    ]
  }
]; 