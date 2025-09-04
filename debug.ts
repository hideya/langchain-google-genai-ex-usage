import "dotenv/config";
import { ChatGoogleGenerativeAIEx, transformMcpToolsForGemini } from '@h1deya/langchain-google-genai-ex';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MultiServerMCPClient } from '@langchain/mcp-adapters';

// Set up MCP client with fetch server
const client = new MultiServerMCPClient({
  mcpServers: {
    fetch: {
      command: "uvx",
      args: ["mcp-server-fetch"]
    },
  }
});

const mcpTools = await client.getTools();

console.log("=== ORIGINAL MCP TOOLS ===");
console.log("Number of tools:", mcpTools.length);
mcpTools.forEach((tool, index) => {
  console.log(`Tool ${index}:`, {
    name: tool.name,
    description: tool.description?.substring(0, 100),
    hasSchema: !!tool.schema,
    hasInputSchema: !!tool.inputSchema,
    schemaKeys: tool.schema ? Object.keys(tool.schema) : 'none',
    inputSchemaKeys: tool.inputSchema ? Object.keys(tool.inputSchema) : 'none',
    allKeys: Object.keys(tool)
  });
});

console.log("\n=== AFTER TRANSFORMATION ===");
const transformedTools = transformMcpToolsForGemini(mcpTools);
console.log("Number of transformed tools:", transformedTools.length);
transformedTools.forEach((tool, index) => {
  console.log(`Transformed Tool ${index}:`, {
    name: tool.name,
    description: tool.description?.substring(0, 100),
    hasSchema: !!tool.schema,
    hasInputSchema: !!tool.inputSchema,
    schemaKeys: tool.schema ? Object.keys(tool.schema) : 'none',
    inputSchemaKeys: tool.inputSchema ? Object.keys(tool.inputSchema) : 'none',
    allKeys: Object.keys(tool)
  });
});

console.log("\n=== SCHEMA COMPARISON ===");
mcpTools.forEach((original, index) => {
  const transformed = transformedTools[index];
  console.log(`Tool ${index} - ${original.name}:`);
  console.log("  Original schema:", JSON.stringify(original.schema || original.inputSchema, null, 2));
  console.log("  Transformed schema:", JSON.stringify(transformed.schema, null, 2));
  console.log("  Are they different?", JSON.stringify(original.schema || original.inputSchema) !== JSON.stringify(transformed.schema));
});

await client.close();
