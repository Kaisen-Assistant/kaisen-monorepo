import { AgentConfig } from '@/types/agent-config';

const STORAGE_KEY_PREFIX = 'kaisen_agent_config_';

// Simple encryption/decryption using base64 for storage
// In a production environment, you'd want to use a more secure encryption method
const encrypt = (text: string): string => {
  return btoa(text);
};

const decrypt = (text: string): string => {
  return atob(text);
};

export const saveAgentConfig = (agentId: string, config: AgentConfig): void => {
  const encryptedConfig = encrypt(JSON.stringify(config));
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${agentId}`, encryptedConfig);
};

export const getAgentConfig = (agentId: string): AgentConfig | null => {
  const encryptedConfig = localStorage.getItem(`${STORAGE_KEY_PREFIX}${agentId}`);
  if (!encryptedConfig) return null;
  
  try {
    return JSON.parse(decrypt(encryptedConfig));
  } catch (error) {
    console.error('Error decoding agent config:', error);
    return null;
  }
};

export const deleteAgentConfig = (agentId: string): void => {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${agentId}`);
};

export const hasAgentConfig = (agentId: string): boolean => {
  return !!localStorage.getItem(`${STORAGE_KEY_PREFIX}${agentId}`);
}; 