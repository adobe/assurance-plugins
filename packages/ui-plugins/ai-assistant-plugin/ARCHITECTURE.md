# AI Assistant Plugin - Architecture Documentation

## 📐 Architecture Overview

This plugin follows a **clean, modular, scalable architecture** with clear separation of concerns, making it easy to maintain, test, and extend.

## 🏗️ Project Structure

```
src/
├── components/          # UI Components (Presentational)
│   ├── AIAssistant.tsx  # Main chat interface
│   └── Settings.tsx     # Configuration dialog
├── containers/          # Container components
│   └── App/
│       └── index.tsx    # App root with providers
├── hooks/               # Custom React hooks (Business Logic)
│   ├── useChat.ts       # Chat state and message handling
│   └── useConfig.ts     # Configuration management
├── services/            # External services and API calls
│   └── aiService.ts     # AI server communication
├── types/               # TypeScript type definitions
│   └── index.ts         # All type definitions
├── constants/           # Constants and configuration
│   └── index.ts         # Default values, endpoints, mock data
├── utils/               # Pure utility functions
│   ├── config.ts        # Config persistence (localStorage)
│   └── mockResponses.ts # Mock AI response generation
├── index.tsx            # React entry point
└── index.html           # Plugin HTML entry
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **Components**: Only handle UI rendering and user interactions
- **Hooks**: Contain business logic and state management
- **Services**: Handle external API communication
- **Utils**: Pure functions with no side effects

### 2. **Single Responsibility**
- Each file/function has one clear purpose
- Easy to understand, test, and modify
- Minimal coupling between modules

### 3. **Type Safety**
- Full TypeScript coverage
- Explicit types for all data structures
- No `any` types (use `unknown` when needed)

### 4. **Scalability**
- Designed for future features:
  - Message persistence
  - Streaming responses
  - Advanced configuration
  - Multiple AI models
- Easy to add new capabilities without refactoring

## 📦 Module Details

### Types (`types/index.ts`)

**Purpose**: Central type definitions for the entire plugin

```typescript
// Core types
- Message: Chat message structure
- MessageRole: 'user' | 'assistant' | 'system'
- SessionContext: Assurance session data
- ChatRequest/Response: API payloads
- PluginConfig: User configuration
- ChatState: Chat UI state
- ServerStatus: Connection status
```

**Benefits**:
- Single source of truth for types
- Easy to refactor
- Enables IntelliSense throughout codebase

### Constants (`constants/index.ts`)

**Purpose**: Configuration and constant values

```typescript
- DEFAULT_SERVER_URL: Default API endpoint
- STORAGE_KEYS: localStorage key names
- API_ENDPOINTS: API route definitions
- MOCK_RESPONSES: Demo mode responses
```

**Benefits**:
- Easy to modify defaults
- No magic strings/numbers
- Centralized configuration

### Services (`services/aiService.ts`)

**Purpose**: AI server communication layer

**Features**:
- `AIService` class for API operations
- Singleton pattern with `getAIService()`
- Timeout handling (5s health, 30s chat)
- Error handling and retries
- TypeScript-safe requests/responses

**API Contract**:
```typescript
class AIService {
  checkHealth(): Promise<boolean>
  sendMessage(request: ChatRequest): Promise<string>
  setBaseUrl(url: string): void
}
```

**Future Enhancements**:
- Add streaming support
- Implement retry logic
- Add request queuing
- Support multiple endpoints

### Hooks

#### `useConfig` (`hooks/useConfig.ts`)

**Purpose**: Manage plugin configuration

```typescript
const { config, updateConfig } = useConfig();

config.serverUrl    // Current server URL
config.mockMode     // Demo mode enabled?
updateConfig({ ... }) // Update configuration
```

**Features**:
- Loads from localStorage on mount
- Auto-saves on changes
- Provides clean API for components

#### `useChat` (`hooks/useChat.ts`)

**Purpose**: Manage chat state and operations

```typescript
const {
  messages,      // Message history
  isLoading,     // Sending message?
  serverStatus,  // Connection status
  initialize,    // Init with welcome message
  sendMessage,   // Send user message
  checkHealth,   // Check server health
  clearMessages, // Reset chat
} = useChat({ serverUrl, mockMode, maxEventsContext });
```

**Features**:
- Handles both mock and real server modes
- Manages message state
- Error handling
- Server health monitoring

**Future Enhancements**:
- Message persistence to localStorage
- Export chat history
- Support streaming responses
- Message editing/deletion

### Utils

#### `config.ts`

**Purpose**: Configuration persistence utilities

```typescript
getConfig(): PluginConfig      // Load from localStorage
saveConfig(config): void       // Save to localStorage
isValidUrl(url): boolean       // Validate URL format
```

#### `mockResponses.ts`

**Purpose**: Demo mode response generation

```typescript
getMockResponse(message, context): string  // Generate mock response
simulateDelay(): Promise<void>             // Simulate AI thinking
```

### Components

#### `AIAssistant` (Main Component)

**Purpose**: Main chat interface

**Responsibilities**:
- Render chat UI
- Handle user input
- Display messages
- Show loading states
- Display server status

**Does NOT**:
- Handle API calls (uses hooks)
- Manage state logic (uses hooks)
- Parse/format data (uses utils)

#### `Settings`

**Purpose**: Configuration dialog

**Features**:
- Toggle demo mode
- Configure server URL
- URL validation
- Save to persistent storage

## 🔄 Data Flow

```
User Input
    ↓
AIAssistant Component
    ↓
useChat Hook
    ↓
┌─────────────────────┐
│  Mock Mode?         │
├─────────────────────┤
│ YES          │  NO  │
│ ↓            │  ↓   │
│ mockResponses│aiService
└──────┬───────┴──┬───┘
       │          │
       ↓          ↓
   Message Added to State
       ↓
   Component Re-renders
       ↓
   UI Updates
```

## 🎨 State Management

### Local State (React Hooks)
- Input field value
- Dialog open/closed states
- Temporary UI states

### Hook State
- Chat messages (`useChat`)
- Loading states (`useChat`)
- Configuration (`useConfig`)

### Persistent State (localStorage)
- Plugin configuration
- (Future: Message history)

## 🔌 Integration Points

### Assurance Plugin Bridge

**Hooks Used**:
```typescript
const events = useFilteredEvents()      // Session events
const session = useSession()            // Session metadata
const environment = useEnvironment()    // Environment info
```

**Context Sent to AI**:
```typescript
{
  sessionId: session?.sessionId,
  sessionName: session?.name,
  eventCount: events?.length,
  events: events?.slice(0, 100),  // Configurable
  environment,
}
```

### AI Server API

**Required Endpoints**:
- `GET /health` → Returns 200 OK
- `POST /chat` → Accepts ChatRequest, returns ChatResponse

**Request Format**:
```json
{
  "message": "User's question",
  "context": { ... },  // Session context
  "history": [ ... ]   // Previous messages
}
```

**Response Format**:
```json
{
  "response": "AI's answer"  // or "message"
}
```

## 🚀 Future Enhancements

### Ready to Add:

1. **Message Persistence**
   - Store in localStorage
   - Load on mount
   - Export/import functionality

2. **Streaming Responses**
   - Update `aiService.ts` to handle SSE/WebSocket
   - Add streaming state to `useChat`
   - Update UI for progressive rendering

3. **Advanced Configuration**
   - Multiple AI models
   - Temperature/parameters
   - Custom prompts
   - Rate limiting

4. **Analytics**
   - Track usage metrics
   - Error reporting
   - Performance monitoring

5. **Enhanced UX**
   - Message reactions
   - Copy to clipboard
   - Search history
   - Suggested questions

## 🧪 Testing Strategy

### Unit Tests
- `utils/`: Test pure functions
- `services/`: Test with mocked fetch
- `hooks/`: Test with React Testing Library

### Integration Tests
- Test component + hooks together
- Test API integration with mock server

### E2E Tests
- Full user workflows
- Settings persistence
- Error scenarios

## 📝 Best Practices Followed

✅ TypeScript strict mode  
✅ Explicit type definitions  
✅ Single responsibility principle  
✅ DRY (Don't Repeat Yourself)  
✅ Clean code principles  
✅ Consistent naming conventions  
✅ Comprehensive error handling  
✅ User-friendly error messages  
✅ Proper loading states  
✅ Accessible UI (Spectrum components)  
✅ Responsive design  
✅ Performance optimized  

## 🔧 Development Workflow

### Adding a New Feature

1. **Define types** in `types/index.ts`
2. **Add constants** in `constants/index.ts` if needed
3. **Create service functions** if external API needed
4. **Create/update hooks** for business logic
5. **Update components** for UI changes
6. **Test** thoroughly
7. **Document** in relevant README

### Example: Adding Message Export

```typescript
// 1. Add type
export interface ExportOptions {
  format: 'json' | 'txt' | 'csv';
  includeSystem: boolean;
}

// 2. Add util function
export function exportMessages(messages: Message[], options: ExportOptions): string {
  // Implementation
}

// 3. Add to useChat hook
const exportChat = useCallback((options: ExportOptions) => {
  return exportMessages(state.messages, options);
}, [state.messages]);

// 4. Add UI button in AIAssistant component
<Button onPress={() => exportChat({ format: 'json', includeSystem: false })}>
  Export
</Button>
```

## 📚 Resources

- [Adobe React Spectrum Docs](https://react-spectrum.adobe.com/)
- [Assurance Plugin API](../../docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Guide](https://react.dev/reference/react)

---

**Maintained by**: Mohd Ashraf (mashraf@adobe.com)  
**Last Updated**: December 10, 2025

