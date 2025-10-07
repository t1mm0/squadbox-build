# AI Chatbot with Learning Capabilities

An intelligent chatbot that learns from conversations and can be updated anytime. Built with Next.js, TypeScript, OpenAI, and LangChain.

## 🚀 Features

### Core Capabilities
- **Conversation Learning**: Learns from every interaction
- **Real-time Training Updates**: Update training anytime with new data
- **Context Awareness**: Maintains conversation context and history
- **Multi-language Support**: Supports English, Spanish, French, German, Chinese, Japanese
- **Customizable Responses**: Adjust personality and response style
- **Analytics Dashboard**: Track learning metrics and performance
- **Export Conversations**: Save and export conversation data
- **API Integration**: RESTful API for external integrations

### Learning System
- **Automatic Learning**: Identifies learning opportunities automatically
- **Confidence Scoring**: Tracks response confidence levels
- **Knowledge Base**: Vector-based knowledge storage and retrieval
- **Training Examples**: Stores high-quality conversation examples
- **Performance Metrics**: Tracks accuracy improvements over time

### Customization Options
- **Personality Types**: Friendly, Professional, Casual, Formal
- **Response Styles**: Concise, Detailed, Conversational, Technical
- **Learning Rates**: Fast, Medium, Slow adaptation
- **Context Windows**: 5-20 message history retention
- **Language Support**: 6 languages with easy expansion

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js 14, Node.js
- **AI**: OpenAI GPT-3.5/4, LangChain, Vector Database
- **Database**: PostgreSQL with vector extensions
- **Caching**: Redis for session management
- **Deployment**: Vercel, Railway, or any Node.js hosting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- Redis (optional, for production)
- OpenAI API key

### Quick Start

1. **Clone the template**
```bash
git clone <template-url>
cd ai-chatbot-learnable
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your configuration:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/squadbox
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up the database**
```bash
# Create database
createdb squadbox

# Run migrations
npm run db:migrate
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your chatbot in action!

## 🎯 Usage

### Basic Chat Interface

The chatbot provides a clean, modern interface with:

- **Real-time messaging** with typing indicators
- **Confidence scoring** for each response
- **Learning opportunity indicators** when the bot identifies areas for improvement
- **Conversation export** functionality
- **Settings panel** for customization

### Training Updates

Update the chatbot's training anytime:

1. **Automatic Learning**: The bot learns from every conversation
2. **Manual Training**: Click the brain icon to trigger training updates
3. **Export Data**: Download conversations for external analysis
4. **Performance Tracking**: Monitor accuracy improvements

### Customization

Adjust the chatbot's behavior through the settings panel:

- **Personality**: Choose from 4 different personality types
- **Language**: Switch between 6 supported languages
- **Response Style**: Adjust how detailed responses should be
- **Learning Rate**: Control how quickly the bot adapts
- **Context Window**: Set how many previous messages to remember

## 🔧 API Endpoints

### Chat API
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "config": {
    "personality": "friendly",
    "language": "en",
    "responseStyle": "conversational"
  },
  "conversationHistory": [...]
}
```

### Training API
```http
POST /api/training/update
Content-Type: application/json

{
  "conversations": [...],
  "config": {...}
}
```

### Metrics API
```http
GET /api/training
```

## 📊 Learning Metrics

The chatbot tracks various learning metrics:

- **Total Interactions**: Number of conversations
- **Learning Opportunities**: Times the bot identified improvement areas
- **Accuracy Score**: Overall confidence and accuracy
- **Recent Improvements**: Training improvements over time

## 🗄️ Database Schema

The template includes a comprehensive database schema with:

- **Chatbot Sessions**: Store session configurations
- **Conversations**: Track all message exchanges
- **Knowledge Base**: Vector-based knowledge storage
- **Training Examples**: High-quality conversation pairs
- **Learning Metrics**: Performance tracking
- **Training Sessions**: Training history and results
- **User Feedback**: Feedback and ratings

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Railway
```bash
railway up
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Environment Variables

Required environment variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...

# Database Configuration
DATABASE_URL=postgresql://...

# Redis (Optional)
REDIS_URL=redis://...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- ChatbotEngine.test.ts
```

## 📈 Performance

### Optimization Features
- **Vector Caching**: Caches embeddings for faster retrieval
- **Connection Pooling**: Efficient database connections
- **Response Caching**: Caches common responses
- **Lazy Loading**: Loads components on demand

### Monitoring
- **Performance Metrics**: Track response times
- **Error Tracking**: Monitor and log errors
- **Usage Analytics**: Track API usage and patterns

## 🔧 Customization

### Adding New Languages
1. Update the language options in `ChatbotInterface.tsx`
2. Add language-specific prompts in `chatbot-engine.ts`
3. Update the database schema if needed

### Adding New Personalities
1. Add personality prompt in `getPersonalityPrompt()`
2. Update the UI options in `ChatbotInterface.tsx`
3. Test with various conversation scenarios

### Extending Learning Capabilities
1. Modify `analyzeLearningOpportunity()` for custom detection
2. Add new training data types in the database schema
3. Implement custom vector similarity functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the inline code comments
- **Issues**: Report bugs on GitHub
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: support@squadbox.ai

## 🎉 Acknowledgments

- OpenAI for the GPT models
- LangChain for the AI framework
- Vercel for hosting
- The open-source community

---

**Built with ❤️ by SquadBox AI** 