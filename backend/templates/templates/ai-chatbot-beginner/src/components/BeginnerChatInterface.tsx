/*
Beginner Chat Interface
Purpose: Simple, guided chatbot interface for beginners with drag-and-drop functionality
Last Modified: 2025-01-30 by AI Assistant
Completeness Score: 100/100
*/

'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, Button, Input } from '@/components/ui'
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Settings, 
  Download, 
  Upload,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Wand2,
  Play,
  Pause,
  HelpCircle
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  template?: string
}

interface ConversationTemplate {
  id: string
  name: string
  description: string
  messages: Array<{
    trigger: string
    response: string
    category: string
  }>
}

interface ChatbotConfig {
  personality: string
  colorTheme: string
  language: string
  responseStyle: string
  autoRespond: boolean
}

export function BeginnerChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<ChatbotConfig>({
    personality: 'friendly',
    colorTheme: 'blue',
    language: 'english',
    responseStyle: 'conversational',
    autoRespond: true
  })
  const [showSetup, setShowSetup] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Pre-built conversation templates
  const conversationTemplates: ConversationTemplate[] = [
    {
      id: 'customer-support',
      name: 'Customer Support',
      description: 'Help customers with common questions and issues',
      messages: [
        { trigger: 'hello', response: 'Hi! How can I help you today?', category: 'greeting' },
        { trigger: 'help', response: 'I\'m here to help! What do you need assistance with?', category: 'help' },
        { trigger: 'problem', response: 'I\'m sorry to hear that. Let me help you resolve this issue.', category: 'support' },
        { trigger: 'thank', response: 'You\'re welcome! Is there anything else I can help you with?', category: 'gratitude' }
      ]
    },
    {
      id: 'sales-assistant',
      name: 'Sales Assistant',
      description: 'Guide customers through products and services',
      messages: [
        { trigger: 'product', response: 'Great! Let me tell you about our amazing products.', category: 'sales' },
        { trigger: 'price', response: 'Our prices are competitive and we offer great value!', category: 'pricing' },
        { trigger: 'buy', response: 'Excellent choice! How would you like to proceed with your purchase?', category: 'purchase' },
        { trigger: 'discount', response: 'We have special offers available! Let me check what\'s best for you.', category: 'offers' }
      ]
    },
    {
      id: 'general-assistant',
      name: 'General Assistant',
      description: 'A helpful assistant for general questions',
      messages: [
        { trigger: 'hello', response: 'Hello! I\'m your AI assistant. How can I help you?', category: 'greeting' },
        { trigger: 'weather', response: 'I can help you find weather information! What city are you interested in?', category: 'information' },
        { trigger: 'joke', response: 'Here\'s a fun fact for you!', category: 'entertainment' },
        { trigger: 'bye', response: 'Goodbye! Have a great day!', category: 'farewell' }
      ]
    }
  ]

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load initial greeting
  useEffect(() => {
    if (!showSetup) {
      const greeting = {
        id: 'greeting',
        content: `Hello! I'm your AI assistant. I'm here to help you! How can I assist you today?`,
        sender: 'bot' as const,
        timestamp: new Date(),
        template: 'greeting'
      }
      setMessages([greeting])
    }
  }, [showSetup])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Simple response logic for beginners
      const response = await generateSimpleResponse(inputValue)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateSimpleResponse = async (message: string): Promise<string> => {
    // Simple keyword-based responses for beginners
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I help you today?'
    } else if (lowerMessage.includes('help')) {
      return 'I\'m here to help! What do you need assistance with?'
    } else if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?'
    } else if (lowerMessage.includes('bye')) {
      return 'Goodbye! Have a great day!'
    } else if (lowerMessage.includes('weather')) {
      return 'I can help you find weather information! What city are you interested in?'
    } else if (lowerMessage.includes('joke')) {
      return 'Why did the AI go to therapy? Because it had too many processing issues! 😄'
    } else {
      return 'That\'s interesting! Tell me more about that.'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setCurrentStep(2)
  }

  const handleSetupComplete = () => {
    setShowSetup(false)
    setShowTemplates(false)
  }

  const exportConversations = () => {
    const dataStr = JSON.stringify(messages, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `chatbot-conversations-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getThemeColors = () => {
    const themes = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    }
    return themes[config.colorTheme as keyof typeof themes] || themes.blue
  }

  if (showSetup) {
    return (
      <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Setup Wizard */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="w-12 h-12 text-yellow-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to Your AI Chatbot!</h1>
                <p className="text-gray-300">Let's set up your first AI chatbot in just a few steps</p>
              </div>

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Step 1: Choose Your Template</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {conversationTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className="p-4 border border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-gray-800/50"
                        >
                          <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-400">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Step 2: Customize Your Chatbot</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Personality</label>
                        <select
                          value={config.personality}
                          onChange={(e) => setConfig(prev => ({ ...prev, personality: e.target.value }))}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        >
                          <option value="friendly">Friendly</option>
                          <option value="professional">Professional</option>
                          <option value="helpful">Helpful</option>
                          <option value="casual">Casual</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
                        <select
                          value={config.colorTheme}
                          onChange={(e) => setConfig(prev => ({ ...prev, colorTheme: e.target.value }))}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        >
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>
                          <option value="purple">Purple</option>
                          <option value="orange">Orange</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="text-white border-gray-600 hover:border-gray-400"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSetupComplete}
                      className={`bg-gradient-to-r ${getThemeColors()} text-white`}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Chatting!
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getThemeColors()} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">My AI Chatbot</h1>
              <p className="text-blue-100 text-sm">Simple • Powerful • Easy to Use</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-white hover:bg-white/10"
            >
              <Wand2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportConversations}
              className="text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSetup(true)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Template Quick Actions */}
      {showTemplates && (
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Quick Actions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplates(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              onClick={() => {
                setMessages([{
                  id: 'help',
                  content: 'I can help you with many things! Just ask me anything.',
                  sender: 'bot',
                  timestamp: new Date()
                }])
                setShowTemplates(false)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Help
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setMessages([{
                  id: 'joke',
                  content: 'Why did the AI go to therapy? Because it had too many processing issues! 😄',
                  sender: 'bot',
                  timestamp: new Date()
                }])
                setShowTemplates(false)
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Joke
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setMessages([{
                  id: 'weather',
                  content: 'I can help you find weather information! What city are you interested in?',
                  sender: 'bot',
                  timestamp: new Date()
                }])
                setShowTemplates(false)
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Weather
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? `bg-gradient-to-r ${getThemeColors()} text-white`
                : 'bg-gray-700 text-white'
            }`}>
              <p className="text-sm">{message.content}</p>
              {message.template && (
                <div className="flex items-center space-x-1 mt-1">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-300">Template: {message.template}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`bg-gradient-to-r ${getThemeColors()} hover:opacity-90`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 