# KakaoTalk Chatbot Webhook Server

## Overview
A Node.js Express webhook server for KakaoTalk chatbot integration. This server receives POST requests from KakaoTalk, processes user messages through OpenAI API, and returns responses in KakaoTalk's required JSON format.

## Project Structure
```
server/
├── app.ts          # Express application setup
├── routes.ts       # API routes including /kakao/fortune endpoint
├── openai.ts       # OpenAI API integration
├── storage.ts      # Storage interface (not used for this webhook)
├── index-dev.ts    # Development entry point
└── index-prod.ts   # Production entry point
```

## API Endpoints

### POST /kakao/fortune
KakaoTalk webhook endpoint for fortune-telling chatbot.

**Request Format** (from KakaoTalk):
```json
{
  "userRequest": {
    "utterance": "User's message",
    "user": {
      "id": "user_id"
    }
  }
}
```

**Response Format** (to KakaoTalk):
```json
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "AI response message"
        }
      }
    ]
  }
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables
- `OPENAI_API_KEY`: Required. Your OpenAI API key for generating responses.
- `PORT`: Server port (defaults to 5000)

## Running the Server
```bash
npm run dev
```

## KakaoTalk Setup
1. Create a KakaoTalk channel at https://business.kakao.com/
2. Set up a skill in the KakaoTalk chatbot console
3. Configure the webhook URL to point to your server's `/kakao/fortune` endpoint
4. Enable the skill for your chatbot

## Technology Stack
- Node.js with Express
- TypeScript
- OpenAI API (gpt-5 model)
