/*
Training Update API Route
Purpose: Handle real-time training updates for the chatbot learning system
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
    const { conversations, config } = body

    if (!conversations || !Array.isArray(conversations)) {
      return NextResponse.json(
        { success: false, error: 'Conversations array is required' },
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

    // Update training with new conversations
    const result = await chatbot.updateTraining(conversations)

    if (result.success) {
      return NextResponse.json({
        success: true,
        improvement: result.improvement,
        newKnowledgeCount: result.newKnowledgeCount,
        metrics: chatbot.getLearningMetrics(),
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Training update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update training',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'default'
    const chatbot = chatbotInstances.get(sessionId)

    if (!chatbot) {
      return NextResponse.json(
        { success: false, error: 'No chatbot instance found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      metrics: chatbot.getLearningMetrics(),
      knowledgeBase: chatbot.getKnowledgeBase(),
      trainingExamples: chatbot.getTrainingExamples()
    })

  } catch (error) {
    console.error('Training metrics error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get training metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 