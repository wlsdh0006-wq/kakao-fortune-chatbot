import type { Express } from "express";
import { createServer, type Server } from "http";
import { getFortuneResponse } from "./openai";
import { log } from "./app";

// KakaoTalk webhook request interface
interface KakaoRequest {
  intent: {
    id: string;
    name: string;
  };
  userRequest: {
    timezone: string;
    params: {
      ignoreMe: string;
    };
    block: {
      id: string;
      name: string;
    };
    utterance: string;
    lang: string;
    user: {
      id: string;
      type: string;
      properties: Record<string, unknown>;
    };
  };
  bot: {
    id: string;
    name: string;
  };
  action: {
    name: string;
    clientExtra: Record<string, unknown> | null;
    params: Record<string, string>;
    id: string;
    detailParams: Record<string, unknown>;
  };
}

// KakaoTalk response interface
interface KakaoResponse {
  version: string;
  template: {
    outputs: Array<{
      simpleText: {
        text: string;
      };
    }>;
  };
}

// Helper function to create KakaoTalk response
function createKakaoResponse(text: string): KakaoResponse {
  return {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: text
          }
        }
      ]
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // KakaoTalk fortune webhook endpoint
  app.post("/kakao/fortune", async (req, res) => {
    const startTime = Date.now();
    
    try {
      const kakaoRequest = req.body as KakaoRequest;
      
      // Extract user message from the request
      const userMessage = kakaoRequest?.userRequest?.utterance || "";
      const userId = kakaoRequest?.userRequest?.user?.id || "unknown";
      
      // Log incoming request
      log(`[Kakao Fortune] User: ${userId}, Message: "${userMessage}"`, "kakao");
      
      if (!userMessage.trim()) {
        log(`[Kakao Fortune] Empty message received`, "kakao");
        const response = createKakaoResponse("메시지를 입력해주세요. (Please enter a message.)");
        return res.json(response);
      }
      
      // Get response from OpenAI
      const aiResponse = await getFortuneResponse(userMessage);
      
      const duration = Date.now() - startTime;
      log(`[Kakao Fortune] Response generated in ${duration}ms`, "kakao");
      
      // Return KakaoTalk formatted response
      const response = createKakaoResponse(aiResponse);
      return res.json(response);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      log(`[Kakao Fortune] Error after ${duration}ms: ${error instanceof Error ? error.message : "Unknown error"}`, "kakao");
      
      // Return graceful fallback response
      const fallbackResponse = createKakaoResponse(
        "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n(Sorry, a temporary error occurred. Please try again later.)"
      );
      return res.json(fallbackResponse);
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
