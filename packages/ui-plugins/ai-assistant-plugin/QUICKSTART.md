# AI Assistant Plugin - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Prerequisites

Make sure you have:
- Node.js 18+ installed
- Yarn package manager
- The AI agent server repository cloned

### Step 2: Install Dependencies

From the root of `assurance-plugins`:

```bash
yarn
yarn build --ignore sample-ui-plugin
```

### Step 3: Start the AI Agent Server

In a separate terminal, clone and run the AI agent server:

```bash
# Clone the AI agent server
git clone https://github.com/sagar-sharma-adobe/assurance-ai-agent
cd assurance-ai-agent

# Follow the README to install and run
# The server should be running on http://localhost:8000
```

### Step 4: Start the Plugin

From the root of `assurance-plugins`:

```bash
yarn workspace ai-assistant-plugin start
```

Or navigate to the plugin directory:

```bash
cd packages/ui-plugins/ai-assistant-plugin
yarn start
```

The plugin will be available at: `https://dev.adobe.com:4321`

### Step 5: Configure Assurance

1. **Add localhost mapping** (if not already done):
   ```bash
   echo "127.0.0.1 dev.adobe.com" | sudo tee -a /etc/hosts
   ```

2. **Open Assurance in dev mode**:
   - Navigate to: https://experience.adobe.com/?devMode=true#
   - Go to: Data Collection > Assurance
   - Select or create a session

3. **Bypass SSL warning** (first time only):
   - Open https://dev.adobe.com:4321/index.html in a new tab
   - Click "Advanced" and proceed to accept the certificate

4. **Register the plugin**:
   - In Assurance, open browser DevTools
   - Select the "Main Content" frame (in the `top` context)
   - Run this in the console:
   
   ```javascript
   window.localStorage.setItem('griffonPlugin', JSON.stringify({
       displayName: 'AI Assistant',
       src: 'https://dev.adobe.com:4321/index.html'
   }))
   ```

5. **Add the plugin to your session**:
   - Click the `Configure` button in the left panel
   - Find and add the "AI Assistant" plugin
   - The plugin should now appear in your plugin list!

### Step 6: Start Chatting!

You should now see the AI Assistant interface with:
- ✅ Green "AI Server Online" status indicator
- 📊 Session information (name, event count)
- 💬 Chat interface ready for your questions

Try asking:
- "What events are in this session?"
- "Are there any errors in the session?"
- "Summarize the user's journey"
- "What SDK versions are being used?"

## 🔧 Troubleshooting

### Plugin not showing up?
- Refresh the Assurance page
- Check that you ran the localStorage command in the correct frame
- Verify the plugin is running at https://dev.adobe.com:4321

### "AI Server Offline" status?
- Make sure the AI agent server is running on port 8000
- Check the server logs for errors
- Try clicking the "Refresh" button

### SSL Certificate errors?
- Visit https://dev.adobe.com:4321/index.html directly
- Click "Advanced" and accept the certificate
- Refresh Assurance

### No events showing?
- Make sure you have an active Assurance session
- Check that events are flowing into the session
- The plugin automatically accesses session events

## 📝 Development Tips

### Hot Reload
The plugin supports hot reload. Just save your changes and the plugin will automatically refresh.

### Debugging
- Use browser DevTools to debug the plugin
- Check the Console tab for errors
- Network tab shows API calls to the AI agent server

### Modifying the API Endpoint
Edit `src/components/AIAssistant.tsx`:
```typescript
const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000');
```

## 🎯 Next Steps

1. **Integrate with your team's AI agent server**
2. **Customize the UI** to match your needs
3. **Add more features** like:
   - Event filtering based on AI suggestions
   - Automated validation checks
   - Session comparison
   - Export chat history

## 📚 Additional Resources

- [Full README](./README.md)
- [AI Agent Server](https://github.com/sagar-sharma-adobe/assurance-ai-agent)
- [Assurance Plugin Documentation](../../../docs)
- [Assurance Next Wiki](https://wiki.corp.adobe.com/display/adms/Assurance+Next%3A+AI-Powered+Assurance+Sessions)

## 🤝 Need Help?

Contact the team:
- **Mohd Ashraf** (mashraf@adobe.com) - Plugin Development
- **Sagar Sharma** (sagsharma) - AI Agent Server
- **Akhil Jain** (akhiljain) - Vector DB Integration
- **Ishita Gambhir** (igambhir) - Vector DB Integration

---

Happy debugging with AI! 🤖✨

