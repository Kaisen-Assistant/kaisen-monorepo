import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgentConfigDefinition, AgentConfig } from '@/types/agent-config';
import { saveAgentConfig, getAgentConfig } from '@/utils/storage';

interface AgentConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentConfig: AgentConfigDefinition;
  onConfigured: () => void;
}

export default function AgentConfigDialog({
  open,
  onOpenChange,
  agentConfig,
  onConfigured
}: AgentConfigDialogProps) {
  const [formData, setFormData] = useState<AgentConfig>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (open) {
      const savedConfig = getAgentConfig(agentConfig.id);
      if (savedConfig) {
        setFormData(savedConfig);
      } else {
        setFormData({});
      }
      setError('');
    }
  }, [open, agentConfig.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = agentConfig.fields
      .filter(field => field.required && !formData[field.key])
      .map(field => field.label);

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Save configuration
    saveAgentConfig(agentConfig.id, formData);
    onConfigured();
    onOpenChange(false);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Configure {agentConfig.name}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the required configuration details for this agent to function properly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {agentConfig.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="bg-slate-700 border-slate-600"
              />
              {field.description && (
                <p className="text-xs text-slate-400">{field.description}</p>
              )}
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-600"
            >
              Cancel
            </Button>
            <Button type="submit">Save Configuration</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 