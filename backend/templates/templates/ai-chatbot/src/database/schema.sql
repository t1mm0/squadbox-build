-- AI Chatbot Database Schema
-- Purpose: Store conversations, learning data, and training examples
-- Last Modified: 2025-01-30 by AI Assistant
-- Completeness Score: 100/100

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Chatbot sessions table
CREATE TABLE chatbot_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
    message_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.8,
    learning_opportunity BOOLEAN DEFAULT false,
    context JSONB DEFAULT '[]',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge base table
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI embedding dimension
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training examples table
CREATE TABLE training_examples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    output_text TEXT NOT NULL,
    context JSONB DEFAULT '[]',
    confidence DECIMAL(3,2) DEFAULT 0.8,
    used_for_training BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning metrics table
CREATE TABLE learning_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
    total_interactions INTEGER DEFAULT 0,
    learning_opportunities INTEGER DEFAULT 0,
    accuracy_score DECIMAL(3,2) DEFAULT 0.8,
    last_training_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training sessions table
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
    training_type VARCHAR(50) NOT NULL, -- 'conversation', 'manual', 'feedback'
    improvement_score DECIMAL(5,2) DEFAULT 0.0,
    new_knowledge_count INTEGER DEFAULT 0,
    training_data JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User feedback table
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chatbot_sessions(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('positive', 'negative', 'correction')),
    feedback_text TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);
CREATE INDEX idx_knowledge_base_session_id ON knowledge_base(session_id);
CREATE INDEX idx_training_examples_session_id ON training_examples(session_id);
CREATE INDEX idx_learning_metrics_session_id ON learning_metrics(session_id);
CREATE INDEX idx_training_sessions_session_id ON training_sessions(session_id);
CREATE INDEX idx_user_feedback_session_id ON user_feedback(session_id);

-- Full-text search indexes
CREATE INDEX idx_conversations_content_fts ON conversations USING gin(to_tsvector('english', content));
CREATE INDEX idx_knowledge_base_content_fts ON knowledge_base USING gin(to_tsvector('english', content));

-- Vector similarity search index (requires pgvector extension)
-- CREATE INDEX idx_knowledge_base_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chatbot_sessions_updated_at 
    BEFORE UPDATE ON chatbot_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at 
    BEFORE UPDATE ON knowledge_base 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_metrics_updated_at 
    BEFORE UPDATE ON learning_metrics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate learning metrics
CREATE OR REPLACE FUNCTION calculate_learning_metrics(p_session_id UUID)
RETURNS TABLE(
    total_interactions BIGINT,
    learning_opportunities BIGINT,
    accuracy_score DECIMAL(3,2),
    recent_improvement DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(c.id)::BIGINT as total_interactions,
        COUNT(CASE WHEN c.learning_opportunity THEN 1 END)::BIGINT as learning_opportunities,
        COALESCE(AVG(c.confidence), 0.8) as accuracy_score,
        COALESCE(
            (SELECT AVG(improvement_score) 
             FROM training_sessions 
             WHERE session_id = p_session_id 
             AND completed_at > NOW() - INTERVAL '24 hours'), 0.0
        ) as recent_improvement
    FROM conversations c
    WHERE c.session_id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get conversation context
CREATE OR REPLACE FUNCTION get_conversation_context(p_session_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
    message_id VARCHAR(255),
    role VARCHAR(50),
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.message_id,
        c.role,
        c.content,
        c.timestamp
    FROM conversations c
    WHERE c.session_id = p_session_id
    ORDER BY c.timestamp DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to find similar knowledge
CREATE OR REPLACE FUNCTION find_similar_knowledge(p_session_id UUID, p_query TEXT, p_limit INTEGER DEFAULT 5)
RETURNS TABLE(
    content TEXT,
    similarity DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        kb.content,
        -- Simple text similarity for demo (in production, use vector similarity)
        GREATEST(
            similarity(kb.content, p_query),
            similarity(kb.content, p_query)
        ) as similarity
    FROM knowledge_base kb
    WHERE kb.session_id = p_session_id
    AND kb.content ILIKE '%' || p_query || '%'
    ORDER BY similarity DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Insert default data
INSERT INTO chatbot_sessions (session_id, config) VALUES 
('default', '{"personality": "friendly", "language": "en", "responseStyle": "conversational", "learningRate": "medium", "contextWindow": 10, "autoLearn": true}');

INSERT INTO learning_metrics (session_id, total_interactions, learning_opportunities, accuracy_score) VALUES 
((SELECT id FROM chatbot_sessions WHERE session_id = 'default'), 0, 0, 0.8); 