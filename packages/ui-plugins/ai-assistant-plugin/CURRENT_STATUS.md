# AI Assistant Plugin - Current Status

**Date**: December 10, 2025  
**Branch**: `feat/ashraf-ai-assistant-plugin`  
**Developer**: Mohd Ashraf

---

## ✅ What's Working

### Backend Integration
- ✅ Connected to Sagar's AI agent server (http://localhost:3001)
- ✅ Session management with automatic initialization
- ✅ Real AI responses using Ollama (llama3.1:8b)
- ✅ Event upload with chunked processing (handles 500-1500+ events)
- ✅ RAG-enabled (knowledge base search integrated)

### UI Features
- ✅ Chat interface with message history
- ✅ Demo mode for testing without backend
- ✅ Settings panel (configure server URL, toggle demo mode)
- ✅ Server health monitoring
- ✅ Event upload button with progress tracking
- ✅ LocalStorage config persistence
- ✅ Proper message layout (sender/content/timestamp stacked)

### Architecture
- ✅ TypeScript throughout
- ✅ Modular structure (components, hooks, services, types)
- ✅ API contract matches backend exactly
- ✅ Error handling and graceful fallbacks

---

## 🚀 How to Run

### 1. Start Backend (Required for Real Mode)
```bash
# Terminal 1: Ollama service
ollama serve

# Terminal 2: AI Agent Server
cd /path/to/assurance-ai-agent
npm start
# Runs on http://localhost:3001
```

### 2. Start Plugin
```bash
cd /path/to/assurance-plugins
nvm use 18
yarn workspace ai-assistant-plugin start
# Runs on https://localhost.corp.adobe.com:4321
```

### 3. Configure in Assurance Dev Mode
```javascript
// Browser console in Assurance
window.localStorage.setItem('griffonPlugin', JSON.stringify({
    displayName: 'AI Assistant',
    src: 'https://localhost.corp.adobe.com:4321/index.html'
}))
// Refresh page
```

---

## 🎯 How to Use

1. **Open AI Assistant** in Assurance sidebar
2. **Check server status** in header (Online/Offline/Demo Mode)
3. **Settings (⚙️)**:
   - Server URL: `http://localhost:3001`
   - Demo Mode: OFF (for real AI) / ON (for mock responses)
4. **Upload Events**: Click "⬆️ Upload Events" button
   - Uploads current session events to backend
   - Shows progress during upload
   - Enables semantic event search by AI
5. **Chat**: Type questions and get AI responses
   - AI has access to uploaded events
   - Conversation history maintained
   - RAG-enabled (searches knowledge base)

---

## 📁 Project Structure

```
src/
├── components/
│   └── AIChat.tsx           # Main UI component ⭐
├── hooks/
│   ├── useChat.ts           # Chat logic & state
│   └── useConfig.ts         # Config management
├── services/
│   └── aiService.ts         # API communication ⭐
├── types/
│   └── index.ts             # TypeScript definitions
├── constants/
│   └── index.ts             # Config & endpoints
└── utils/
    ├── config.ts            # localStorage helpers
    └── mockResponses.ts     # Demo mode responses
```

---

## 🔑 Key Files

### `src/services/aiService.ts`
- Session initialization & management
- Chat API communication
- Event upload with chunking
- Health checks

### `src/components/AIChat.tsx`
- Main chat interface
- Settings dialog
- Event upload UI
- Message display

### `src/hooks/useChat.ts`
- Message state management
- Mock/real mode switching
- Server status tracking

---

## 🐛 Known Issues & Fixes

### "Connection Refused" Error
**Cause**: Old config in localStorage (port 8000)  
**Fix**: Clear localStorage or update URL in settings to `http://localhost:3001`

```javascript
localStorage.removeItem('ai-assistant-config');
localStorage.removeItem('ai-assistant-session');
location.reload();
```

### Backend Not Running
**Fix**: Start Ollama (`ollama serve`) then backend (`npm start`)

### Plugin Shows Nothing
**Fix**: Restart dev server
```bash
pkill -f "parcel.*4321"
yarn workspace ai-assistant-plugin start
```

---

## 🤝 Team Coordination

### Backend (Sagar Sharma)
- Server location: https://github.com/sagar-sharma-adobe/assurance-ai-agent
- Port: 3001
- API: `/api/health`, `/api/session/init`, `/api/chat`, `/api/events/upload`
- **Don't modify backend API contract without coordination**

### Vector DB (Akhil & Ishita)
- Event embeddings handled by backend
- Frontend uploads events via `/api/events/upload`
- Semantic search integrated into chat responses

---

## 📝 Recent Changes

### Session Management
- Auto-initializes session on first message
- Persists sessionId in localStorage
- Validates and recovers from stale sessions

### Event Upload
- Chunked uploads (100 events per chunk)
- Progress tracking in UI
- Handles large sessions (500-1500+ events)
- 60s timeout per chunk

### API Contract
- Backend expects: `{ sessionId: string, message: string }`
- Frontend automatically manages session lifecycle
- No need to manually initialize session

---

## 🔮 Next Steps

### Immediate
- [ ] Test with real Assurance sessions
- [ ] Gather user feedback
- [ ] Performance testing with large event sets

### Future
- [ ] Streaming responses (server-sent events)
- [ ] Export conversation history
- [ ] Advanced event filters
- [ ] Custom prompts/templates

---

## 📞 Questions?

**Plugin Issues**: Mohd Ashraf (mashraf@adobe.com)  
**Backend Issues**: Sagar Sharma  
**Vector DB**: Akhil Jain & Ishita Gambhir

---

**Status**: ✅ Fully functional, ready for testing  
**Last Updated**: December 10, 2025

