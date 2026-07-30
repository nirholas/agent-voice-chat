# agent-voice-chat examples

AI voice chat with two agents (Bob & Alice) - speak to them and they speak back

## Example 1

```bash
git clone https://github.com/nirholas/agent-voice-chat.git
cd agent-voice-chat
npm install
cp .env.example .env   # add your API key(s)
npm start
```

## Example 2

```bash
cd packages/widget && npm install && npm run build
# copy packages/widget/dist/agent-voice-chat.min.js next to your site's assets
```

## Example 3

```text
User speaks → Mic capture → Voice Activity Detection
  ├─ WebRTC path: audio stream ↔ OpenAI Realtime API (bidirectional)
  └─ Socket path: audio → Server STT → LLM → TTS → audio playback
```

## Example 4

```bash
AI_PROVIDER=openai          # openai | openai-chat | claude | groq
OPENAI_API_KEY=sk-...       # Required for OpenAI providers and OpenAI TTS
ANTHROPIC_API_KEY=sk-ant-.. # Required for Claude provider
GROQ_API_KEY=gsk_...        # Required for Groq provider and Groq STT
STT_PROVIDER=groq           # groq | openai (for socket-based providers)
TTS_PROVIDER=openai         # openai | elevenlabs | browser
```

## Example 5

```text
agent-voice-chat/
├── server.js                 # Express + Socket.IO server
├── agents.config.json        # Agent personality definitions
├── agent-registry.js         # Dynamic agent management
├── room-manager.js           # Room isolation and multi-tenancy
├── providers/
│   ├── index.js              # Provider factory
│   ├── openai-realtime.js    # WebRTC provider
│   ├── openai-chat.js        # OpenAI Chat API provider
│   ├── claude.js             # Anthropic Claude provider
│   ├── groq.js               # Groq provider
│   ├── stt.js                # Speech-to-text (Whisper)
│   ├── tts.js                # Text-to-speech
│   └── conversation-history.js
├── public/
│   ├── index.html            # Landing page
│   ├── voice.html            # Dynamic agent page
│   └── js/                   # Client-side audio + Socket.IO logic
└── packages/
    ├── core/                 # Framework-agnostic client
    ├── react/                # React <VoiceChat /> component
    ├── vue/                  # Vue <VoiceChat /> component
    └── widget/               # Embeddable script-tag widget
```


Every snippet above is taken from the [repository documentation](https://github.com/nirholas/agent-voice-chat#readme).
