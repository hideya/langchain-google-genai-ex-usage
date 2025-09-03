import "dotenv/config";
import { ChatGoogleGenerativeAIEx, transformMcpToolsForGemini } from '@hideya/langchain-google-genai-ex';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { HumanMessage } from '@langchain/core/messages';

// Set up MCP client with complex tools (like Notion)
const client = new MultiServerMCPClient({
  mcpServers: {
    fetch: {
      command: "uvx",
      args: [
        "mcp-server-fetch"
      ]
    },
    // notion: {
    //   transport: "stdio",
    //   command: "npx",
    //   args: ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
    // },
    // airtable: {
    //   transport: "stdio",
    //   command: "npx",
    //   args: ["-y", "airtable-mcp-server"],
    //   env: {
    //     "AIRTABLE_API_KEY": `${process.env.AIRTABLE_API_KEY}`,
    //   }
    // },
  }
});

const mcpTools = await client.getTools();


// // Option A: Using the Transform Function
// const llm = new ChatGoogleGenerativeAI({ model: "gemini-1.5-flash" });
// const transformedTools = transformMcpToolsForGemini(mcpTools);
// const agent = createReactAgent({ llm, tools: transformedTools });


// Option B: Using the Drop-in Replacement Class
const llm = new ChatGoogleGenerativeAIEx({ model: "gemini-1.5-flash" });
const agent = createReactAgent({ llm, tools: mcpTools });


const query = "Read the top news headlines on bbc.com";
// const query = "Tell me about my Notion account";
// const query = "Tell me about my Airtable account";


// This works! No more schema errors
const result = await agent.invoke({
  messages: [new HumanMessage(query)]
});

console.log(result.messages[result.messages.length - 1].content);

await client.close();
