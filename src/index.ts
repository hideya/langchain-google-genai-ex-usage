import "dotenv/config";
import { ChatGoogleGenerativeAIEx } from '@h1deya/langchain-google-genai-ex';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

// const MODEL_NAME = "gemini-1.5-flash";
const MODEL_NAME = "gemini-2.5-flash";

// Create MCP client and connect to servers
const client = new MultiServerMCPClient({
  mcpServers: {
    // This Fetch server (mcp-server-fetch==2025.4.7) fails
    fetch: {
      command: "uvx",
      args: [
        "mcp-server-fetch==2025.4.7"
      ]
    },

    // // This Airtable local server (airtable-mcp-server@1.6.1) fails
    // airtable: {
    //   transport: "stdio",
    //   command: "npx",
    //   args: ["-y", "airtable-mcp-server@1.6.1"],
    //   env: {
    //     "AIRTABLE_API_KEY": `${process.env.AIRTABLE_API_KEY}`,
    //   }
    // },

    // // NOTE: comment out "fetch" when you use "notion".
    // // They both have a tool named "fetch," which causes a conflict.
    //
    // // Notion local server (@notionhq/notion-mcp-server@1.9.0) fails
    // "notion": {
    //     "command": "npx",
    //     "args": ["-y", "@notionhq/notion-mcp-server@1.9.0"],
    //     "env": {
    //         "NOTION_TOKEN": "${NOTION_INTEGRATION_SECRET}"
    //     }
    // },

    // // Notion remote server has fixed the issue
    // notion: {
    //   transport: "stdio",
    //   "command": "npx",  // OAuth via "mcp-remote"
    //   "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"],
    // },

    // // Yields no issues — just a sanity check
    // filesystem: {
    //   command: "npx",
    //   args: [
    //     "-y",
    //     "@modelcontextprotocol/server-filesystem",
    //     "."  // path to a directory to allow access to
    //   ]
    // },

    // // Yields no issues — just a sanity check
    // github: {
    //   transport: "http",
    //   url: "https://api.githubcopilot.com/mcp/",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
    //   }
    // },
  }
});

(async () => {
  const mcpTools = await client.getTools();

  const llm = new ChatGoogleGenerativeAIEx({model: MODEL_NAME});
  // const llm = new ChatGoogleGenerativeAI({model: MODEL_NAME});

  const agent = createReactAgent({ llm, tools: mcpTools });
  const query = "Read https://en.wikipedia.org/wiki/MIT_License and summarize";
  // const query = "List all of the Airtable bases I have access to";
  // const query = "Tell me about my Notion account";
  // const query = "Tell me how many of directories in `.`";
  // const query = "Tell me about my GitHub profile"

  console.log("\x1b[33m");  // color to yellow
  console.log("[Q]", query);
  console.log("\x1b[0m");  // reset the color

  const messages =  { messages: [new HumanMessage(query)] };
  const result = await agent.invoke(messages);
  const response = result.messages[result.messages.length - 1].content;

  console.log("\x1b[36m");  // color to cyan
  console.log("[A]", response);
  console.log("\x1b[0m");  // reset the color

  await client.close();
})();
