"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Send, Settings, Bell, Search, Twitter, CreditCard, Plus, Loader2 } from "lucide-react"
import AgentsList from "@/components/agents-list"
import ChatMessage from "@/components/chat-message"
import VoiceWaveform from "@/components/voice-waveform"
import { hasAgentConfig } from '@/utils/storage';
import { AGENT_CONFIGS } from '@/types/agent-config';

// Sample data for demonstration
type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  agent: string | null;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm Kaisen Assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 60000),
    agent: null,
  },
]

const availableAgents = [
  {
    id: "twitter-agent",
    name: "Twitter Trends",
    description: "Monitors Twitter for trending topics and provides real-time updates",
    icon: <Twitter className="h-4 w-4" />,
    active: true,
  },
  {
    id: "finance-agent",
    name: "Finance Agent",
    description: "Makes financial decisions and executes trades based on market conditions",
    icon: <CreditCard className="h-4 w-4" />,
    active: true,
  },
  {
    id: "reminder-agent",
    name: "Reminder Agent",
    description: "Sets and manages reminders and sends push notifications",
    icon: <Bell className="h-4 w-4" />,
    active: true,
  },
  {
    id: "search-agent",
    name: "Web Search",
    description: "Searches the internet for information on any topic",
    icon: <Search className="h-4 w-4" />,
    active: true,
  },
]

export default function KaisenAssistant() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false)
  const [activeAgent, setActiveAgent] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]) //Corrected dependency

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      agent: null,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate assistant thinking/processing
    setActiveAgent("processing")

    // Simulate response after delay
    setTimeout(() => {
      handleAssistantResponse(inputValue)
    }, 1500)
  }

  const handleAssistantResponse = (userInput: string) => {
    let responseAgent = null;
    let responseContent = "";

    // Check agent configuration before using them
    const getAgentResponse = (agentId: string, content: string): { agent: string | null, content: string } => {
      const needsConfig = AGENT_CONFIGS.some(config => config.id === agentId);
      if (needsConfig && !hasAgentConfig(agentId)) {
        return {
          agent: agentId,
          content: `I need to be configured before I can help with this request. Please click the settings icon next to my name in the agents list to set up the required configuration.`
        };
      }
      return { agent: agentId, content };
    };

    // Simple keyword matching to simulate agent selection
    if (userInput.toLowerCase().includes("twitter") || userInput.toLowerCase().includes("trend")) {
      const response = getAgentResponse("twitter-agent", 
        "I'm checking the latest Twitter trends for you. Currently, #AI and #MachineLearning are trending topics in the tech space.");
      responseAgent = response.agent;
      responseContent = response.content;
    } else if (
      userInput.toLowerCase().includes("buy") ||
      userInput.toLowerCase().includes("invest") ||
      userInput.toLowerCase().includes("coin")
    ) {
      const response = getAgentResponse("finance-agent",
        "I've analyzed the market conditions. Based on current trends, I recommend waiting before making any purchases. I'll notify you when market conditions are favorable.");
      responseAgent = response.agent;
      responseContent = response.content;
    } else if (userInput.toLowerCase().includes("remind") || userInput.toLowerCase().includes("notification")) {
      responseAgent = "reminder-agent";
      responseContent = "I've set a reminder for you. You'll receive a notification at the specified time.";
    } else if (userInput.toLowerCase().includes("search") || userInput.toLowerCase().includes("who is")) {
      const response = getAgentResponse("search-agent",
        "I'm searching the web for that information. Here's what I found: [Search results would appear here]");
      responseAgent = response.agent;
      responseContent = response.content;
    } else {
      responseContent = "I understand your request. How else can I assist you today?";
    }

    setActiveAgent(responseAgent);

    // Add assistant response
    const assistantMessage: Message = {
      id: Date.now(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
      agent: responseAgent,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Simulate voice response
    setIsAssistantSpeaking(true);
    setTimeout(() => {
      setIsAssistantSpeaking(false);
      setActiveAgent(null);
    }, 3000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real implementation, this would start/stop voice recording
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-black border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Kaisen" />
            <AvatarFallback className="bg-gray-900 text-white">KA</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-white">Kaisen Assistant</h1>
            <p className="text-xs text-gray-400">Your personal AI companion</p>
          </div>
        </div>

        <Tabs defaultValue="agents" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-2 bg-gray-900">
            <TabsTrigger value="agents" className="data-[state=active]:bg-black">Agents</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-black">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="flex-1 p-4 pt-2">
            <AgentsList agents={availableAgents} activeAgent={activeAgent} />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <div className="text-gray-300">
              <h3 className="font-medium mb-2">Assistant Settings</h3>
              <div className="space-y-2 text-sm">
                <p>Voice: Female (Default)</p>
                <p>Language: English</p>
                <p>Notification Sound: Enabled</p>
                <p>Auto-Response: Enabled</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-black">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-white">Chat</h2>
            {isAssistantSpeaking && (
              <Badge variant="outline" className="ml-2 bg-gray-900/30 text-gray-300 border-gray-700">
                Speaking
              </Badge>
            )}
            {isRecording && (
              <Badge variant="outline" className="ml-2 bg-red-900/30 text-red-300 border-red-700">
                Recording
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isAssistantSpeaking={isAssistantSpeaking && message.id === messages[messages.length - 1].id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Active Agent Card */}
        {activeAgent === "processing" && (
          <Card className="mx-4 mb-4 bg-black border-gray-800">
            <CardContent className="p-3 flex items-center">
              <Loader2 className="h-5 w-5 text-gray-500 animate-spin mr-2" />
              <span className="text-gray-300">Kaisen is thinking...</span>
            </CardContent>
          </Card>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-black">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={`${isRecording ? "bg-red-900/30 text-red-300 border-red-700" : "text-gray-400 border-gray-800"}`}
              onClick={toggleRecording}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <div className="relative flex-1">
              <Input
                placeholder="Message Kaisen Assistant..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
              />
              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-md">
                  <VoiceWaveform />
                </div>
              )}
            </div>

            <Button
              variant="default"
              size="icon"
              className="bg-black hover:bg-gray-900 border border-gray-800"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && !isRecording}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

