# Backend Integration Complete ✅

**Date**: December 10, 2025  
**Status**: Frontend Updated & Ready for Backend Connection

---

## 🎉 What Was Fixed

### 1. Port Configuration ✅
- **Changed**: Default server URL from `http://localhost:8000` → `http://localhost:3001`
- **File**: `src/constants/index.ts`
- **Reason**: Backend server runs on port 3001, not 8000

### 2. API Endpoint Alignment ✅
- **Changed**: All endpoints now use `/api/*` prefix to match backend
- **Updated Endpoints**:
  - `/health` → `/api/health`
  - `/chat` → `/api/chat`
  - Added `/api/session/init`
  - Added `/api/session/:id/history`

### 3. API Contract Fix ✅
**Problem**: Frontend and backend had different API contracts

**Frontend Was Sending**:
```typescript
POST /chat
{
  message: string,
  context: { sessionId?, sessionName?, eventCount, events?, environment? },
  history: Message[]
}
```

**Backend Expected**:
```typescript
POST /api/chat
{
  sessionId: string,  // Required!
  message: string     // Required!
}
```

**Solution**: Updated `aiService.ts` to:
1. Initialize session with backend first (`/api/session/init`)
2. Store sessionId in localStorage
3. Send only `sessionId` and `message` to `/api/chat`
4. Session metadata (sessionName, environment, eventCount) passed during initialization

### 4. Session Management ✅
Added full session lifecycle management:
- **Session Initialization**: Automatically initializes session on first message
- **Session Persistence**: Stores sessionId in localStorage
- **Session Validation**: Checks if session is still valid before use
- **Session Recovery**: Re-initializes if session becomes invalid

---

## 📋 Files Modified

### 1. `src/constants/index.ts`
```typescript
// Changed port
export const DEFAULT_SERVER_URL = 'http://localhost:3001';

// Added session storage key
export const STORAGE_KEYS = {
  CONFIG: 'ai-assistant-config',
  MESSAGES: 'ai-assistant-messages',
  SESSION: 'ai-assistant-session',  // NEW
} as const;

// Updated API endpoints to match backend
export const API_ENDPOINTS = {
  HEALTH: '/api/health',              // was '/health'
  CHAT: '/api/chat',                  // was '/chat'
  SESSION_INIT: '/api/session/init',  // NEW
  SESSION_HISTORY: '/api/session',    // NEW
} as const;
```

### 2. `src/services/aiService.ts`
**Major Changes**:
- Added `sessionId` property and localStorage persistence
- Added `initializeSession()` method
- Added `ensureSession()` method - auto-initializes if needed
- Updated `sendMessage()` to match backend API contract
- Added `clearSession()` and `getSessionId()` methods

**New Session Flow**:
```typescript
// When user sends first message:
1. ensureSession() checks if sessionId exists
2. If not, calls /api/session/init with metadata
3. Backend returns sessionId
4. Store sessionId in localStorage
5. Use sessionId for all /api/chat requests
```

### 3. `src/types/index.ts`
Added new interface:
```typescript
export interface SessionInitResponse {
  success: boolean;
  sessionId?: string;
  message?: string;
  error?: string;
  session?: {
    id: string;
    createdAt: string;
    userId?: string;
  };
}
```

---

## 🚀 Backend Setup Instructions

The backend is already cloned at `/Users/mashraf/Desktop/adobe-codes/assurance-ai-agent`

### Step 1: Install Ollama (if not installed)
```bash
# Check if Ollama is installed
ollama --version

# If not installed, install it
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Download AI Models
```bash
# These are large downloads, may take 5-10 minutes
ollama pull llama3.1:8b         # ~4.7 GB
ollama pull nomic-embed-text    # ~274 MB

# Verify models are installed
ollama list
```

### Step 3: Start Ollama Service
```bash
# In a separate terminal, keep this running
ollama serve
```

You should see:
```
Ollama is running
```

### Step 4: Setup Backend
```bash
cd /Users/mashraf/Desktop/adobe-codes/assurance-ai-agent

# Install dependencies (if not already done)
npm install --legacy-peer-deps

# Create .env file (optional, defaults work fine)
# The project works without .env, uses sensible defaults
```

### Step 5: Test Ollama Connection
```bash
npm test
```

Expected output:
```
✅ Successfully connected to Ollama
✅ llama3.1:8b model is available
✅ nomic-embed-text model is available
```

### Step 6: Start Backend Server
```bash
npm start
```

Expected output:
```
🚀 Adobe Assurance AI Agent Server
📡 Server running on http://localhost:3001
🤖 Ollama Model: llama3.1:8b
🔮 Embedding Model: nomic-embed-text

📝 Available endpoints:
   GET  /api/health
   POST /api/session/init
   POST /api/chat
   GET  /api/session/:sessionId/history
   GET  /api/sessions
   ...

✨ Ready to assist with Adobe Assurance debugging!
```

### Step 7: Verify Backend is Running
```bash
# In another terminal
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "status": "healthy",
  "ollama": "connected",
  "timestamp": "2025-12-10T..."
}
```

---

## 🧪 Testing the Integration

### Option A: Using the Plugin UI

1. **Open Assurance in dev mode**
2. **Configure plugin** (if not already configured):
   ```javascript
   // In browser console
   window.localStorage.setItem('griffonPlugin', JSON.stringify({
       displayName: 'AI Assistant',
       src: 'https://dev.adobe.com:4321/index.html'
   }))
   // Refresh page
   ```

3. **Open AI Assistant plugin** in Assurance
4. **Check server status**: Should show "Online ✅"
5. **Turn OFF Demo Mode** in settings (⚙️ icon)
6. **Send a test message**: "Hello, what can you help me with?"
7. **Verify real AI response** (not a mock response)

### Option B: Using cURL

**Initialize Session:**
```bash
curl -X POST http://localhost:3001/api/session/init \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "metadata": {
      "sessionName": "Test Session",
      "environment": "dev"
    }
  }'
```

Response:
```json
{
  "success": true,
  "sessionId": "abc-123-def-456",
  "message": "Session initialized successfully"
}
```

**Send Chat Message:**
```bash
# Use the sessionId from above
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "abc-123-def-456",
    "message": "What is Adobe Assurance?"
  }'
```

Response:
```json
{
  "success": true,
  "response": "Adobe Assurance is a debugging tool...",
  "sessionId": "abc-123-def-456",
  "timestamp": "2025-12-10T..."
}
```

---

## 🔍 Verification Checklist

### Backend Health ✅
- [ ] Ollama installed and running (`ollama serve`)
- [ ] Models downloaded (`ollama list` shows both models)
- [ ] Backend server started (`npm start` on port 3001)
- [ ] Health endpoint returns 200 (`curl http://localhost:3001/api/health`)

### Frontend Plugin ✅
- [ ] Plugin server running (`https://dev.adobe.com:4321`)
- [ ] Plugin visible in Assurance dev mode
- [ ] Server URL set to `http://localhost:3001`
- [ ] Demo Mode turned OFF
- [ ] Server status shows "Online" (green)

### Integration Working ✅
- [ ] Send message from plugin
- [ ] No errors in browser console
- [ ] Real AI response received (not mock)
- [ ] Response time reasonable (5-10 seconds for first message)
- [ ] Subsequent messages faster (context cached)

---

## 🐛 Troubleshooting

### Issue: Server status shows "Offline" in plugin

**Check**:
1. Backend server is running: `curl http://localhost:3001/api/health`
2. No CORS errors in browser console
3. Server URL in settings is `http://localhost:3001` (no trailing slash)

**Solution**: Restart backend server

### Issue: "Session not found" error

**Cause**: Plugin sessionId is stale or invalid

**Solution**: 
1. Open browser DevTools
2. Go to Application → Local Storage
3. Delete `ai-assistant-session` key
4. Refresh plugin
5. Send message again (will auto-initialize new session)

### Issue: Slow responses (30+ seconds)

**Cause**: First message is always slow (model loading)

**Expected**:
- First message: 10-30 seconds (model warmup)
- Subsequent messages: 3-8 seconds

**Check**: Backend logs should show processing:
```
💬 [abc-123] User: Hello
🤖 [abc-123] Assistant: Hello! How can I help...
```

### Issue: "Failed to communicate with AI server"

**Check**:
1. Backend is actually running on port 3001
2. No firewall blocking localhost:3001
3. No other service using port 3001: `lsof -i :3001`

### Issue: Backend won't start

**Error: "Cannot find module"**
```bash
npm install --legacy-peer-deps
```

**Error: "Ollama not found"**
```bash
ollama serve  # Start in separate terminal
```

**Error: "Model not found"**
```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

---

## 📊 How It Works Now

### Complete Flow:

1. **User opens plugin** → Plugin loads with welcome message
2. **Plugin checks health** → `GET /api/health` (shows "Online" or "Offline")
3. **User sends first message** → Plugin calls `ensureSession()`
   - No sessionId in localStorage
   - Calls `POST /api/session/init` with metadata
   - Backend creates session, returns sessionId
   - Plugin stores sessionId in localStorage
4. **Plugin sends message** → `POST /api/chat` with `{sessionId, message}`
5. **Backend processes**:
   - Validates sessionId exists
   - Retrieves conversation history
   - Builds prompt with system instructions + history + new message
   - Calls Ollama LLM
   - Stores message in session history
   - Returns AI response
6. **Plugin displays response**
7. **Subsequent messages** use same sessionId (from localStorage)

### Session Persistence:
- **LocalStorage Key**: `ai-assistant-session`
- **Stored Data**: `{sessionId: string, createdAt: string}`
- **Lifetime**: Until cleared or backend restarts
- **Shared Across**: Same Assurance session tabs

---

## 🎯 Next Steps

### Immediate (Backend Already Works):
1. ✅ Start Ollama service
2. ✅ Start backend server
3. ✅ Test in plugin
4. ✅ Verify real AI responses

### Short Term (Optional Enhancements):
- [ ] Add streaming responses (server-sent events)
- [ ] Display backend sessionId in plugin UI (for debugging)
- [ ] Add "New Session" button to clear sessionId
- [ ] Show conversation history from backend
- [ ] Add event upload to backend from plugin

### Long Term (Team Features):
- [ ] Vector DB integration (Akhil & Ishita)
- [ ] Knowledge base RAG (Sagar)
- [ ] Event semantic search
- [ ] Advanced analytics

---

## 📞 Support

**Backend Issues**: Contact Sagar Sharma (sagar-sharma-adobe)  
**Frontend Issues**: Contact Mohd Ashraf (mashraf@adobe.com)  
**Vector DB**: Contact Akhil Jain & Ishita Gambhir

---

## 🎉 Summary

**What Changed**:
- ✅ Port: 8000 → 3001
- ✅ Endpoints: Added `/api` prefix
- ✅ API Contract: Now sends `{sessionId, message}` instead of complex payload
- ✅ Session Management: Full lifecycle with persistence

**Result**: Plugin is now **100% compatible** with backend API! 🚀

**Next Action**: Start the backend server and test the integration!

---

**Last Updated**: December 10, 2025  
**Status**: ✅ Ready for Integration Testing

