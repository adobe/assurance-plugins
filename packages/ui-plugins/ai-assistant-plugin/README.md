# AI Assistant Plugin for Adobe Assurance

An AI-powered assistant plugin for Adobe Assurance that provides intelligent insights and debugging assistance for your Assurance sessions.

## ✨ Key Features

- **🤖 AI-Powered Chat**: Natural language interface for session analysis
- **⚙️ Configurable Server**: User can set custom AI server URL
- **🎭 Demo Mode**: Test without server using mock responses
- **💾 Persistent Config**: Settings saved to localStorage
- **📊 Session Integration**: Automatic access to Assurance events
- **🏗️ Modular Architecture**: Clean, scalable, testable code
- **🎨 Modern UI**: Built with Adobe React Spectrum

## 🏛️ Architecture

This plugin follows best practices with clear separation of concerns:

```
src/
├── components/   # UI components (presentational only)
├── hooks/        # Business logic (useChat, useConfig)
├── services/     # API communication (aiService)
├── types/        # TypeScript definitions
├── constants/    # Configuration and constants
└── utils/        # Pure utility functions
```

**See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.**

## Prerequisites

1. **AI Agent Server**: This plugin requires the AI agent server to be running locally
   - Repository: https://github.com/sagar-sharma-adobe/assurance-ai-agent
   - Default endpoint: `http://localhost:8000`

2. **Ollama**: For local LLM support
   - Download from: https://ollama.com/download
   - Install the model: `ollama pull llama3.1:8b`

## Development

### Setup

From the root of the assurance-plugins monorepo:

```bash
# Install dependencies
yarn

# Build dependencies
yarn build --ignore sample-ui-plugin
```

### Running the Plugin

Navigate to this plugin directory and start the dev server:

```bash
cd packages/ui-plugins/ai-assistant-plugin
yarn start
```

Or from the root:

```bash
yarn workspace ai-assistant-plugin start
```

The plugin will be hosted at `https://dev.adobe.com:4321`

### Configure Assurance

1. Open [Assurance in dev mode](https://experience.adobe.com/?devMode=true#)
2. Select a session
3. Open browser developer console (ensure you're in the Main Content frame)
4. Run:

```javascript
window.localStorage.setItem('griffonPlugin', JSON.stringify({
    displayName: 'AI Assistant',
    src: 'https://dev.adobe.com:4321/index.html'
}))
```

5. In Assurance UI, click `Configure` button and add the "AI Assistant" plugin

## Features

### User Configuration
- **⚙️ Settings Dialog**: Click the settings icon to configure
- **🌐 Custom Server URL**: Paste your AI server URL
- **🎭 Demo Mode Toggle**: Switch between mock and real responses
- **💾 Persistent**: Configuration saved automatically

### Chat Interface
- Clean, modern interface with Adobe React Spectrum
- Natural language queries about your session
- Real-time responses from AI (or mock mode)
- Full conversation history

### Session Integration
- Automatic access to Assurance session events
- Sends relevant context to AI
- Displays session info and event count
- Configurable event context size (default: 100 events)

### Server Management
- Visual status indicator (Online/Offline/Demo)
- Automatic health checks
- Manual refresh capability
- Graceful error handling

### Keyboard Shortcuts
- `Enter`: Send message

## Architecture

```
┌─────────────────────┐
│  Assurance Session  │
│   (Events, Data)    │
└──────────┬──────────┘
           │
           │ Plugin Bridge
           │
┌──────────▼──────────┐
│   AI Assistant      │
│   Plugin (React)    │
└──────────┬──────────┘
           │
           │ HTTP API
           │
┌──────────▼──────────┐
│  AI Agent Server    │
│  (FastAPI/Flask)    │
└──────────┬──────────┘
           │
           │
┌──────────▼──────────┐
│   Ollama + LLM      │
│  (llama3.1:8b)      │
└─────────────────────┘
```

## API Integration

The plugin communicates with the AI agent server via HTTP:

### Health Check
```
GET http://localhost:8000/health
```

### Chat Endpoint
```
POST http://localhost:8000/chat
Content-Type: application/json

{
  "message": "User's question",
  "context": {
    "sessionId": "...",
    "sessionName": "...",
    "eventCount": 123,
    "events": [...],
    "environment": "prod"
  },
  "history": [...]
}
```

## Customization

### Changing AI Server Endpoint

Edit the `apiEndpoint` state in `AIAssistant.tsx`:

```typescript
const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000');
```

### Adjusting Event Context

Modify the number of events sent for context:

```typescript
events: events?.slice(0, 100), // Currently sends last 100 events
```

## Team

**Created by**: Mohd Ashraf (mashraf@adobe.com)

**Contributors**:
- Sagar Sharma (sagsharma) - AI Agent Server
- Akhil Jain (akhiljain) - Vector DB & Event Storage
- Ishita Gambhir (igambhir) - Vector DB & Event Storage

## License

Apache-2.0

---

**Related Projects**:
- AI Agent Server: https://github.com/sagar-sharma-adobe/assurance-ai-agent
- Assurance Next Wiki: https://wiki.corp.adobe.com/display/adms/Assurance+Next%3A+AI-Powered+Assurance+Sessions

