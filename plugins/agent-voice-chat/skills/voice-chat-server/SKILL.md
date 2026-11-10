---
name: voice-chat-server
description: Run the agent-voice-chat server and manage its agents and rooms over the REST API, including sending a text message to an agent and streaming the reply. Use when the user wants multi-agent AI voice or text chat on their own server.
---

# agent-voice-chat server

`nirholas/agent-voice-chat` is a Node.js (Express and Socket.IO) server where several AI agents share a room with a user. Providers: OpenAI Realtime (WebRTC), OpenAI Chat, Claude and Groq, with speech-to-text from Groq or OpenAI and text-to-speech from OpenAI, ElevenLabs or the browser. The packages `@agent-voice-chat/react`, `/vue` and the widget are not on npm; build them from the repo's `packages/` directory.

## Run

```bash
git clone https://github.com/nirholas/agent-voice-chat.git
cd agent-voice-chat
npm install
cp .env.example .env     # add at least the key for the chosen provider
npm start                # node server.js, listens on PORT (default 3000)
```

Open `http://localhost:3000` for the built-in UI. `GET /api/health` is unauthenticated and returns 200, 207 (a warning in memory, sockets or rooms) or 503 while starting.

## Environment

- `AI_PROVIDER`: `openai`, `openai-chat`, `claude` or `groq`.
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `ELEVENLABS_API_KEY`: provider keys. OpenAI is also needed for OpenAI TTS.
- `STT_PROVIDER` (`groq` or `openai`) and `TTS_PROVIDER` (`openai`, `elevenlabs` or `browser`) for socket-based providers.
- `API_KEY`: when set, every `/api/*` route except `/api/health` requires `Authorization: Bearer <API_KEY>`. When unset, the API is open, so set it on any reachable host.
- `PORT`, `CORS_ORIGINS`, `MAX_ROOMS`, `RATE_LIMIT_GENERAL`.

Agents are defined in `agents.config.json` (id, name, personality, voice, theme) and can also be changed at runtime through the API.

## REST API

Responses use `{"ok": true, "data": ..., "meta": {...}}` on success and `{"error": {"code", "message"}}` on failure.

```bash
BASE=http://localhost:3000
AUTH="Authorization: Bearer $API_KEY"          # drop the header if API_KEY is unset

curl -s -H "$AUTH" $BASE/api/agents            # list agents
curl -s -H "$AUTH" -H 'Content-Type: application/json' -X POST $BASE/api/agents \
  -d '{"id":"alex","name":"Alex","personality":"Calm and thoughtful.","voice":"echo"}'
curl -s -H "$AUTH" -X PUT $BASE/api/agents/alex -H 'Content-Type: application/json' -d '{"personality":"Concise."}'
curl -s -H "$AUTH" -X DELETE $BASE/api/agents/alex
```

Agent ids must match `^[a-z0-9_-]+$` (max 50 chars). Other routes in the source:

- `POST /api/agents/:id/message` with `{"text": "...", "from": "api-user"}`, optional `?room=<roomId>`. Streams server-sent events: `data: {"delta": "..."}` chunks, then `{"done": true, "fullText": "..."}`. Not supported with the WebRTC provider (`AI_PROVIDER=openai`); use `openai-chat`, `claude` or `groq`.
- `GET /api/agents/:id/history`.
- `GET /api/rooms`, `POST /api/rooms` (`id`, `name`, `agentIds`, `maxParticipants`, `ttlMinutes`, `isPublic`), `GET /api/rooms/:id`, `GET /api/rooms/:id/messages`, `POST /api/rooms/:id/message` (`text`, `from`, `targetAgentId`), `DELETE /api/rooms/:id`.
- `GET /config`, `GET /state`, and `GET /api/docs` (Swagger UI). The full schema is in `openapi.json`.

## Example

Create a room with two agents, then talk to one:

```bash
curl -s -H "$AUTH" -H 'Content-Type: application/json' -X POST $BASE/api/rooms -d '{"id":"demo","agentIds":["bob","alice"]}'
curl -sN -H "$AUTH" -H 'Content-Type: application/json' -X POST "$BASE/api/agents/bob/message?room=demo" -d '{"text":"Say hello to Alice."}'
```

`bob` and `alice` exist only if they are in `agents.config.json`; list agents first and use real ids.
