/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * DEMO SCRIPT: AI Assistant for Adobe Assurance
 *
 * Based on actual session: naman-pn-test
 * Use Case: Mobile App with Adobe Journey Optimizer (AJO) In-App Messaging
 */

export interface DemoStep {
  question: string;
  response: string;
  typing: boolean;
  delay: number; // milliseconds
  context?: string; // explanation for presenter
}

export const DEMO_SCRIPT: DemoStep[] = [
  // Step 1: Session Overview
  {
    question: 'What can you tell me about this session?',
    response: `📊 **Session Analysis: naman-pn-test**

I've analyzed this Assurance session and here's what I found:

**Session Details:**
- **App Name**: MessagingDemoAppSwiftUI (iOS)
- **Duration**: 49.9 minutes (14:34 - 15:24)
- **Total Events**: 699 events captured
- **Environment**: Testing Adobe Journey Optimizer (AJO) messaging

**SDK Activity:**
- ✅ Edge Network: 25 requests sent
- ✅ AJO In-App Messaging: 18 message executions
- ✅ Audience Segments: 24 segments discovered
- ✅ Destinations: 24 destination requests fired

**Key Components:**
- 🔵 Edge Network (com.adobe.edge.konductor): 149 events
- 📱 Mobile SDK (com.adobe.griffon.mobile): 351 events
- 📬 AJO Messaging (com.adobe.experience_platform.ajo): 43 events
- 🎯 Destinations (com.adobe.experience.platform.edge.destinations): 96 events
- 👥 Segmentation: 24 events

**Session Health**: ✅ Active and processing correctly`,
    typing: true,
    delay: 2000,
    context: 'Comprehensive overview of the actual session'
  },

  // Step 2: Issues Analysis
  {
    question: 'Are there any issues or warnings I should know about?',
    response: `🔍 **Issue Analysis**

I've identified some configuration items to review:

**⚠️ Services Not Enabled (50 occurrences):**

1. **AJO Live Service** (25 instances)
   - Service: \`com.adobe.ajo.live\`
   - Issue: Not enabled on current events (conditions not met)
   - Impact: Real-time messaging updates may not be available
   - Status: Expected if not configured for this app

2. **Offer Decisioning (ODE)** (17 instances)
   - Service: \`com.adobe.experience_platform.ode\`
   - Issue: Not enabled on current events
   - Impact: Offer decisioning not active
   - Status: Normal if offers not being used

**✅ What's Working Well:**
- Edge Network: All 25 requests processed successfully
- AJO Messages: 18 successful executions
- Segmentation: 24 segments discovered and evaluated
- Destinations: All 24 requests fired successfully
- No critical errors or failures detected

**📋 Recommendations:**
1. If you need AJO Live updates, check your configuration
2. Verify if Offer Decisioning is required for your use case
3. These warnings are informational and don't block functionality

**Overall Health Score: 95/100** ✅`,
    typing: true,
    delay: 2500,
    context: 'Real issues from the actual session'
  },

  // Step 3: AJO Messaging Deep Dive
  {
    question: 'Tell me about the AJO messaging activity',
    response: `📬 **Adobe Journey Optimizer (AJO) Messaging Analysis**

**Summary:**
Your app is actively using AJO for in-app messaging campaigns.

**Message Execution Stats:**
- **Total Executions**: 18 message requests
- **Scope**: \`mobileapp://com.adobe.MessagingDemoAppSwiftUI\`
- **Decision Provider**: AJO
- **Success Rate**: 100% ✅

**Message Flow:**

1. **Request Phase** (18 events)
   - Service: \`com.adobe.experience_platform.ajo/request\`
   - App requests in-app messages for current context
   - All requests properly formatted

2. **Execution Phase** (18 events)
   - Service: \`com.adobe.experience_platform.ajo/execution\`
   - AJO evaluates user profile and context
   - Determines which messages to display

3. **Response Phase** (18 events)
   - Service: \`com.adobe.experience_platform.ajo/response\`
   - Messages delivered with personalization decisions
   - Each response includes event tokens for tracking

**Message Structure:**
Each message includes:
- ✅ Decision ID
- ✅ Campaign correlation ID
- ✅ Event token (for analytics)
- ✅ Scope details
- ✅ Activity ranking (priority: 5)

**Recommendation:**
Your AJO integration is working correctly. All message requests are being processed and delivered successfully.`,
    typing: true,
    delay: 3000,
    context: 'Details about AJO messaging from the session'
  },

  // Step 4: Edge Network Performance
  {
    question: 'How is the Edge Network performing?',
    response: `⚡ **Edge Network Performance Analysis**

**Overall Performance: Excellent** ✅

**Request Summary:**
- **Total Requests**: 25 Edge Network hits
- **Hit Received**: 25 events (100%)
- **Hit Processed**: 25 events (100%)
- **Success Rate**: 100%

**Processing Pipeline:**

\`\`\`
Request → Datastream → Segmentation → Destinations → Response
   25         25           24              24          25
\`\`\`

**Detailed Breakdown:**

1. **Request Received** (24 events)
   - All requests properly received by Edge Network
   - Average interval: ~2 minutes per request

2. **Datastream Processing** (25 events)
   - All requests routed through datastream
   - No configuration errors

3. **Edge Segmentation** (24 events)
   - Real-time audience evaluation
   - 24 segments discovered across requests
   - Service: \`com.adobe.experience_platform.edge_segmentation\`

4. **Destinations** (24 events)
   - **Applicable Destinations**: 24 evaluated
   - **Fired Destinations**: 24 executed
   - All destination requests successful

**Network Health Indicators:**
- ✅ No timeout errors
- ✅ No retry attempts needed
- ✅ Consistent response times
- ✅ All services responding

**Performance Grade: A+** 🎉

The Edge Network is processing all requests efficiently with no delays or failures.`,
    typing: true,
    delay: 3500,
    context: 'Edge Network performance metrics'
  },

  // Step 5: Segmentation Analysis
  {
    question: 'What segments is the user qualifying for?',
    response: `👥 **Audience Segmentation Analysis**

**Segment Discovery:**
- **Total Evaluations**: 24 segment checks
- **Service**: Edge Segmentation (real-time)
- **Evaluation Type**: Server-side on Edge Network

**Segmentation Flow:**

Each Edge request triggers segment evaluation:

\`\`\`
User Event → Edge → Segment Evaluation → Segment Match → Personalization
\`\`\`

**Key Insights:**

1. **Real-Time Segmentation** ✅
   - Segments evaluated on every Edge Network request
   - Instant qualification/disqualification
   - No batch delay

2. **Segments Discovered**: 24 instances
   - Event: \`segmentsDiscovered\`
   - Each request evaluates user against all active segments
   - Results used for downstream personalization

3. **Impact on Experience:**
   - AJO messages personalized based on segments
   - Destinations triggered for matching segments
   - Real-time audience updates

**Common Segment Use Cases:**
- 📱 First-time app users
- 🛒 Shopping cart abandoners
- ⭐ High-value customers
- 🎯 Campaign target audiences
- 📍 Location-based segments

**Destination Integration:**
- **Applicable Destinations**: 24 evaluated
- **Fired Destinations**: 24 activated
- Segments matched to configured destinations

**Recommendation:**
Your segment evaluation is working optimally. All 24 Edge requests successfully evaluated segments in real-time.

💡 **Tip**: Check your Adobe Experience Platform UI to see which specific segments this user qualified for during the session.`,
    typing: true,
    delay: 4000,
    context: 'Segmentation insights from the session'
  },

  // Step 6: Connection Stability
  {
    question: 'Was the connection stable throughout the session?',
    response: `🔌 **Connection Stability Analysis**

**Session Timeline**: 49.9 minutes (14:34 - 15:24)

**Connection Events:**
- **Connect**: 5 events
- **Disconnect**: 5 events

**Connection Pattern:**

\`\`\`
14:34 ━━━━━ Connected ━━━━━ Disconnected ━━━━━ Connected ━━━━━
       └─ Active session ─┘  └─ Reconnect ─┘  └─ Stable ─┘
\`\`\`

**Analysis:**

1. **Multiple Reconnections Detected** ⚠️
   - 5 connection cycles during 50-minute session
   - Average connection duration: ~10 minutes
   - Reconnects are relatively frequent

2. **Possible Causes:**
   - App going to background/foreground
   - Network switching (WiFi ↔ Cellular)
   - Testing workflow (stop/start debugging)
   - Normal mobile app behavior

3. **Impact on Data:**
   - ✅ No event loss detected
   - ✅ All 699 events captured successfully
   - ✅ Edge Network requests unaffected
   - ✅ AJO messages delivered correctly

**Connection Quality: Good** ✅

Despite multiple reconnections, all events were captured and no data was lost.

**For Production Apps:**
- This connection pattern is normal for mobile apps
- Assurance handles reconnections gracefully
- No action required unless connection issues cause feature failures

**Recommendation:**
Connection behavior appears normal for a test session. If this were a production issue investigation, the multiple reconnects wouldn't impact your debugging ability.`,
    typing: true,
    delay: 3500,
    context: 'Connection stability from actual connect/disconnect events'
  },

  // Step 7: Destinations & Data Flow
  {
    question: 'Tell me about destinations and data flow',
    response: `🎯 **Destinations & Data Flow Analysis**

**Destination Activity:**
- **Service**: \`com.adobe.experience.platform.edge.destinations\`
- **Total Events**: 96 destination-related events
- **Execution Rate**: 24 successful destination fires

**Data Flow Pipeline:**

\`\`\`
Mobile App
    ↓
Edge Network Request (25×)
    ↓
Segmentation (24×)
    ↓
┌───────────────────────────┐
│  Applicable Destinations  │ ← 24 evaluations
│  (Rules matched)          │
└───────────────────────────┘
    ↓
┌───────────────────────────┐
│  Fired Destinations       │ ← 24 activations
│  (Data sent)              │
└───────────────────────────┘
    ↓
Downstream Systems
\`\`\`

**Destination Events Breakdown:**

1. **Response Events** (24)
   - \`com.adobe.experience.platform.edge.destinations/response\`
   - Acknowledgment that destinations were processed
   - 100% success rate

2. **Applicable Destinations** (24)
   - System evaluated which destinations apply
   - Based on segment membership and rules
   - All evaluations successful

3. **Fired Destinations** (24)
   - Data successfully sent to configured destinations
   - No failures or retries needed

**What This Means:**

✅ **Perfect Data Flow**: All 24 Edge requests resulted in:
- Segment evaluation
- Destination matching  
- Data transmission

**Common Destination Types:**
- 📊 Analytics platforms
- 📱 Mobile marketing tools
- 🎯 Ad networks
- 📧 Email service providers
- 🔄 CRM systems

**Performance Metrics:**
- **Latency**: Minimal (processed in real-time)
- **Reliability**: 100% success rate
- **Coverage**: All applicable destinations fired

**Best Practice Check** ✅
Your destination configuration is optimal:
- No missed destinations
- No failed transmissions
- Real-time activation working correctly

This indicates your datastream and destination configuration is properly set up!`,
    typing: true,
    delay: 4000,
    context: 'Destinations analysis from the session'
  },

  // Step 8: Mobile SDK Health
  {
    question: 'How is the Mobile SDK performing?',
    response: `📱 **Mobile SDK Health Check**

**SDK Activity Overview:**
- **Total SDK Events**: 351 events (50% of session)
- **Vendor**: \`com.adobe.griffon.mobile\`
- **Platform**: iOS (MessagingDemoAppSwiftUI)
- **Session Duration**: 49.9 minutes

**SDK Performance: Excellent** ✅

**Event Distribution:**

\`\`\`
Mobile SDK Events:        351 (50.2%)
Edge Network Events:      149 (21.3%)
Destinations:              96 (13.7%)
AJO Events:                43 (6.2%)
Other Services:            60 (8.6%)
────────────────────────────────────
Total:                    699 (100%)
\`\`\`

**SDK Integration Quality:**

1. **Core Functionality** ✅
   - All SDK extensions loaded successfully
   - No initialization errors
   - Proper event forwarding to Edge Network

2. **Network Communication** ✅
   - 25 Edge Network requests sent
   - All requests properly formatted
   - No network timeout errors

3. **AJO Integration** ✅
   - 18 message executions
   - Proper scope configuration
   - Event tokens captured for tracking

4. **Data Collection** ✅
   - Events captured continuously
   - No gaps in timeline
   - Proper timestamping

**Performance Indicators:**

| Metric | Status | Value |
|--------|--------|-------|
| Event Processing | ✅ Excellent | 699 events |
| Network Success | ✅ 100% | 25/25 |
| AJO Messages | ✅ Working | 18 executed |
| Segments | ✅ Active | 24 evaluated |
| Destinations | ✅ Firing | 24/24 |

**Configuration Check:**

✅ **Properly Configured:**
- Edge Network endpoint
- Datastream ID
- AJO messaging scope
- Destination settings
- Segmentation rules

**No Issues Detected:**
- No missing required configuration
- No SDK crashes or errors
- No event loss
- No performance degradation

**Recommendation:**
Your Mobile SDK implementation is production-ready! All integrations are working correctly and performance is optimal.

**Next Steps:**
- Deploy to production with confidence
- Monitor real user sessions
- Set up alerts for any future issues`,
    typing: true,
    delay: 4000,
    context: 'Mobile SDK health from the session data'
  },

  // Step 9: Summary & Recommendations
  {
    question: 'Can you summarize the session and give me recommendations?',
    response: `📋 **Session Summary & Recommendations**

---

## 🎯 Executive Summary

**Session**: naman-pn-test  
**Duration**: 49.9 minutes  
**Status**: ✅ Healthy & Production-Ready

---

## 📊 Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Total Events | 699 | ✅ Good volume |
| Edge Requests | 25 | ✅ All successful |
| AJO Messages | 18 executions | ✅ Working |
| Segments | 24 evaluated | ✅ Real-time |
| Destinations | 24 fired | ✅ 100% success |
| SDK Health | Excellent | ✅ Production-ready |

---

## ✅ What's Working Perfectly

1. **Edge Network Integration**
   - 100% success rate on all requests
   - Real-time processing
   - No latency issues

2. **AJO In-App Messaging**
   - All 18 message requests executed
   - Proper decision flow
   - Event tracking configured

3. **Audience Segmentation**
   - Real-time evaluation on every request
   - 24 segment checks completed
   - Feeding into personalization

4. **Destinations**
   - All applicable destinations fired
   - 100% success rate
   - Data flowing to downstream systems

5. **Mobile SDK**
   - 351 events captured
   - No crashes or errors
   - Proper configuration

---

## ⚠️ Minor Observations

1. **AJO Live Service** (Informational)
   - Not enabled (25 instances)
   - Impact: None if not needed
   - Action: Enable only if real-time updates required

2. **Offer Decisioning** (Informational)
   - Not enabled (17 instances)
   - Impact: None if offers not used
   - Action: Enable only if using offers

3. **Connection Reconnects** (Normal)
   - 5 reconnection cycles
   - Impact: None - all data captured
   - Cause: Typical mobile app behavior

---

## 🚀 Recommendations

### Immediate Actions: None Required ✅
Your implementation is working correctly!

### Optional Enhancements:

**1. Service Configuration Review**
- Decision: Do you need AJO Live updates?
- Decision: Do you plan to use Offer Decisioning?
- If yes to either, enable in your Edge configuration

**2. Production Monitoring Setup**
- ✅ Your implementation is ready for production
- Set up dashboards to track:
  - Edge Network success rates
  - AJO message delivery
  - Segment qualification trends
  - Destination firing rates

**3. Testing Recommendations**
- Test different user segments
- Verify message personalization
- Test offline/online transitions
- Validate all AJO campaigns

---

## 💡 Best Practices Observed

✅ Your implementation follows best practices:
- Proper SDK configuration
- Correct Edge Network setup
- AJO messaging properly scoped
- Segments evaluating in real-time
- Destinations configured correctly
- Event tracking in place

---

## 🎉 Final Verdict

**Production Readiness: 95/100**

This is an excellent implementation! The session shows:
- No critical errors
- All integrations working
- Optimal performance
- Proper data flow

**You're ready to ship! 🚀**

---

## 📚 Next Steps

1. **Deploy to Production** - Your setup is solid
2. **Monitor Initial Users** - Watch for edge cases
3. **Iterate on Messaging** - Optimize AJO campaigns
4. **Scale Confidently** - Infrastructure is ready

**Questions? Need help with anything specific?** 🤖`,
    typing: true,
    delay: 4500,
    context: 'Comprehensive summary with actionable recommendations'
  }
];

/**
 * Get demo script for automated playback
 */
export function getDemoScript(): DemoStep[] {
  return DEMO_SCRIPT;
}

/**
 * Get specific demo step
 */
export function getDemoStep(index: number): DemoStep | undefined {
  return DEMO_SCRIPT[index];
}

/**
 * Get total number of demo steps
 */
export function getDemoStepCount(): number {
  return DEMO_SCRIPT.length;
}
