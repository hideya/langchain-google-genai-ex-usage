import "dotenv/config";
import { ChatGoogleGenerativeAIEx } from '@hideya/langchain-google-genai-ex';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { HumanMessage } from '@langchain/core/messages';

// Set up MCP client with complex tools (like Notion)
const client = new MultiServerMCPClient({
  mcpServers: {
    notion: {
      transport: "stdio",
      command: "npx",
      args: ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    }
  }
});

const mcpTools = await client.getTools();

// Use the enhanced ChatGoogleGenerativeAI
// const llm = new ChatGoogleGenerativeAI({ model: "google-2.5-flash" });
const llm = new ChatGoogleGenerativeAIEx({ model: "google-2.5-flash" });

// Create agent with MCP tools
const agent = createReactAgent({ llm, tools: mcpTools });

// This works! No more schema errors
const result = await agent.invoke({
  messages: [new HumanMessage("Tell me about my Notion account")]
});

console.log(result.messages[result.messages.length - 1].content);

await client.close();
