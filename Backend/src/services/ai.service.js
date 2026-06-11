import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  tool,
  createAgent,
} from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { searchInternet } from "../services/internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet."),
  }),
});

const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],
  systemPrompt: `
You are a web-grounded assistant.

When a search tool is available:
- Use it for factual questions.
- Prefer tool results over your own knowledge.
- Answer using the tool output.
- If the tool provides information, do not ignore it.
`,
});

export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }
    }),
  });
  return response.messages[response.messages.length - 1].text;
}

export async function generateTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(
      `You are a helpful assistant that generates a concise and descriptive title for chat conversation.
      
      User will provide you with the content of the conversation, and you will generate a title that captures the essence of the conversaton in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic`,
    ),
    new HumanMessage(`
      Generate a title for a chat conversation based on the following first message:
      "${message}"
      `),
  ]);

  return response.text;
}
