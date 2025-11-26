# Design Guidelines: KakaoTalk Chatbot Webhook Server

## Project Classification

This is a **backend-only webhook service** with no user interface or visual design requirements. The project consists of:

- A Node.js Express server
- A single POST endpoint (`/kakao/fortune`)
- JSON request/response handling
- Integration with OpenAI API

## No Visual Design Needed

Since this is a pure backend API service, traditional design guidelines (typography, colors, layouts, spacing, components) **do not apply**. There is no frontend, no web pages, and no user-facing visual elements.

## Backend Architecture Guidelines

### API Endpoint Design
- **Route Structure**: `/kakao/fortune` POST endpoint
- **Request Format**: Accept KakaoTalk webhook JSON payload
- **Response Format**: Return KakaoTalk-compatible JSON response structure

### Code Organization
- Clean separation of concerns: route handlers, API clients, response formatters
- Modular structure for maintainability
- Clear error handling with appropriate HTTP status codes

### Response Structure
Follow KakaoTalk's SimpleText response format:
```
{
  "version": "2.0",
  "template": {
    "outputs": [
      {
        "simpleText": {
          "text": "Response from OpenAI"
        }
      }
    ]
  }
}
```

### Error Handling
- Graceful fallback responses when OpenAI API fails
- Appropriate logging for debugging
- Return valid KakaoTalk JSON even on errors

### Security & Performance
- Request validation for incoming webhooks
- Timeout handling for OpenAI API calls
- Rate limiting considerations
- Secure API key management via Replit integrations

## Summary

This project requires **backend implementation only** - focus on robust API integration, proper error handling, and correct JSON formatting rather than visual design principles.