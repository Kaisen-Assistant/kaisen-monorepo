import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Twitter, CreditCard, Bell, Search } from "lucide-react"
import VoiceWaveform from "@/components/voice-waveform"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: Date
  agent: string | null
}

interface ChatMessageProps {
  message: Message
  isAssistantSpeaking: boolean
}

export default function ChatMessage({ message, isAssistantSpeaking }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getAgentIcon = (agentId: string | null) => {
    switch (agentId) {
      case "twitter-agent":
        return <Twitter className="h-3 w-3" />
      case "finance-agent":
        return <CreditCard className="h-3 w-3" />
      case "reminder-agent":
        return <Bell className="h-3 w-3" />
      case "search-agent":
        return <Search className="h-3 w-3" />
      default:
        return null
    }
  }

  const getAgentName = (agentId: string | null) => {
    switch (agentId) {
      case "twitter-agent":
        return "Twitter Trends"
      case "finance-agent":
        return "Finance Agent"
      case "reminder-agent":
        return "Reminder Agent"
      case "search-agent":
        return "Web Search"
      default:
        return null
    }
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
        <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
          {message.role === "assistant" ? (
            <>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Kaisen" />
              <AvatarFallback className="bg-purple-700 text-white">KA</AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback className="bg-slate-600 text-white">U</AvatarFallback>
            </>
          )}
        </Avatar>

        <div>
          <div className={`flex items-center ${message.role === "user" ? "justify-end" : "justify-start"} mb-1`}>
            <span className="text-xs text-slate-400">{message.role === "assistant" ? "Kaisen Assistant" : "You"}</span>

            {message.agent && (
              <Badge variant="outline" className="ml-2 text-xs py-0 h-4 bg-slate-800 border-slate-600 text-slate-300">
                <span className="flex items-center">
                  {getAgentIcon(message.agent)}
                  <span className="ml-1">{getAgentName(message.agent)}</span>
                </span>
              </Badge>
            )}

            <span className="text-xs text-slate-500 ml-2">{formatTime(message.timestamp)}</span>
          </div>

          <div
            className={`rounded-lg p-3 ${
              message.role === "user" ? "bg-purple-700 text-white" : "bg-slate-700 text-slate-100"
            }`}
          >
            <div className="relative">
              {message.content}
              {isAssistantSpeaking && (
                <div className="mt-2">
                  <VoiceWaveform />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

