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
    let responseAgent = null
    let responseContent = ""

    // Simple keyword matching to simulate agent selection
    if (userInput.toLowerCase().includes("twitter") || userInput.toLowerCase().includes("trend")) {
      responseAgent = "twitter-agent"
      responseContent =
        "I'm checking the latest Twitter trends for you. Currently, #AI and #MachineLearning are trending topics in the tech space."
    } else if (
      userInput.toLowerCase().includes("buy") ||
      userInput.toLowerCase().includes("invest") ||
      userInput.toLowerCase().includes("coin")
    ) {
      responseAgent = "finance-agent"
      responseContent =
        "I've analyzed the market conditions. Based on current trends, I recommend waiting before making any purchases. I'll notify you when market conditions are favorable."
    } else if (userInput.toLowerCase().includes("remind") || userInput.toLowerCase().includes("notification")) {
      responseAgent = "reminder-agent"
      responseContent = "I've set a reminder for you. You'll receive a notification at the specified time."
    } else if (userInput.toLowerCase().includes("search") || userInput.toLowerCase().includes("who is")) {
      responseAgent = "search-agent"
      responseContent =
        "I'm searching the web for that information. Here's what I found: [Search results would appear here]"
    } else {
      responseContent = "I understand your request. How else can I assist you today?"
    }

    setActiveAgent(responseAgent)

    // Add assistant response
    const assistantMessage: Message = {
      id: Date.now(),
      role: "assistant",
      content: responseContent,
      timestamp: new Date(),
      agent: responseAgent,
    }

    setMessages((prev) => [...prev, assistantMessage])

    // Simulate voice response
    setIsAssistantSpeaking(true)
    setTimeout(() => {
      setIsAssistantSpeaking(false)
      setActiveAgent(null)
    }, 3000)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real implementation, this would start/stop voice recording
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center space-x-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Kaisen" />
            <AvatarFallback className="bg-purple-700 text-white">KA</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-white">Kaisen Assistant</h1>
            <p className="text-xs text-slate-400">Your personal AI companion</p>
          </div>
        </div>

        <Tabs defaultValue="agents" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="flex-1 p-4 pt-2">
            <AgentsList agents={availableAgents} activeAgent={activeAgent} />

            <Button variant="outline" className="w-full mt-4 text-slate-300 border-slate-700 hover:bg-slate-800">
              <Plus className="h-4 w-4 mr-2" />
              Add New Agent
            </Button>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <div className="text-slate-300">
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
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-white">Chat</h2>
            {isAssistantSpeaking && (
              <Badge variant="outline" className="ml-2 bg-purple-900/30 text-purple-300 border-purple-700">
                Speaking
              </Badge>
            )}
            {isRecording && (
              <Badge variant="outline" className="ml-2 bg-red-900/30 text-red-300 border-red-700">
                Recording
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area */}
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

        {/* Active Agent Card (when processing) */}
        {activeAgent === "processing" && (
          <Card className="mx-4 mb-4 bg-slate-800 border-slate-700">
            <CardContent className="p-3 flex items-center">
              <Loader2 className="h-5 w-5 text-purple-500 animate-spin mr-2" />
              <span className="text-slate-300">Kaisen is thinking...</span>
            </CardContent>
          </Card>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700 bg-slate-800">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={`${isRecording ? "bg-red-900/30 text-red-300 border-red-700" : "text-slate-400 border-slate-700"}`}
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
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-700 rounded-md">
                  <VoiceWaveform />
                </div>
              )}
            </div>

            <Button
              variant="default"
              size="icon"
              className="bg-purple-700 hover:bg-purple-600"
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

