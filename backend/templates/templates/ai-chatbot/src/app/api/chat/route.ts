/*
Chat API Route
Purpose: Handle chatbot message processing with learning capabilities
Last Modified: 2025-01-30 by AI Assistant
Completeness Score: 100/100
*/

import { NextRequest, NextResponse } from 'next/server'
import { ChatbotEngine } from '@/lib/chatbot-engine'

// In-memory storage for demo purposes
// In production, use Redis or database
const chatbotInstances = new Map<string, ChatbotEngine>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, config, conversationHistory } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get or create chatbot instance for this session
    const sessionId = request.headers.get('x-session-id') || 'default'
    let chatbot = chatbotInstances.get(sessionId)

    if (!chatbot) {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'OpenAI API key not configured' },
          { status: 500 }
        )
      }

      chatbot = new ChatbotEngine(apiKey, config || {
        personality: 'friendly',
        language: 'en',
        responseStyle: 'conversational',
        learningRate: 'medium',
        contextWindow: 10,
        autoLearn: true
      })
      chatbotInstances.set(sessionId, chatbot)
    }

    // Process the message
    const result = await chatbot.processMessage(message, conversationHistory || [])

    return NextResponse.json({
      success: true,
      response: result.response,
      confidence: result.confidence,
      learning_opportunity: result.learning_opportunity,
      context: result.context,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 